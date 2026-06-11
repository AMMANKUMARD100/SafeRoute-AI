import { motion } from 'framer-motion';
import { useState } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { sendCheckIn } from '../../services/alertService';

const CheckInButton = () => {
  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState(false);

  const handleCheckIn = async () => {
    setChecking(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const resp = await sendCheckIn({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            message: 'I am safe and on my way.',
          });
          if (resp?.smsErrors?.length) {
            // show a warning if some SMS deliveries failed
            console.warn('Some check-in SMS deliveries failed', resp.smsErrors);
          }
          setDone(true);
          setTimeout(() => setDone(false), 3000);
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCheckIn}
      disabled={checking}
      className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-all ${
        done
          ? 'bg-emerald-600/30 border border-emerald-500/30'
          : 'bg-white/10 border border-white/10 hover:bg-emerald-600/20'
      }`}
    >
      <ShieldCheckIcon className="h-5 w-5" />
      {done ? 'Check‑in Sent!' : checking ? 'Sending...' : 'I’m Safe'}
    </motion.button>
  );
};

export default CheckInButton;