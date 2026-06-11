import { motion } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  SunIcon,
  UsersIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

const SafetyScoreCard = ({ score = 86, breakdown = {} }) => {
  const {
    crime = 20,
    lighting = 78,
    crowd = 65,
    emergencyAccess = 80,
  } = breakdown;

  const getScoreColor = (val) => {
    if (val >= 80) return 'text-emerald-400';
    if (val >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 max-w-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Safety Score</h3>
        <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
          {score}<span className="text-sm">/100</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div>
            <p className="text-xs text-gray-400">Crime Risk</p>
            <p className="text-sm font-medium text-white">{crime}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SunIcon className="h-5 w-5 text-amber-400" />
          <div>
            <p className="text-xs text-gray-400">Lighting</p>
            <p className="text-sm font-medium text-white">{lighting}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UsersIcon className="h-5 w-5 text-blue-400" />
          <div>
            <p className="text-xs text-gray-400">Crowd</p>
            <p className="text-sm font-medium text-white">{crowd}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BuildingOfficeIcon className="h-5 w-5 text-purple-400" />
          <div>
            <p className="text-xs text-gray-400">Emergency Access</p>
            <p className="text-sm font-medium text-white">{emergencyAccess}%</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SafetyScoreCard;