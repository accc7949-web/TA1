import React, { useState } from 'react';
import { addManualModule, generateAIModule } from '../services/customVocabulary';
import { Flashcard } from '../types';

interface CreateVocabModuleProps {
  uid: string;
  unitId: string;
  onModuleCreated: () => void;
  onCancel: () => void;
}

export default function CreateVocabModule({
  uid,
  unitId,
  onModuleCreated,
  onCancel,
}: CreateVocabModuleProps) {
  const [mode, setMode] = useState<'choose' | 'manual' | 'ai'>('choose');
  const [moduleName, setModuleName] = useState('');
  const [words, setWords] = useState<Flashcard[]>([]);
  const [wordInput, setWordInput] = useState({ word: '', pronunciation: '', meaning: '', examples: '' });
  const [aiWordsInput, setAiWordsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddManualModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!moduleName.trim()) {
      setError('Vui lòng nhập tên học phần');
      return;
    }

    if (words.length === 0) {
      setError('Vui lòng thêm ít nhất một từ vựng');
      return;
    }

    setLoading(true);
    try {
      await addManualModule(uid, unitId, {
        name: moduleName.trim(),
        words: words,
      });
      resetForm();
      onModuleCreated();
    } catch (err) {
      setError('Lỗi khi tạo học phần. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!moduleName.trim()) {
      setError('Vui lòng nhập tên học phần');
      return;
    }

    if (!aiWordsInput.trim()) {
      setError('Vui lòng nhập danh sách từ tiếng Anh');
      return;
    }

    // Parse words from input (comma or newline separated)
    const wordList = aiWordsInput
      .split(/[,\n]/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    if (wordList.length === 0) {
      setError('Vui lòng nhập ít nhất một từ tiếng Anh');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await generateAIModule(uid, unitId, moduleName.trim(), wordList);
      resetForm();
      onModuleCreated();
    } catch (err: any) {
      const errorMessage = err?.message || 'Lỗi khi tạo học phần AI. Vui lòng thử lại.';
      setError(errorMessage);
      console.error('Error creating AI module:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWord = () => {
    if (!wordInput.word.trim() || !wordInput.meaning.trim()) {
      setError('Vui lòng nhập đầy đủ từ và nghĩa');
      return;
    }

    const examples = wordInput.examples
      .split('\n')
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    const newWord: Flashcard = {
      id: Date.now() + words.length,
      word: wordInput.word.trim(),
      pronunciation: wordInput.pronunciation.trim() || '',
      meaning: wordInput.meaning.trim(),
      examples: examples.length > 0 ? examples : [],
      synonyms: [],
      antonyms: [],
    };

    setWords([...words, newWord]);
    setWordInput({ word: '', pronunciation: '', meaning: '', examples: '' });
    setError('');
  };

  const handleRemoveWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setModuleName('');
    setWords([]);
    setWordInput({ word: '', pronunciation: '', meaning: '', examples: '' });
    setAiWordsInput('');
    setMode('choose');
  };

  if (mode === 'choose') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Tạo Học Phần Mới
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => setMode('manual')}
              className="w-full p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 text-left"
            >
              <h3 className="font-bold text-blue-600 mb-1">📝 Tạo Bằng Tay</h3>
              <p className="text-sm text-gray-600">
                Tự nhập từ vựng với đầy đủ thông tin
              </p>
            </button>

            <button
              onClick={() => setMode('ai')}
              className="w-full p-4 border-2 border-purple-500 rounded-lg hover:bg-purple-50 text-left"
            >
              <h3 className="font-bold text-purple-600 mb-1">✨ Tạo Bằng AI</h3>
              <p className="text-sm text-gray-600">
                Nhập danh sách từ tiếng Anh, AI sẽ tạo học phần đầy đủ với phiên âm, nghĩa, ví dụ, từ đồng nghĩa và trái nghĩa
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
            Tạo Học Phần Bằng Tay
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleAddManualModule} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Học Phần
              </label>
              <input
                type="text"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                placeholder="vd: Từ vựng về Công nghệ - Phần 1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold text-gray-700 mb-3">Thêm Từ Vựng</h3>
              
              <div className="space-y-2 mb-4">
                <input
                  type="text"
                  value={wordInput.word}
                  onChange={(e) => setWordInput({ ...wordInput, word: e.target.value })}
                  placeholder="Từ (vd: sustain (v))"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={wordInput.pronunciation}
                  onChange={(e) => setWordInput({ ...wordInput, pronunciation: e.target.value })}
                  placeholder="Phiên âm (vd: /sə'stein/)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={wordInput.meaning}
                  onChange={(e) => setWordInput({ ...wordInput, meaning: e.target.value })}
                  placeholder="Nghĩa tiếng Việt"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <textarea
                  value={wordInput.examples}
                  onChange={(e) => setWordInput({ ...wordInput, examples: e.target.value })}
                  placeholder="Ví dụ (mỗi dòng một ví dụ)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={handleAddWord}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  + Thêm Từ
                </button>
              </div>

              {words.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {words.map((word, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex-1">
                        <span className="font-medium">{word.word}</span>
                        <span className="text-gray-600 ml-2">- {word.meaning}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveWord(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                {loading ? 'Đang tạo...' : 'Tạo Học Phần'}
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
            Tạo Học Phần Bằng AI
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleGenerateAIModule} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Học Phần
              </label>
              <input
                type="text"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                placeholder="vd: Từ vựng về Công nghệ - Phần 1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh Sách Từ Tiếng Anh
              </label>
              <textarea
                value={aiWordsInput}
                onChange={(e) => setAiWordsInput(e.target.value)}
                placeholder="Nhập các từ tiếng Anh, cách nhau bởi dấu phẩy hoặc xuống dòng&#10;vd: sustain, perceive, demonstrate, artificial intelligence"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={5}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mỗi từ cách nhau bởi dấu phẩy hoặc xuống dòng
              </p>
            </div>

            <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded">
              ✨ AI sẽ tự động tạo học phần đầy đủ với phiên âm, nghĩa tiếng Việt, ví dụ, từ đồng nghĩa và trái nghĩa cho mỗi từ.
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

