import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrendingUp, FiTrendingDown, FiAlertCircle } = FiIcons;

const InvestmentSummary = ({ totalValue, initialInvestment, formatCurrency }) => {
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
          <div className="flex items-center mt-1">
            <p className="text-gray-400 text-sm">
              Initial Investment: {formatCurrency(initialInvestment, 'GBP')}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          {/* Loss Indicator - Replaced broken image with a reliable styled icon */}
          <AnimatePresence>
            {!isProfitable && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5, x: 20 }}
                className="mr-6 flex flex-col items-center justify-center"
              >
                {/* 
                  NOTE: If you have a working image URL, you can uncomment the img tag below 
                  and remove the div with SafeIcon.
                  
                  <img 
                    src="YOUR_IMAGE_URL_HERE" 
                    alt="Loss Indicator"
                    className="w-20 h-20 object-contain drop-shadow-lg"
                  />
                */}
                
                <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                  <SafeIcon icon={FiTrendingDown} className="text-3xl text-red-500" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="track-pattern p-4 rounded-lg bg-black/20 border border-white/5 min-w-[200px]">
            <div className="flex items-center mb-1">
              <SafeIcon 
                icon={isProfitable ? FiTrendingUp : FiTrendingDown} 
                className={`mr-2 ${isProfitable ? 'text-green-500' : 'text-red-500'}`} 
              />
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300">Profit/Loss</h4>
            </div>
            <p className={`text-2xl font-black font-mono ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
              {isProfitable ? '+' : ''}{formatCurrency(profitLoss, 'GBP')}
            </p>
            <p className={`text-sm font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
              {isProfitable ? '+' : ''}{profitLossPercentage.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InvestmentSummary;