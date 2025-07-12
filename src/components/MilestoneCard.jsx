import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTarget } = FiIcons;

const MilestoneCard = ({ 
  crypto, 
  symbol, 
  milestonePrice, 
  holdingValue, 
  gbpValue, 
  formatCurrency, 
  color 
}) => {
  const colorClasses = {
    orange: 'from-orange-500/10 to-orange-600/10 border-orange-500/20',
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/20',
    purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/20'
  };

  const textColors = {
    orange: 'text-orange-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm border rounded-lg p-4 hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center mb-3">
        <SafeIcon icon={FiTarget} className={`text-lg ${textColors[color]} mr-2`} />
        <h4 className="font-semibold">
          {symbol} @ {formatCurrency(milestonePrice)}
        </h4>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-gray-400 text-xs">Portfolio Value</p>
          <p className={`font-bold ${textColors[color]}`}>
            {formatCurrency(holdingValue)}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">GBP Equivalent</p>
          <p className="text-gray-300 font-semibold">
            {formatCurrency(gbpValue, 'GBP')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default MilestoneCard;