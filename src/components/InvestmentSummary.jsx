import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrendingUp, FiTrendingDown } = FiIcons;

const InvestmentSummary = ({ 
  totalValue, 
  initialInvestment, 
  formatCurrency 
}) => {
  // Calculate profit/loss
  const profitLoss = totalValue - initialInvestment;
  const profitLossPercentage = (profitLoss / initialInvestment) * 100;
  const isProfitable = profitLoss >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 shadow-lg mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold text-white mb-1">Total Portfolio Value</h3>
          <p className="text-3xl font-bold text-green-400">
            {formatCurrency(totalValue, 'GBP')}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Initial Investment: {formatCurrency(initialInvestment, 'GBP')}
          </p>
        </div>
        
        <div className="track-pattern p-4 rounded-lg">
          <div className="flex items-center mb-1">
            <SafeIcon 
              icon={isProfitable ? FiTrendingUp : FiTrendingDown} 
              className={`mr-2 ${isProfitable ? 'text-green-500' : 'text-red-500'}`} 
            />
            <h4 className="font-semibold">Profit/Loss</h4>
          </div>
          <p className={`text-2xl font-bold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
            {profitLoss > 0 ? '+' : ''}{formatCurrency(profitLoss, 'GBP')}
          </p>
          <p className={`${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
            {profitLoss > 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default InvestmentSummary;