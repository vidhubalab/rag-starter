import React from 'react';
import { MainNavTab } from '../types/market';

interface FooterProps {
  onNavClick: (tab: MainNavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="mt-16 border-t border-[#E0E3EB] dark:border-[#2A2E39] py-8 px-4 text-center text-xs text-[#787B86] transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#131722] dark:text-white">TradingView</span>
          <span>• Look first / Then leap.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={() => onNavClick('Markets')}
            className="hover:text-[#131722] dark:hover:text-white transition-colors cursor-pointer"
          >
            Markets
          </button>
          <button
            onClick={() => onNavClick('Screeners')}
            className="hover:text-[#131722] dark:hover:text-white transition-colors cursor-pointer"
          >
            Screeners
          </button>
          <button
            onClick={() => onNavClick('Products')}
            className="hover:text-[#131722] dark:hover:text-white transition-colors cursor-pointer"
          >
            Supercharts
          </button>
          <button
            onClick={() => onNavClick('Community')}
            className="hover:text-[#131722] dark:hover:text-white transition-colors cursor-pointer"
          >
            Ideas &amp; Community
          </button>
          <button
            onClick={() => onNavClick('Brokers')}
            className="hover:text-[#131722] dark:hover:text-white transition-colors cursor-pointer"
          >
            Brokers
          </button>
          <a
            href="#terms"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#131722] dark:hover:text-white transition-colors"
          >
            Terms of use
          </a>
          <a
            href="#privacy"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#131722] dark:hover:text-white transition-colors"
          >
            Privacy policy
          </a>
        </div>

        <div>
          <span>© 2024 TradingView</span>
        </div>
      </div>
    </footer>
  );
};
