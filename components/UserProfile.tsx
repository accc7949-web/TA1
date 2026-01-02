import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { UserProfile, getUserProfile, updateUserProfile, logoutUser } from '../services/auth';
import { ROLE_DISPLAY_NAMES, ROLE_COLORS } from '../types';

interface UserProfileComponentProps {
  user: User;
  onClose: () => void;
  onLogout?: () => void;
}

const UserProfileComponent: React.FC<UserProfileComponentProps> = ({ user, onClose, onLogout }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile(user.uid);
      setProfile(data);
      if (data) setDisplayName(data.displayName);
      setLoading(false);
    };
    fetchProfile();
  }, [user.uid]);

  const handleSave = async () => {
    if (!displayName.trim()) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, { displayName });
      setProfile(prev => prev ? { ...prev, displayName } : null);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout?.();
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <p className="text-center text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const isAdmin = profile?.isAdmin ?? false;
  const userRole = profile?.role || 'user';
  const roleColors = ROLE_COLORS[userRole];
  const roleDisplayName = ROLE_DISPLAY_NAMES[userRole];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 ${userRole === 'admin' ? 'border-2 border-yellow-400' : ''}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Thông tin tài khoản</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {profile && (
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="text-center">
              <div className={`inline-block rounded-full w-24 h-24 flex items-center justify-center mb-4 shadow-lg bg-gradient-to-br ${roleColors.bg} ${roleColors.glow || ''}`}>
                <span className="text-white text-4xl font-bold">
                  {profile.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="flex flex-col items-center">
                  <h3 className={`text-xl font-bold ${roleColors.text}`}>{profile.displayName}</h3>
                  <p className="text-xs text-gray-500 mt-1">{roleDisplayName}</p>
                </div>
              </div>
              {userRole === 'admin' && (
                <div className="mt-3 flex justify-center">
                  <span className={`${roleColors.badge} text-white px-4 py-2 rounded-none text-xs font-bold shadow-md border-2`}>
                    [ADMIN]
                  </span>
                </div>
              )}
              {userRole === 'moderator' && (
                <div className="mt-3 flex justify-center">
                  <span className={`${roleColors.badge} text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md border-2`}>
                    🛡️ MODERATOR
                  </span>
                </div>
              )}
              {userRole === 'ai_bot' && (
                <div className="mt-3 flex justify-center">
                  <span className={`${roleColors.badge} text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md border-2`}>
                    🤖 AI BOT
                  </span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <div className={`p-3 rounded-lg text-gray-700 border ${
                userRole === 'admin' 
                  ? 'bg-yellow-50 border-yellow-200' 
                  : userRole === 'moderator'
                  ? 'bg-purple-50 border-purple-200'
                  : userRole === 'ai_bot'
                  ? 'bg-cyan-50 border-cyan-200'
                  : 'bg-blue-50 border-blue-200'
              }`}>
                {profile.email}
              </div>
            </div>

            {/* Display Name - Editable */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Tên hiển thị
              </label>
              {editing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    userRole === 'admin'
                      ? 'border-yellow-300 focus:ring-yellow-500'
                      : userRole === 'moderator'
                      ? 'border-purple-300 focus:ring-purple-500'
                      : userRole === 'ai_bot'
                      ? 'border-cyan-300 focus:ring-cyan-500'
                      : 'border-blue-300 focus:ring-blue-500'
                  }`}
                />
              ) : (
                <div className={`p-3 rounded-lg text-gray-700 flex justify-between items-center border ${
                  userRole === 'admin' 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : userRole === 'moderator'
                    ? 'bg-purple-50 border-purple-200'
                    : userRole === 'ai_bot'
                    ? 'bg-cyan-50 border-cyan-200'
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  {profile.displayName}
                  <button
                    onClick={() => setEditing(true)}
                    className={`text-sm font-medium ${
                      userRole === 'admin' 
                        ? 'text-yellow-600 hover:text-yellow-700' 
                        : userRole === 'moderator'
                        ? 'text-purple-600 hover:text-purple-700'
                        : userRole === 'ai_bot'
                        ? 'text-cyan-600 hover:text-cyan-700'
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Sửa
                  </button>
                </div>
              )}
            </div>

            {/* Learning Stats */}
            {profile.learningStats && (
              <div className={`p-4 rounded-lg border ${
                userRole === 'admin' 
                  ? 'bg-yellow-50 border-yellow-200' 
                  : userRole === 'moderator'
                  ? 'bg-purple-50 border-purple-200'
                  : userRole === 'ai_bot'
                  ? 'bg-cyan-50 border-cyan-200'
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <h4 className="font-semibold text-gray-800 mb-3">Thống kê học tập</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${roleColors.text}`}>
                      {profile.learningStats.totalLessons}
                    </p>
                    <p className="text-xs text-gray-600">Bài học</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${roleColors.text}`}>
                      {profile.learningStats.streak}
                    </p>
                    <p className="text-xs text-gray-600">Chuỗi</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-xl font-bold ${roleColors.text}`}>
                      {profile.learningStats.currentLevel}
                    </p>
                    <p className="text-xs text-gray-600">Cấp độ</p>
                  </div>
                </div>
              </div>
            )}

            {/* Account Info */}
            <div className="text-sm text-gray-500">
              <p>Tài khoản được tạo: {profile.createdAt.toDate().toLocaleDateString('vi-VN')}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {editing ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex-1 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-gray-400 ${
                      userRole === 'admin'
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : userRole === 'moderator'
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : userRole === 'ai_bot'
                        ? 'bg-cyan-600 hover:bg-cyan-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {saving ? 'Đang lưu...' : 'Lưu'}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setDisplayName(profile.displayName);
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={onClose}
                    className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition ${
                      userRole === 'admin'
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : userRole === 'moderator'
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : userRole === 'ai_bot'
                        ? 'bg-cyan-600 hover:bg-cyan-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Đăng xuất
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileComponent;
