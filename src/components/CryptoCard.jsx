import React from 'react';
import { motion } from 'framer-motion';

const CryptoCard = ({ 
  name, 
  symbol, 
  amount, 
  price, 
  value, 
  gbpValue, 
  formatCurrency, 
  color,
  initialInvestment = 920 // Default to £920 as requested
}) => {
  const colorClasses = {
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30'
  };

  const textColors = {
    orange: 'text-orange-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400'
  };

  // Calculate Profit/Loss
  const profitLoss = gbpValue - initialInvestment;
  const profitLossPercent = initialInvestment > 0 ? (profitLoss / initialInvestment) * 100 : 0;
  const isProfitable = profitLoss >= 0;
  const plColor = isProfitable ? 'text-green-400' : 'text-red-400';

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm border rounded-xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-gray-400 text-sm">{symbol}</p>
          </div>
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
            {/* Simple logo representation based on symbol letter */}
            <span className={`font-bold ${textColors[color]} text-xl`}>
              {symbol.charAt(0)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Holdings</p>
              <p className="font-mono text-lg font-medium">{amount} {symbol}</p>
            </div>
          </div>
          
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider">Current Price</p>
            <p className="font-semibold text-white">{formatCurrency(price)}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4 mt-4">
        <div className="flex justify-between items-start mb-1">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Current Value</p>
        </div>
        
        <div className="flex flex-col">
          <p className={`text-2xl font-bold ${textColors[color]} leading-tight`}>
            {formatCurrency(value)}
          </p>
          <p className="text-gray-300 text-sm font-medium mb-3">
            {formatCurrency(gbpValue, 'GBP')}
          </p>

          {/* Profit/Loss Section */}
          <div className="bg-black/20 rounded-lg p-2.5 flex items-center justify-between border border-white/5">
            <span className="text-xs text-gray-500 font-bold uppercase">Return</span>
            <div className="text-right">
              <p className={`text-sm font-bold font-mono ${plColor}`}>
                {isProfitable ? '+' : ''}{formatCurrency(profitLoss, 'GBP')}
              </p>
              <p className={`text-xs font-bold ${plColor}`}>
                {isProfitable ? '▲' : '▼'} {Math.abs(profitLossPercent).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CryptoCard;