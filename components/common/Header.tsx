
import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { UserProfile } from '../../services/auth';
import { ROLE_COLORS } from '../../types';

interface HeaderProps {
  title: string;
  onBackToMenu: () => void;
  user?: User | null;
  userProfile?: UserProfile | null;
  onShowProfile?: () => void;
  onShowChat?: () => void;
}

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);

const Header: React.FC<HeaderProps> = ({ title, onBackToMenu, user, userProfile, onShowProfile, onShowChat }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getInitial = () => {
    if (userProfile?.displayName) {
      return userProfile.displayName.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const getAvatarColor = () => {
    const userRole = userProfile?.role || 'user';
    return ROLE_COLORS[userRole].bg;
  };

  const getAvatarGlow = () => {
    const userRole = userProfile?.role || 'user';
    return ROLE_COLORS[userRole].glow || '';
  };

  const getRoleBorderColor = () => {
    const userRole = userProfile?.role || 'user';
    if (userRole === 'admin') {
      return 'ring-yellow-400';
    }
    if (userRole === 'moderator') {
      return 'ring-purple-400';
    }
    if (userRole === 'ai_bot') {
      return 'ring-cyan-400';
    }
    return 'ring-blue-400';
  };

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
      
      {/* Chat and Avatar Section */}
      <div className="flex items-center gap-3">
        {/* Chat Button */}
        <button
          onClick={() => onShowChat?.()}
          className="p-2 rounded-full hover:bg-slate-200 transition-colors relative"
          title="Open Chat"
        >
          <span className="text-xl">💬</span>
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        </button>

        {/* Avatar and Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowMenu(!showMenu);
              if (!showMenu && onShowProfile) onShowProfile();
            }}
            className={`relative w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white font-bold text-sm hover:ring-2 hover:ring-offset-2 transition-all ${getAvatarGlow()} hover:${getRoleBorderColor()}`}
            title={userProfile?.displayName || 'Profile'}
          >
            {getInitial()}
          </button>
          
          {/* Role Badge */}
          {userProfile?.role && userProfile.role !== 'user' && (
            <div className={`absolute top-0 right-0 w-3 h-3 rounded-full border border-white ${
              userProfile.role === 'admin' ? 'bg-yellow-400' :
              userProfile.role === 'moderator' ? 'bg-purple-400' :
              userProfile.role === 'ai_bot' ? 'bg-cyan-400' : 'bg-blue-400'
            }`}></div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
