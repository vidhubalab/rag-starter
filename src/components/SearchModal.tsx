import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, ArrowRight, Clock, Star } from 'lucide-react';
import { MarketAsset } from '../types/market';
import { ALL_SEARCHABLE_ASSETS } from '../data/mockMarketData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: MarketAsset) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectAsset }) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Stocks' | 'Crypto' | 'Indices' | 'Forex' | 'Futures'>('All');
  const [recentSearches, setRecentSearches] = useState<string[]>(['NVDA', 'BTCUSD', 'SPX', 'AAPL']);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAssets = ALL_SEARCHABLE_ASSETS.filter((asset) => {
    const matchQuery =
      asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
      asset.name.toLowerCase().includes(query.toLowerCase()) ||
      asset.subtitle.toLowerCase().includes(query.toLowerCase());

    if (!matchQuery) return false;

    if (categoryFilter === 'Stocks') return asset.category === 'US stocks';
    if (categoryFilter === 'Crypto') return asset.category === 'Crypto';
    if (categoryFilter === 'Indices') return asset.category === 'World stocks' || asset.symbol === 'SPX' || asset.symbol === 'NDX' || asset.symbol === 'DJI';
    if (categoryFilter === 'Forex') return asset.category === 'Forex';
    if (categoryFilter === 'Futures') return asset.category === 'Futures';

    return true;
  });

  const handleSelect = (asset: MarketAsset) => {
    if (!recentSearches.includes(asset.symbol)) {
      setRecentSearches([asset.symbol, ...recentSearches.slice(0, 4)]);
    }
    onSelectAsset(asset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#1E222D] rounded-2xl shadow-2xl border border-[#E0E3EB] dark:border-[#2A2E39] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E0E3EB] dark:border-[#2A2E39] gap-3">
          <Search className="w-5 h-5 text-[#787B86] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company name, index, or coin..."
            className="w-full bg-transparent text-[#131722] dark:text-white placeholder-[#787B86] text-base outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#787B86] hover:text-[#131722] dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded bg-[#F0F3FA] dark:bg-[#2A2E39] text-[#787B86] hover:text-[#131722] dark:hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#E0E3EB] dark:border-[#2A2E39] overflow-x-auto hide-scrollbar bg-neutral-50/50 dark:bg-[#171B26]">
          {(['All', 'Stocks', 'Crypto', 'Indices', 'Forex', 'Futures'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#2962FF] text-white'
                  : 'text-[#787B86] hover:text-[#131722] dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Recent Search Shortcuts */}
        {!query && (
          <div className="px-4 py-2.5 bg-gray-50/70 dark:bg-[#181B24] border-b border-[#E0E3EB] dark:border-[#2A2E39] flex items-center gap-2 overflow-x-auto text-xs text-[#787B86]">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium shrink-0">Recent:</span>
            {recentSearches.map((sym) => {
              const matched = ALL_SEARCHABLE_ASSETS.find((a) => a.symbol === sym);
              return (
                <button
                  key={sym}
                  onClick={() => {
                    if (matched) handleSelect(matched);
                    else setQuery(sym);
                  }}
                  className="px-2 py-0.5 rounded bg-white dark:bg-[#2A2E39] border border-[#E0E3EB] dark:border-[#363A45] hover:border-[#2962FF] text-[#131722] dark:text-[#D1D4DC] font-semibold"
                >
                  {sym}
                </button>
              );
            })}
          </div>
        )}

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-[#F0F3FA] dark:divide-[#242834]">
          {filteredAssets.length === 0 ? (
            <div className="py-12 text-center text-[#787B86] space-y-2">
              <Search className="w-8 h-8 mx-auto stroke-1 opacity-50" />
              <p className="text-sm font-medium">No instruments match "{query}"</p>
              <p className="text-xs">Try searching for tickers like NVDA, BTCUSD, SPX, or Apple</p>
            </div>
          ) : (
            filteredAssets.map((asset) => (
              <div
                key={asset.id + asset.symbol}
                onClick={() => handleSelect(asset)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8F9FD] dark:hover:bg-[#252A37] cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-xs"
                    style={{
                      backgroundColor: asset.badgeBg,
                      color: asset.badgeColor || '#FFFFFF',
                    }}
                  >
                    {asset.badge}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors">
                        {asset.symbol}
                      </span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[#787B86] font-medium">
                        {asset.exchange}
                      </span>
                    </div>
                    <span className="text-xs text-[#787B86] block truncate max-w-xs sm:max-w-md">
                      {asset.name} · {asset.subtitle}
                    </span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-4">
                  <div>
                    <div className="font-bold text-sm tabular-nums text-[#131722] dark:text-white">
                      ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-xs font-semibold flex items-center justify-end gap-0.5 tabular-nums ${
                        asset.isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {asset.isPositive ? '+' : ''}
                      {asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#787B86] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-gray-50 dark:bg-[#181B24] border-t border-[#E0E3EB] dark:border-[#2A2E39] text-xs text-[#787B86] flex items-center justify-between">
          <span>Showing {filteredAssets.length} results</span>
          <span className="hidden sm:inline">Use ↑↓ to navigate · Enter to select · Esc to close</span>
        </div>
      </div>
    </div>
  );
};
