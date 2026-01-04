'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface InvestmentCardProps {
  investment: {
    id: number;
    type: string;
    name: string;
    symbol: string;
    entryPrice: number;
    currentPrice: number;
    quantity: number;
    category: string;
  };
}

export default function InvestmentCard({ investment }: InvestmentCardProps) {
  const profitLoss = (investment.currentPrice - investment.entryPrice) * investment.quantity;
  const profitLossPercent = ((investment.currentPrice - investment.entryPrice) / investment.entryPrice) * 100;
  const isProfit = profitLoss >= 0;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hisse':
        return 'from-blue-600 to-blue-800';
      case 'kripto':
        return 'from-orange-600 to-orange-800';
      case 'emtia':
        return 'from-yellow-600 to-yellow-800';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getTypeColor(investment.type)} text-white font-semibold`}>
            {investment.type.toUpperCase()}
          </span>
          <h3 className="text-xl font-bold text-white mt-2">{investment.name}</h3>
          <p className="text-gray-400 text-sm">{investment.symbol}</p>
        </div>
        <div className={`flex items-center gap-1 ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
          {isProfit ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Giriş Fiyatı</span>
          <span className="text-white">${investment.entryPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Güncel Fiyat</span>
          <span className="text-white font-semibold">${investment.currentPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Miktar</span>
          <span className="text-white">{investment.quantity}</span>
        </div>
        <div className="border-t border-gray-700 pt-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Kâr/Zarar</span>
            <div className={`font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
              {isProfit ? '+' : ''}${profitLoss.toFixed(2)}
            </div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-gray-400">Yüzde</span>
            <div className={`font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
              {isProfit ? '+' : ''}{profitLossPercent.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
