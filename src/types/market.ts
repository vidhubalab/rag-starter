export type AssetCategory =
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export type MainNavTab = 'Products' | 'Community' | 'Markets' | 'Brokers' | 'Screeners';

export type TableOverviewTab = 'Performance' | 'Technical' | 'Components';

export interface CandlePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  badge: string;
  badgeBg: string;
  badgeColor?: string;
  category: AssetCategory;
  region?: 'US' | 'Global' | 'Europe' | 'Asia' | 'Commodities';
  countryCode?: string;
  subtitle: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: string;
  marketCap: string;
  peRatio?: number;
  sparkline: number[];
  isPositive: boolean;
  technicalRating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  rsi: number;
  macd: number;
  ma50: number;
  ma200: number;
  beta: number;
  divYield?: string;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  about: string;
  candles?: CandlePoint[];
}

export interface CommunityIdea {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  symbol: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  likes: number;
  comments: number;
  timeAgo: string;
  summary: string;
  tags: string[];
}

export interface BrokerInfo {
  id: string;
  name: string;
  logo: string;
  badgeColor: string;
  rating: number;
  reviewsCount: number;
  spread: string;
  leverage: string;
  regulator: string;
  highlights: string[];
  depositMin: string;
}

export interface PaperTradePosition {
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  shares: number;
  entryPrice: number;
  currentPrice: number;
  timestamp: string;
}
