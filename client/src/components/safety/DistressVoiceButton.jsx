import { motion } from 'framer-motion';
import { useState } from 'react';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';
import { useVoiceDistress } from '../../hooks/useVoiceDistress';

const DistressVoiceButton = () => {
  const [listening, setListening] = useState(false);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [stressPercent, setStressPercent] = useState(null);

  const handleDistress = (transcript, score) => {
    setAlertTriggered(true);
    setStressPercent(typeof score === 'number' ? Math.round(score) : null);
    console.log('Distress detected:', transcript, score);
    // TODO: optionally auto-trigger SOS when score exceeds configured threshold
  };

  const { startListening, stopListening } = useVoiceDistress(handleDistress);

  const toggleListening = () => {
    if (listening) {
      stopListening();
      setListening(false);
    } else {
      startListening();
      setListening(true);
      setAlertTriggered(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleListening}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center ${
          listening
            ? 'bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.6)]'
            : 'bg-white/10 border border-white/20'
        }`}
      >
        {listening ? (
          <StopIcon className="h-6 w-6 text-white" />
        ) : (
          <MicrophoneIcon className="h-6 w-6 text-pink-400" />
        )}
        {listening && (
          <span className="absolute inset-0 rounded-full bg-red-400/30 animate-ping" />
        )}
      </motion.button>
      <p className="text-xs text-gray-400">
        {listening ? 'Listening for distress...' : 'Voice Distress Detection'}
      </p>
      {alertTriggered && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm font-medium"
        >
          Distress alert triggered! {stressPercent !== null && `Stress: ${stressPercent}%`}
        </motion.p>
      )}
    </div>
  );
};

export default DistressVoiceButton;