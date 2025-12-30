
import React from 'react';

interface HeaderProps {
  title: string;
  onBackToMenu: () => void;
}

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);

const Header: React.FC<HeaderProps> = ({ title, onBackToMenu }) => {
  return (
    <header className="w-full flex items-center justify-between p-4 mb-8">
      <button 
        onClick={onBackToMenu}
        className="p-2 rounded-full hover:bg-slate-200 transition-colors"
        aria-label="Back to menu"
      >
        <BackIcon />
      </button>
      <h1 className="text-2xl font-bold text-slate-700">{title}</h1>
      <div className="w-10"></div> {/* Spacer */}
    </header>
  );
};

export default Header;
