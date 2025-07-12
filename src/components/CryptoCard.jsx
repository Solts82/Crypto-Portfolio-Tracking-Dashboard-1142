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
  color 
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

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm border rounded-xl p-6 hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-gray-400 text-sm">{symbol}</p>
        </div>
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <span className={`font-bold ${textColors[color]}`}>₿</span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-gray-400 text-sm">Holdings</p>
          <p className="font-mono text-lg">{amount} {symbol}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Current Price</p>
          <p className="font-semibold">{formatCurrency(price)}</p>
        </div>

        <div className="border-t border-gray-600 pt-3">
          <p className="text-gray-400 text-sm">Current Value</p>
          <p className={`text-xl font-bold ${textColors[color]}`}>
            {formatCurrency(value)}
          </p>
          <p className="text-gray-300 text-sm">
            {formatCurrency(gbpValue, 'GBP')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CryptoCard;