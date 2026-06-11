const Alert = require('../models/Alert');
const Trip = require('../models/Trip');
const User = require('../models/User');
const { sendSMS } = require('../utils/sendSMS');
const { sendEmail } = require('../utils/sendEmail');

// @desc    Trigger SOS alert
// @route   POST /api/alerts/sos
exports.triggerSOS = async (req, res) => {
  try {
    const { tripId, lat, lng, message, audioBase64 } = req.body;
    const userId = req.user.id;

    console.log('[SOS] triggerSOS called by user:', userId, 'body:', { tripId, lat, lng, message });

    // Save alert
    let alert;
    try {
      alert = await Alert.create({
        tripId: tripId || null,
        userId,
        type: 'sos',
        location: { lat, lng, timestamp: new Date() },
        message: message || 'Emergency SOS activated',
        audioRecording: audioBase64 ? `data:audio/wav;base64,${audioBase64}` : null,
        status: 'active',
      });
      console.log('[SOS] Alert created:', alert._id);
    } catch (err) {
      console.error('[SOS] Alert.create failed:', err);
      return res.status(500).json({ message: 'Failed to create alert', error: err.message, stack: err.stack });
    }

    // Update trip status if exists
    if (tripId) {
      try {
        await Trip.findByIdAndUpdate(tripId, {
          status: 'emergency',
          $push: { alerts: alert._id },
        });
        console.log('[SOS] Trip updated:', tripId);
      } catch (err) {
        console.error('[SOS] Trip update failed:', err);
        // Not fatal — continue
      }
    }

    // Notify the user and their emergency contacts
    let user;
    try {
      user = await User.findById(userId);
    } catch (err) {
      console.error('[SOS] Failed to fetch user:', err);
      return res.status(500).json({ message: 'Failed to fetch user', error: err.message, stack: err.stack });
    }

    if (user) {
      console.log('[SOS] User found:', user._id, 'contacts:', (user.emergencyContacts || []).length);
      const locationLink = `https://maps.google.com/?q=${lat},${lng}`;
      const recipients = new Set();

      const normalizePhone = (phone) => {
        if (!phone) return null;
        const trimmed = phone.trim();
        if (trimmed.startsWith('+')) return trimmed;
        if (trimmed.startsWith('0')) return `+91${trimmed.slice(1)}`;
        if (/^91[6-9]\d{9}$/.test(trimmed)) return `+${trimmed}`;
        return `+91${trimmed}`;
      };

      const fallbackPhone = normalizePhone(process.env.SOS_RECIPIENT_PHONE);
      if (fallbackPhone) {
        recipients.add(fallbackPhone);
      }

      if (user.phone) {
        const normalized = normalizePhone(user.phone);
        if (normalized) recipients.add(normalized);
      }

      if (user.emergencyContacts && user.emergencyContacts.length > 0) {
        user.emergencyContacts.forEach((contact) => {
          const normalized = normalizePhone(contact.phone);
          if (normalized) recipients.add(normalized);
        });
      }

      const smsErrors = [];

      if (recipients.size > 0) {
        const messageText = `🚨 EMERGENCY from ${user.name}! Location: ${locationLink}. Message: ${message}`;
        console.log('[SOS] Sending alert to:', [...recipients].join(', '));

        for (const phone of recipients) {
          try {
            await sendSMS(phone, messageText);
          } catch (err) {
            console.error(`SMS failed for ${phone}:`, err.message);
            smsErrors.push({ phone, error: err.message });
          }
        }
      } else {
        console.warn('[SOS] No valid recipient phone numbers found for SOS alert.');
      }

      if (user.emergencyContacts && user.emergencyContacts.length > 0) {
        for (const contact of user.emergencyContacts) {
          if (contact.email) {
            try {
              await sendEmail(
                contact.email,
                'Emergency Alert from SafeRoute AI',
                `${user.name} has triggered an SOS. Location: ${locationLink}\nMessage: ${message}`
              );
            } catch (err) {
              console.error(`Email failed for ${contact.email}:`, err.message);
            }
          }
        }
      }

      return res.status(201).json({ success: true, alertId: alert._id, smsErrors });
    }
    // If user not found for some reason
    return res.status(404).json({ message: 'User not found for SOS' });
  } catch (error) {
    console.error('[SOS] trigger failed:', error);
    res.status(500).json({ message: 'SOS trigger failed', error: error.message, stack: error.stack });
  }
};

// @desc    Send I'm Safe check‑in
// @route   POST /api/alerts/checkin
exports.checkIn = async (req, res) => {
  try {
    const { lat, lng, message } = req.body;
    const userId = req.user.id;

    const alert = await Alert.create({
      userId,
      type: 'checkin',
      location: { lat, lng, timestamp: new Date() },
      message: message || 'I am safe',
      status: 'resolved',
    });

    // Notify emergency contacts via SMS (and email) about the check-in
    try {
      const user = await User.findById(userId);
      if (user) {
        const normalizePhone = (phone) => {
          if (!phone) return null;
          const trimmed = phone.trim();
          if (trimmed.startsWith('+')) return trimmed;
          if (trimmed.startsWith('0')) return `+91${trimmed.slice(1)}`;
          if (/^91[6-9]\d{9}$/.test(trimmed)) return `+${trimmed}`;
          return `+91${trimmed}`;
        };

        const recipients = new Set();
        const fallbackPhone = normalizePhone(process.env.SOS_RECIPIENT_PHONE);
        if (fallbackPhone) recipients.add(fallbackPhone);
        if (user.phone) recipients.add(normalizePhone(user.phone));
        if (user.emergencyContacts && user.emergencyContacts.length) {
          user.emergencyContacts.forEach((c) => {
            const p = normalizePhone(c.phone);
            if (p) recipients.add(p);
          });
        }

        const smsErrors = [];
        if (recipients.size > 0) {
          const locationLink = `https://maps.google.com/?q=${lat},${lng}`;
          const text = `✅ ${user.name} is safe. Location: ${locationLink}. Message: ${message || 'I am safe.'}`;
          for (const phone of recipients) {
            try {
              await sendSMS(phone, text);
            } catch (err) {
              console.error(`Check-in SMS failed for ${phone}:`, err.message);
              smsErrors.push({ phone, error: err.message });
            }
          }
        }
        // Optionally email contacts
        if (user.emergencyContacts && user.emergencyContacts.length) {
          for (const c of user.emergencyContacts) {
            if (c.email) {
              try {
                await sendEmail(
                  c.email,
                  'Check-in: I am safe',
                  `${user.name} has checked in and is safe. Message: ${message || 'I am safe.'}`
                );
              } catch (err) {
                console.error(`Check-in email failed for ${c.email}:`, err.message);
              }
            }
          }
        }
        return res.status(201).json({ success: true, alertId: alert._id, smsErrors });
      }
    } catch (err) {
      console.error('[CheckIn] notify contacts failed:', err);
    }

    res.status(201).json({ success: true, alertId: alert._id });
  } catch (error) {
    res.status(500).json({ message: 'Check-in failed', error: error.message });
  }
};

// @desc    Get all alerts for user
// @route   GET /api/alerts
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mark alert as resolved
// @route   PUT /api/alerts/:id/resolve
exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved' },
      { new: true }
    );
    res.json({ alert });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};