import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { UserProfile, getUserProfile, updateUserProfile } from '../services/auth';

interface UserProfileComponentProps {
  user: User;
  onClose: () => void;
}

const UserProfileComponent: React.FC<UserProfileComponentProps> = ({ user, onClose }) => {
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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <p className="text-center text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
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
              <div className="inline-block bg-gradient-to-br from-blue-400 to-blue-600 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">
                  {profile.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-xl font-bold text-gray-800">{profile.displayName}</h3>
                {profile.isAdmin && (
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                    ADMIN
                  </span>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <div className="bg-gray-100 p-3 rounded-lg text-gray-700">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="bg-gray-100 p-3 rounded-lg text-gray-700 flex justify-between items-center">
                  {profile.displayName}
                  <button
                    onClick={() => setEditing(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Sửa
                  </button>
                </div>
              )}
            </div>

            {/* Learning Stats */}
            {profile.learningStats && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Thống kê học tập</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {profile.learningStats.totalLessons}
                    </p>
                    <p className="text-xs text-gray-600">Bài học</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {profile.learningStats.streak}
                    </p>
                    <p className="text-xs text-gray-600">Chuỗi</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-blue-600">
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
            <div className="flex gap-3">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
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
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Đóng
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileComponent;
