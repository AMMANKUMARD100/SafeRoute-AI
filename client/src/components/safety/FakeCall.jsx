import { motion } from 'framer-motion';
import { useState } from 'react';
import { PhoneIcon, XMarkIcon } from '@heroicons/react/24/solid';

const FakeCall = () => {
  const [ringing, setRinging] = useState(false);
  const [active, setActive] = useState(false);
  

  const startFakeCall = () => {
    setRinging(true);
    // Simulate ring after 2 seconds
    setTimeout(() => {
      setRinging(false);
      setActive(true);
      // Vibrate once to mimic incoming call
      if (window.navigator.vibrate) window.navigator.vibrate(300);
      // Play a silent ringtone (optional)
    }, 2000);
  };

  const endCall = () => {
    setActive(false);
  };

  return (
    <div className="text-center">
      {!active && !ringing && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-medium backdrop-blur-md hover:bg-pink-600/30 transition"
          onClick={startFakeCall}
        >
          <PhoneIcon className="h-5 w-5 inline mr-2" />
          Fake Incoming Call
        </motion.button>
      )}

      {ringing && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="backdrop-blur-lg bg-gray-900/80 border border-pink-500/30 rounded-2xl p-6 shadow-2xl"
        >
          <p className="text-pink-400 text-lg font-bold mb-2">Mom calling...</p>
          <div className="flex justify-center gap-6 mt-4">
            <button
              onClick={endCall}
              className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <button
              onClick={() => { setRinging(false); setActive(true); }}
              className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center"
            >
              <PhoneIcon className="h-6 w-6" />
            </button>
          </div>
        </motion.div>
      )}

      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="backdrop-blur-lg bg-gray-900/80 border border-white/20 rounded-2xl p-6"
        >
          <p className="text-white text-lg mb-2">In call: <span className="font-bold">Mom</span></p>
          <p className="text-gray-400 text-sm mb-4">"Hi beta, just checking on you. Are you on your way home?"</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={endCall}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium"
            >
              End Call
            </button>
            <button className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-sm">
              Speaker
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FakeCall;