import { motion } from 'framer-motion';
import { useState } from 'react';
import { triggerSOS } from '../../services/alertService';

const SOSButton = () => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentPosition = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not available in this browser'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });

  const handleSOS = async () => {
    setSending(true);
    setError(null);
    setSent(false);

    try {
      const pos = await getCurrentPosition();
      const response = await triggerSOS({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        message: 'Emergency! I need help immediately.',
      });

      if (response?.smsErrors?.length) {
        setError('SOS sent, but SMS could not be delivered to some contacts.');
      } else {
        setSent(true);
        if (window.navigator.vibrate) window.navigator.vibrate([200, 100, 200]);
      }
    } catch (err) {
      console.error('SOS failed', err);
      setError(err?.message || 'Unable to send SOS right now.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        onClick={handleSOS}
        disabled={sending}
        whileTap={{ scale: 0.9 }}
        className="relative w-32 h-32 rounded-full bg-gradient-to-br from-red-600 to-rose-700 text-white font-bold text-xl shadow-[0_0_30px_rgba(239,68,68,0.5)] disabled:opacity-70 disabled:cursor-wait"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-red-400/30 animate-ping" />
        <span className="relative z-10">{sending ? 'Sending...' : 'SOS'}</span>
      </motion.button>
      {sent && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-400 text-sm"
        >
          SOS alert sent. Check your phone now.
        </motion.p>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default SOSButton;