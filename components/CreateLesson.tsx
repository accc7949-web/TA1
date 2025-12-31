import React, { useState } from 'react';
import { addManualLesson, generateAILesson } from '../services/customGrammar';

interface CreateLessonProps {
  uid: string;
  unitId: string;
  onLessonCreated: () => void;
  onCancel: () => void;
}

export default function CreateLesson({
  uid,
  unitId,
  onLessonCreated,
  onCancel,
}: CreateLessonProps) {
  const [mode, setMode] = useState<'choose' | 'manual' | 'ai'>('choose');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [examples, setExamples] = useState(['', '', '', '', '']);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddManualLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề');
      return;
    }

    setLoading(true);
    try {
      const filledExamples = examples.filter((ex) => ex.trim());
      await addManualLesson(uid, unitId, {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        examples: filledExamples,
        difficulty,
      });
      resetForm();
      onLessonCreated();
    } catch (err) {
      setError('Lỗi khi tạo bài học. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAILesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!topic.trim()) {
      setError('Vui lòng nhập chủ đề');
      return;
    }

    setLoading(true);
    try {
      await generateAILesson(uid, unitId, topic.trim(), difficulty);
      resetForm();
      onLessonCreated();
    } catch (err) {
      setError('Lỗi khi tạo bài học AI. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setContent('');
    setExamples(['', '', '', '', '']);
    setTopic('');
    setDifficulty('beginner');
    setMode('choose');
  };

  if (mode === 'choose') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Tạo Bài Học Mới
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => setMode('manual')}
              className="w-full p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 text-left"
            >
              <h3 className="font-bold text-blue-600 mb-1">📝 Tạo Bằng Tay</h3>
              <p className="text-sm text-gray-600">
                Viết bài học của riêng bạn với nội dung tùy chỉnh
              </p>
            </button>

            <button
              onClick={() => setMode('ai')}
              className="w-full p-4 border-2 border-purple-500 rounded-lg hover:bg-purple-50 text-left"
            >
              <h3 className="font-bold text-purple-600 mb-1">✨ Tạo Bằng AI</h3>
              <p className="text-sm text-gray-600">
                Để AI tạo bài học tự động từ chủ đề
              </p>
            </button>

            <button
              onClick={onCancel}
              className="w-full p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium mt-4"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'manual') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl my-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Tạo Bài Học Bằng Tay
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleAddManualLesson} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu Đề
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="vd: Simple Present Usage"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô Tả Ngắn
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả bài học"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội Dung
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết nội dung chi tiết (hỗ trợ Markdown)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ví Dụ (tối đa 5)
              </label>
              {examples.map((ex, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={ex}
                  onChange={(e) => {
                    const newExamples = [...examples];
                    newExamples[idx] = e.target.value;
                    setExamples(newExamples);
                  }}
                  placeholder={`Ví dụ ${idx + 1}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  disabled={loading}
                />
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Độ Khó
              </label>
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as typeof difficulty)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="beginner">Cơ Bản</option>
                <option value="intermediate">Trung Bình</option>
                <option value="advanced">Nâng Cao</option>
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setMode('choose')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                disabled={loading}
              >
                Quay Lại
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Đang tạo...' : 'Tạo Bài Học'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (mode === 'ai') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Tạo Bài Học Bằng AI
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleGenerateAILesson} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chủ Đề
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="vd: Conditional Sentences"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Độ Khó
              </label>
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as typeof difficulty)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              >
                <option value="beginner">Cơ Bản</option>
                <option value="intermediate">Trung Bình</option>
                <option value="advanced">Nâng Cao</option>
              </select>
            </div>

            <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded">
              ✨ AI sẽ tự động tạo tiêu đề, mô tả, nội dung và ví dụ cho chủ đề
              của bạn.
            </p>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setMode('choose')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                disabled={loading}
              >
                Quay Lại
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Đang tạo AI...' : 'Tạo Bằng AI'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
