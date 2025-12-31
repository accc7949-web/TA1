import React, { useState, useEffect } from 'react';
import { CustomGrammarUnit } from '../types';
import {
  getUserCustomGrammarUnits,
  deleteCustomGrammarUnit,
} from '../services/customGrammar';
import CreateCustomUnit from './CreateCustomUnit';
import CreateLesson from './CreateLesson';
import CustomLessonDetail from './CustomLessonDetail';

interface CustomGrammarManagerProps {
  uid: string;
  onBack?: () => void;
}

export default function CustomGrammarManager({
  uid,
  onBack,
}: CustomGrammarManagerProps) {
  const [units, setUnits] = useState<CustomGrammarUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateUnit, setShowCreateUnit] = useState(false);
  const [showCreateLesson, setShowCreateLesson] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  useEffect(() => {
    loadUnits();
  }, [uid]);

  const loadUnits = async () => {
    setLoading(true);
    try {
      const data = await getUserCustomGrammarUnits(uid);
      setUnits(data);
    } catch (error) {
      console.error('Error loading units:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (confirm('Bạn chắc chắn muốn xóa đơn vị này?')) {
      try {
        await deleteCustomGrammarUnit(uid, unitId);
        await loadUnits();
      } catch (error) {
        console.error('Error deleting unit:', error);
      }
    }
  };

  const handleUnitCreated = async () => {
    setShowCreateUnit(false);
    await loadUnits();
  };

  const handleLessonCreated = async () => {
    setShowCreateLesson(false);
    await loadUnits();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (selectedLesson && selectedUnitId) {
    const unit = units.find((u) => u.id === selectedUnitId);
    const lesson = unit?.lessons.find((l) => l.id === selectedLesson);

    if (lesson) {
      return (
        <CustomLessonDetail
          lesson={lesson}
          unitName={unit?.name || ''}
          onBack={() => setSelectedLesson(null)}
        />
      );
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 font-medium mb-3 flex items-center gap-1"
          >
            ← Quay Lại
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            📚 Ngữ Pháp Tùy Chỉnh
          </h1>
        </div>
        <button
          onClick={() => setShowCreateUnit(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          + Tạo Đơn Vị Mới
        </button>
      </div>

      {units.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Bạn chưa có đơn vị ngữ pháp nào. Hãy tạo một đơn vị mới!
          </p>
          <button
            onClick={() => setShowCreateUnit(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Tạo Đơn Vị Đầu Tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {unit.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{unit.description}</p>

              <div className="mb-4">
                <p className="text-sm text-gray-700 font-medium">
                  Bài học: {unit.lessons.length}
                </p>
              </div>

              {unit.lessons.length > 0 && (
                <div className="mb-4 max-h-40 overflow-y-auto">
                  <div className="space-y-1">
                    {unit.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setSelectedUnitId(unit.id);
                          setSelectedLesson(lesson.id);
                        }}
                        className="block w-full text-left px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      >
                        {lesson.isAIGenerated ? '✨' : '📝'} {lesson.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedUnitId(unit.id);
                    setShowCreateLesson(true);
                  }}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  + Bài Học
                </button>
                <button
                  onClick={() => handleDeleteUnit(unit.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateUnit && (
        <CreateCustomUnit
          uid={uid}
          onUnitCreated={handleUnitCreated}
          onCancel={() => setShowCreateUnit(false)}
        />
      )}

      {showCreateLesson && selectedUnitId && (
        <CreateLesson
          uid={uid}
          unitId={selectedUnitId}
          onLessonCreated={handleLessonCreated}
          onCancel={() => {
            setShowCreateLesson(false);
            setSelectedUnitId(null);
          }}
        />
      )}
    </div>
  );
}
