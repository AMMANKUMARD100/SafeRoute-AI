import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  ClockIcon,
  MapPinIcon,
  SunIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const RouteInfoCard = ({ route, onSelect, onStart }) => {
  if (!route) return null;

  const {
    type = 'safest',
    safetyScore = 85,
    duration = '35 mins',
    distance = '12 km',
    lightingScore = 78,
    crowdScore = 65,
  } = route;

  const typeColors = {
    safest: 'bg-emerald-500',
    fastest: 'bg-blue-500',
    balanced: 'bg-orange-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm backdrop-blur-lg bg-gray-900/80 border border-white/20 rounded-2xl p-4 shadow-2xl z-10"
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${typeColors[type]}`}>
          {type.toUpperCase()}
        </span>
        <div className="flex items-center gap-1 text-emerald-400">
          <ShieldCheckIcon className="h-5 w-5" />
          <span className="text-lg font-bold">{safetyScore}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 mb-4">
        <div className="flex items-center gap-1">
          <ClockIcon className="h-4 w-4 text-pink-400" />
          {duration}
        </div>
        <div className="flex items-center gap-1">
          <MapPinIcon className="h-4 w-4 text-pink-400" />
          {distance}
        </div>
        <div className="flex items-center gap-1">
          <SunIcon className="h-4 w-4 text-amber-400" />
          Light {lightingScore}%
        </div>
        <div className="flex items-center gap-1">
          <UsersIcon className="h-4 w-4 text-blue-400" />
          Crowd {crowdScore}%
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSelect}
          className="flex-1 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-pink-600/30 transition"
        >
          View Details
        </button>
        <button
          onClick={onStart}
          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-medium hover:brightness-110 transition"
        >
          Start Navigation
        </button>
      </div>
    </motion.div>
  );
};

export default RouteInfoCard;