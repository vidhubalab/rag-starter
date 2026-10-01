/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { AssetDetailModal } from './components/AssetDetailModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { PaperTradingModal } from './components/PaperTradingModal';
import { MarketsOverviewView } from './components/views/MarketsOverviewView';
import { ScreenersView } from './components/views/ScreenersView';
import { SuperchartView } from './components/views/SuperchartView';
import { CommunityView } from './components/views/CommunityView';
import { BrokersView } from './components/views/BrokersView';
import {
  MainNavTab,
  AssetCategory,
  MarketAsset,
  PaperTradePosition,
} from './types/market';
import {
  US_FEATURED_INDICES,
  US_MARKET_LEADERS,
  CRYPTO_BENCHMARKS,
  ALL_SEARCHABLE_ASSETS,
} from './data/mockMarketData';
import { Sparkles, Check, Zap, Play, Pause } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainNavTab>('Markets');
  const [screenerCategory, setScreenerCategory] = useState<AssetCategory>('US stocks');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [watchlistDrawerOpen, setWatchlistDrawerOpen] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);

  // Paper Trading state
  const [tradeAsset, setTradeAsset] = useState<MarketAsset | null>(null);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [paperModalOpen, setPaperModalOpen] = useState<boolean>(false);
  const [cashBalance, setCashBalance] = useState<number>(100000);
  const [positions, setPositions] = useState<PaperTradePosition[]>([
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      type: 'BUY',
      shares: 25,
      entryPrice: 135.10,
      currentPrice: 138.25,
      timestamp: '09:32 AM',
    },
    {
      symbol: 'BTCUSD',
      name: 'Bitcoin',
      type: 'BUY',
      shares: 0.5,
      entryPrice: 66222.00,
      currentPrice: 67842.00,
      timestamp: '10:14 AM',
    },
  ]);

  // Watchlist state (seeded with top assets)
  const [watchlist, setWatchlist] = useState<MarketAsset[]>([
    US_FEATURED_INDICES[0], // S&P 500
    US_MARKET_LEADERS[0], // NVDA
    CRYPTO_BENCHMARKS[0], // BTCUSD
  ]);

  // Live simulation tick flash map
  const [liveSimActive, setLiveSimActive] = useState<boolean>(true);
  const [liveTickFlashMap, setLiveTickFlashMap] = useState<Record<string, 'green' | 'red' | null>>({});

  // Welcome / Get Started Modal
  const [getStartedModalOpen, setGetStartedModalOpen] = useState<boolean>(false);

  // Sync dark mode with DOM class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Subtle realistic live price ticker simulation
  useEffect(() => {
    if (!liveSimActive) return;

    const interval = setInterval(() => {
      // Pick a random asset from leaders or crypto to pulse
      const pool = ['NVDA', 'AAPL', 'MSFT', 'TSLA', 'BTCUSD', 'ETHUSD', 'SPX', 'NDX'];
      const targetSymbol = pool[Math.floor(Math.random() * pool.length)];
      const direction: 'green' | 'red' = Math.random() > 0.45 ? 'green' : 'red';

      setLiveTickFlashMap((prev) => ({
        ...prev,
        [targetSymbol]: direction,
      }));

      setTimeout(() => {
        setLiveTickFlashMap((prev) => ({
          ...prev,
          [targetSymbol]: null,
        }));
      }, 900);
    }, 3200);

    return () => clearInterval(interval);
  }, [liveSimActive]);

  const handleToggleWatchlist = (asset: MarketAsset) => {
    setWatchlist((prev) => {
      const exists = prev.some((a) => a.symbol === asset.symbol);
      if (exists) {
        return prev.filter((a) => a.symbol !== asset.symbol);
      }
      return [...prev, asset];
    });
  };

  const handleRemoveFromWatchlist = (assetId: string) => {
    setWatchlist((prev) => prev.filter((a) => a.id !== assetId));
  };

  const handleOpenTrade = (asset: MarketAsset, type: 'BUY' | 'SELL') => {
    setTradeAsset(asset);
    setTradeType(type);
    setPaperModalOpen(true);
  };

  const handleExecuteTrade = (position: PaperTradePosition) => {
    const cost = position.shares * position.entryPrice;
    if (position.type === 'BUY') {
      setCashBalance((prev) => prev - cost);
    } else {
      setCashBalance((prev) => prev + cost);
    }
    setPositions((prev) => [position, ...prev]);
  };

  const handleOpenScreener = (category?: AssetCategory) => {
    if (category) setScreenerCategory(category);
    setActiveTab('Screeners');
  };

  const isSelectedWatchlisted = selectedAsset
    ? watchlist.some((a) => a.symbol === selectedAsset.symbol)
    : false;

  return (
    <div className="min-h-screen bg-white dark:bg-[#131722] text-[#131722] dark:text-[#D1D4DC] flex flex-col font-sans transition-colors duration-150">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenWatchlist={() => setWatchlistDrawerOpen(true)}
        watchlistCount={watchlist.length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onGetStarted={() => setGetStartedModalOpen(true)}
      />

      {/* Real-time ticker status banner (clean, subtle TradingView style) */}
      <div className="bg-[#F8F9FD] dark:bg-[#171B26] border-b border-[#E0E3EB] dark:border-[#2A2E39] px-4 py-1.5 text-xs text-[#787B86] flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-0.5">
            <span className="flex items-center gap-1 font-semibold text-[#131722] dark:text-white">
              <span className="relative flex h-2 w-2">
                {liveSimActive && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#089981] opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    liveSimActive ? 'bg-[#089981]' : 'bg-[#787B86]'
                  }`}
                />
              </span>
              <span className="text-[11px]">US &amp; Global Exchanges Open</span>
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline text-[11px]">
              NYSE · NASDAQ · TSE · LSE · COMEX · CBOE
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            <button
              onClick={() => setLiveSimActive(!liveSimActive)}
              className="flex items-center gap-1 hover:text-[#131722] dark:hover:text-white cursor-pointer font-medium"
              title="Toggle live price ticks"
            >
              {liveSimActive ? (
                <>
                  <Pause className="w-3 h-3 text-[#089981]" />
                  <span>Live Feed: Active</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-[#787B86]" />
                  <span>Live Feed: Paused</span>
                </>
              )}
            </button>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline tabular-nums">
              Simulated Cash: ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'Markets' && (
          <MarketsOverviewView
            onSelectAsset={(asset) => setSelectedAsset(asset)}
            onOpenScreener={handleOpenScreener}
            liveTickFlashMap={liveTickFlashMap}
          />
        )}

        {activeTab === 'Screeners' && (
          <ScreenersView
            initialCategory={screenerCategory}
            onSelectAsset={(asset) => setSelectedAsset(asset)}
          />
        )}

        {activeTab === 'Products' && (
          <SuperchartView
            onOpenTrade={handleOpenTrade}
            onSelectAssetModal={(asset) => setSelectedAsset(asset)}
          />
        )}

        {activeTab === 'Community' && (
          <CommunityView onSelectAsset={(asset) => setSelectedAsset(asset)} />
        )}

        {activeTab === 'Brokers' && <BrokersView />}
      </main>

      {/* Footer */}
      <Footer onNavClick={(tab) => setActiveTab(tab)} />

      {/* Interactive Global Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
      />

      {/* Interactive Asset Detail & Comprehensive Chart Modal */}
      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        isWatchlisted={isSelectedWatchlisted}
        onToggleWatchlist={handleToggleWatchlist}
        onOpenTrade={handleOpenTrade}
      />

      {/* Watchlist & Paper Portfolio Slide-over Drawer */}
      <WatchlistDrawer
        isOpen={watchlistDrawerOpen}
        onClose={() => setWatchlistDrawerOpen(false)}
        watchlist={watchlist}
        positions={positions}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
        cashBalance={cashBalance}
      />

      {/* Paper Trading Simulation Modal */}
      <PaperTradingModal
        asset={tradeAsset}
        tradeType={tradeType}
        onClose={() => setPaperModalOpen(false)}
        onExecuteTrade={handleExecuteTrade}
        cashBalance={cashBalance}
      />

      {/* Get Started Welcome Dialog */}
      {getStartedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-white dark:bg-[#1E222D] rounded-2xl shadow-2xl border border-[#E0E3EB] dark:border-[#2A2E39] p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2962FF] to-[#9945FF] text-white flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-black text-[#131722] dark:text-white">
                Welcome to TradingView Markets
              </h3>
              <p className="text-xs sm:text-sm text-[#787B86] mt-1.5 leading-relaxed">
                Experience real-time quotes across US stocks, global indices, cryptocurrencies, futures, forex, and corporate bonds.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-[#131722] dark:text-[#D1D4DC]">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-[#089981] flex items-center justify-center font-bold">
                  ✓
                </div>
                <span>Click any market card or table row to inspect live charts</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-[#089981] flex items-center justify-center font-bold">
                  ✓
                </div>
                <span>Press <strong>Ctrl+K</strong> anywhere to search any security or asset</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-[#089981] flex items-center justify-center font-bold">
                  ✓
                </div>
                <span>Trade simulated stocks and crypto with $100,000 in paper funds</span>
              </div>
            </div>

            <button
              onClick={() => setGetStartedModalOpen(false)}
              className="w-full tv-btn-gradient text-white font-bold text-sm py-3 rounded-full cursor-pointer shadow-sm"
            >
              Start Exploring Markets
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
