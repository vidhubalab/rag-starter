import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MarketAsset, AssetCategory } from '../../types/market';
import { ALL_SEARCHABLE_ASSETS } from '../../data/mockMarketData';

interface ScreenersViewProps {
  initialCategory?: AssetCategory;
  onSelectAsset: (asset: MarketAsset) => void;
}

export const ScreenersView: React.FC<ScreenersViewProps> = ({
  initialCategory = 'US stocks',
  onSelectAsset,
}) => {
  const [assetClass, setAssetClass] = useState<string>(initialCategory);
  const [filterPerformance, setFilterPerformance] = useState<'All' | 'Gainers' | 'Losers'>('All');
  const [filterRating, setFilterRating] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'changePercent' | 'rsi'>('changePercent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const assetClasses = ['All', 'US stocks', 'World stocks', 'Crypto', 'Futures', 'Forex', 'ETFs'];

  const filteredAssets = ALL_SEARCHABLE_ASSETS.filter((item) => {
    if (assetClass !== 'All' && item.category !== assetClass) return false;
    if (filterPerformance === 'Gainers' && item.changePercent <= 0) return false;
    if (filterPerformance === 'Losers' && item.changePercent >= 0) return false;
    if (filterRating !== 'All' && item.technicalRating !== filterRating) return false;
    if (
      searchQuery &&
      !item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    let diff = 0;
    if (sortBy === 'price') diff = a.price - b.price;
    if (sortBy === 'changePercent') diff = a.changePercent - b.changePercent;
    if (sortBy === 'rsi') diff = a.rsi - b.rsi;
    return sortOrder === 'asc' ? diff : -diff;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[#131722] dark:text-white tracking-tight">
          Financial Market Screener
        </h1>
        <p className="text-sm text-[#787B86] mt-1">
          Scan global equities, digital assets, and currencies with multi-factor technical and valuation filters
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-white dark:bg-[#1E222D] border border-[#E0E3EB] dark:border-[#2A2E39] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Asset Class Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1">
          {assetClasses.map((cls) => (
            <button
              key={cls}
              onClick={() => setAssetClass(cls)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                assetClass === cls
                  ? 'bg-[#2962FF] text-white shadow-2xs'
                  : 'bg-[#F0F3FA] dark:bg-[#252A37] text-[#787B86] hover:text-[#131722] dark:hover:text-white'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E0E3EB] dark:border-[#2A2E39]">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#787B86] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in screener..."
              className="w-full bg-[#F0F3FA] dark:bg-[#252A37] text-xs rounded-xl pl-9 pr-3 py-2 text-[#131722] dark:text-white outline-none border-0 placeholder-[#787B86]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Performance filter */}
            <div className="flex items-center gap-1 bg-[#F0F3FA] dark:bg-[#252A37] p-1 rounded-lg text-xs font-semibold">
              {(['All', 'Gainers', 'Losers'] as const).map((perf) => (
                <button
                  key={perf}
                  onClick={() => setFilterPerformance(perf)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    filterPerformance === perf
                      ? 'bg-white dark:bg-[#1E222D] text-[#131722] dark:text-white shadow-2xs font-bold'
                      : 'text-[#787B86]'
                  }`}
                >
                  {perf}
                </button>
              ))}
            </div>

            {/* Technical rating filter */}
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="bg-[#F0F3FA] dark:bg-[#252A37] text-xs font-semibold text-[#131722] dark:text-white px-3 py-2 rounded-xl border-0 outline-none cursor-pointer"
            >
              <option value="All">All Technical Ratings</option>
              <option value="Strong Buy">Strong Buy</option>
              <option value="Buy">Buy</option>
              <option value="Neutral">Neutral</option>
              <option value="Sell">Sell</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-[#1E222D] border border-[#E0E3EB] dark:border-[#2A2E39] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="text-xs uppercase text-[#787B86] border-b border-[#E0E3EB] dark:border-[#2A2E39] bg-neutral-50/50 dark:bg-[#171B26]">
                <th className="py-3 px-4 font-semibold">Instrument</th>
                <th
                  onClick={() => {
                    setSortBy('price');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-3 font-semibold text-right cursor-pointer select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    Price <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => {
                    setSortBy('changePercent');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-3 font-semibold text-right cursor-pointer select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    Change % <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold text-right">Volume</th>
                <th className="py-3 px-3 font-semibold text-right">Market Cap</th>
                <th
                  onClick={() => {
                    setSortBy('rsi');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="py-3 px-3 font-semibold text-right cursor-pointer select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    RSI (14) <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold text-center">Technical Rating</th>
                <th className="py-3 px-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E3EB] dark:divide-[#2A2E39]">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#787B86]">
                    No assets matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const isPos = asset.changePercent >= 0;
                  return (
                    <tr
                      key={asset.id + asset.symbol}
                      onClick={() => onSelectAsset(asset)}
                      className="hover:bg-[#F8F9FD] dark:hover:bg-[#252A37] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-7 h-7 rounded-full text-white font-extrabold text-[11px] flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: asset.badgeBg,
                              color: asset.badgeColor || '#FFFFFF',
                            }}
                          >
                            {asset.badge}
                          </span>
                          <div>
                            <span className="font-bold text-sm text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors">
                              {asset.symbol}
                            </span>
                            <span className="text-xs text-[#787B86] block truncate max-w-[180px]">
                              {asset.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-semibold tabular-nums text-[#131722] dark:text-white">
                        ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      <td className="py-3 px-3 text-right tabular-nums">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            isPos
                              ? 'bg-[#E6F4EA] dark:bg-emerald-950/40 text-[#089981]'
                              : 'bg-[#FCE8E6] dark:bg-rose-950/40 text-[#F23645]'
                          }`}
                        >
                          {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right tabular-nums text-[#787B86]">
                        {asset.volume}
                      </td>

                      <td className="py-3 px-3 text-right tabular-nums text-[#787B86]">
                        {asset.marketCap}
                      </td>

                      <td className="py-3 px-3 text-right tabular-nums font-medium text-[#131722] dark:text-white">
                        {asset.rsi.toFixed(1)}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            asset.technicalRating.includes('Buy')
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-[#089981]'
                              : asset.technicalRating.includes('Sell')
                              ? 'bg-rose-100 dark:bg-rose-950/40 text-[#F23645]'
                              : 'bg-amber-100 dark:bg-amber-950/40 text-amber-600'
                          }`}
                        >
                          {asset.technicalRating}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAsset(asset);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-[#2962FF] hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                        >
                          Chart &gt;
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-neutral-50 dark:bg-[#181B24] border-t border-[#E0E3EB] dark:border-[#2A2E39] text-xs text-[#787B86] flex justify-between items-center px-4">
          <span>Displaying {filteredAssets.length} securities</span>
          <span>Click any row to launch full chart and technical overview</span>
        </div>
      </div>
    </div>
  );
};
