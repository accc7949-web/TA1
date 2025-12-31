import React, { useState, useEffect } from 'react';
import { CustomVocabUnit } from '../types';
import {
  getUserCustomVocabUnits,
  deleteCustomVocabUnit,
} from '../services/customVocabulary';
import CreateCustomVocabUnit from './CreateCustomVocabUnit';
import CreateVocabModule from './CreateVocabModule';

interface CustomVocabularyManagerProps {
  uid: string;
  onBack?: () => void;
  onSelectUnit?: (unit: CustomVocabUnit) => void;
}

export default function CustomVocabularyManager({
  uid,
  onBack,
  onSelectUnit,
}: CustomVocabularyManagerProps) {
  const [units, setUnits] = useState<CustomVocabUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateUnit, setShowCreateUnit] = useState(false);
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  useEffect(() => {
    loadUnits();
  }, [uid]);

  const loadUnits = async () => {
    setLoading(true);
    try {
      const data = await getUserCustomVocabUnits(uid);
      setUnits(data);
    } catch (error) {
      console.error('Error loading units:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (confirm('Bạn chắc chắn muốn xóa unit này?')) {
      try {
        await deleteCustomVocabUnit(uid, unitId);
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

  const handleModuleCreated = async () => {
    setShowCreateModule(false);
    await loadUnits();
  };

  const handleSelectUnit = (unit: CustomVocabUnit) => {
    if (onSelectUnit) {
      onSelectUnit(unit);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Đang tải...</div>
      </div>
    );
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
            📚 Từ Vựng Tùy Chỉnh
          </h1>
        </div>
        <button
          onClick={() => setShowCreateUnit(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          + Tạo Unit Mới
        </button>
      </div>

      {units.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Bạn chưa có unit từ vựng nào. Hãy tạo một unit mới!
          </p>
          <button
            onClick={() => setShowCreateUnit(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Tạo Unit Đầu Tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((unit) => {
            const totalWords = unit.modules.reduce(
              (sum, module) => sum + module.words.length,
              0
            );
            return (
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
                    Học phần: {unit.modules.length} | Từ vựng: {totalWords}
                  </p>
                </div>

                {unit.modules.length > 0 && (
                  <div className="mb-4 max-h-40 overflow-y-auto">
                    <div className="space-y-1">
                      {unit.modules.map((module) => (
                        <div
                          key={module.id}
                          className="px-2 py-1 text-sm text-gray-700 bg-gray-50 rounded"
                        >
                          {module.isAIGenerated ? '✨' : '📝'} {module.name} (
                          {module.words.length} từ)
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectUnit(unit)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Học
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUnitId(unit.id);
                      setShowCreateModule(true);
                    }}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                  >
                    + Học Phần
                  </button>
                  <button
                    onClick={() => handleDeleteUnit(unit.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreateUnit && (
        <CreateCustomVocabUnit
          uid={uid}
          onUnitCreated={handleUnitCreated}
          onCancel={() => setShowCreateUnit(false)}
        />
      )}

      {showCreateModule && selectedUnitId && (
        <CreateVocabModule
          uid={uid}
          unitId={selectedUnitId}
          onModuleCreated={handleModuleCreated}
          onCancel={() => {
            setShowCreateModule(false);
            setSelectedUnitId(null);
          }}
        />
      )}
    </div>
  );
}

