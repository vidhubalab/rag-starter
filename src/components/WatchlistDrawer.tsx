import React, { useState } from 'react';
import { X, Trash2, ArrowUpRight, ArrowDownRight, Briefcase, Star, DollarSign } from 'lucide-react';
import { MarketAsset, PaperTradePosition } from '../types/market';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: MarketAsset[];
  positions: PaperTradePosition[];
  onRemoveFromWatchlist: (assetId: string) => void;
  onSelectAsset: (asset: MarketAsset) => void;
  cashBalance: number;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlist,
  positions,
  onRemoveFromWatchlist,
  onSelectAsset,
  cashBalance,
}) => {
  const [activeTab, setActiveTab] = useState<'Watchlist' | 'Positions'>('Watchlist');

  if (!isOpen) return null;

  const totalPortfolioValue =
    cashBalance +
    positions.reduce((sum, pos) => {
      const positionValue = pos.shares * pos.currentPrice;
      return pos.type === 'BUY' ? sum + positionValue : sum - positionValue;
    }, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-[#1E222D] h-full shadow-2xl border-l border-[#E0E3EB] dark:border-[#2A2E39] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E0E3EB] dark:border-[#2A2E39] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('Watchlist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'Watchlist'
                  ? 'bg-[#2962FF] text-white'
                  : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              Watchlist ({watchlist.length})
            </button>
            <button
              onClick={() => setActiveTab('Positions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'Positions'
                  ? 'bg-[#2962FF] text-white'
                  : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Positions ({positions.length})
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#787B86] hover:text-[#131722] dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Portfolio Summary Card */}
        <div className="p-4 bg-[#F8F9FD] dark:bg-[#181B24] border-b border-[#E0E3EB] dark:border-[#2A2E39]">
          <div className="flex items-center justify-between text-xs text-[#787B86]">
            <span>Paper Portfolio Value</span>
            <span>Simulated Funds</span>
          </div>
          <div className="text-2xl font-black text-[#131722] dark:text-white tabular-nums mt-0.5">
            ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex justify-between items-center text-xs mt-1 text-[#787B86]">
            <span>Cash Available:</span>
            <span className="font-semibold text-[#131722] dark:text-white tabular-nums">
              ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Content Tab: Watchlist */}
        {activeTab === 'Watchlist' && (
          <div className="flex-1 overflow-y-auto divide-y divide-[#F0F3FA] dark:divide-[#242834]">
            {watchlist.length === 0 ? (
              <div className="p-10 text-center text-[#787B86] space-y-2">
                <Star className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-sm font-semibold">Your watchlist is empty</p>
                <p className="text-xs">
                  Star any index, stock, or crypto asset from the markets screen to monitor it here in real time.
                </p>
              </div>
            ) : (
              watchlist.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3.5 hover:bg-[#F8F9FD] dark:hover:bg-[#252A37] cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-full text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-xs"
                      style={{ backgroundColor: asset.badgeBg }}
                    >
                      {asset.badge}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors">
                        {asset.symbol}
                      </div>
                      <div className="text-[11px] text-[#787B86] truncate max-w-[140px]">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-sm tabular-nums text-[#131722] dark:text-white">
                        ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div
                        className={`text-xs font-semibold tabular-nums ${
                          asset.isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {asset.change > 0 ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(asset.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-[#787B86] hover:text-[#F23645] rounded-lg transition-all"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Content Tab: Positions */}
        {activeTab === 'Positions' && (
          <div className="flex-1 overflow-y-auto divide-y divide-[#F0F3FA] dark:divide-[#242834]">
            {positions.length === 0 ? (
              <div className="p-10 text-center text-[#787B86] space-y-2">
                <Briefcase className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-sm font-semibold">No open paper positions</p>
                <p className="text-xs">
                  Click on any asset card and hit "Buy" or "Sell" to open simulated positions with zero risk.
                </p>
              </div>
            ) : (
              positions.map((pos, idx) => {
                const pnl = (pos.currentPrice - pos.entryPrice) * pos.shares * (pos.type === 'BUY' ? 1 : -1);
                const pnlPercent = ((pos.currentPrice - pos.entryPrice) / pos.entryPrice) * 100 * (pos.type === 'BUY' ? 1 : -1);
                const isProfitable = pnl >= 0;

                return (
                  <div key={idx} className="p-3.5 space-y-1.5 hover:bg-[#F8F9FD] dark:hover:bg-[#252A37]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                            pos.type === 'BUY'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                          }`}
                        >
                          {pos.type}
                        </span>
                        <span className="font-bold text-sm text-[#131722] dark:text-white">
                          {pos.symbol}
                        </span>
                        <span className="text-xs text-[#787B86]">· {pos.shares} shares</span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-bold text-sm tabular-nums ${
                            isProfitable ? 'text-[#089981]' : 'text-[#F23645]'
                          }`}
                        >
                          {isProfitable ? '+' : ''}${pnl.toFixed(2)}
                        </span>
                        <span
                          className={`text-xs ml-1 font-semibold ${
                            isProfitable ? 'text-[#089981]' : 'text-[#F23645]'
                          }`}
                        >
                          ({isProfitable ? '+' : ''}{pnlPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#787B86] tabular-nums">
                      <span>Entry: ${pos.entryPrice.toFixed(2)}</span>
                      <span>Now: ${pos.currentPrice.toFixed(2)}</span>
                      <span className="text-[11px]">{pos.timestamp}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
