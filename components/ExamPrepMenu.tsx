
import React, { useState } from 'react';
import { ExamPracticeConfig, ExamQuestionType } from '../types';
import Header from './common/Header';

interface ExamPrepMenuProps {
  onStartExam: (config: ExamPracticeConfig) => void;
  onBack: () => void;
}

const ExamPrepMenu: React.FC<ExamPrepMenuProps> = ({ onStartExam, onBack }) => {
    const [selectedType, setSelectedType] = useState<ExamQuestionType>('NOTICE_FLYER');
    const [topic, setTopic] = useState('Môi trường & Đời sống xanh');
    const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');

    const handleStart = () => {
        onStartExam({
            type: selectedType,
            topic: topic,
            readingLength: selectedType === 'READING' ? length : undefined
        });
    };

    const topics = [
        "Môi trường & Đời sống xanh",
        "Giáo dục & Nghề nghiệp",
        "Công nghệ & AI",
        "Văn hóa & Du lịch",
        "Sức khỏe & Dinh dưỡng",
        "Kinh tế & Khởi nghiệp"
    ];

    return (
        <div className="flex flex-col items-center w-full min-h-screen">
            <Header title="Cấu hình đề luyện tập" onBackToMenu={onBack} />
            <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl">
                
                {/* 1. Select Question Type */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-700 mb-3">1. Chọn dạng bài (Format 2025)</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <button 
                            onClick={() => setSelectedType('NOTICE_FLYER')}
                            className={`p-4 rounded-xl text-left border-2 transition-all ${selectedType === 'NOTICE_FLYER' ? 'border-orange-500 bg-orange-50 text-orange-800' : 'border-slate-200 hover:bg-slate-50'}`}
                        >
                            <div className="font-bold">Đọc điền Thông báo / Tờ rơi</div>
                            <div className="text-xs opacity-70">Điền từ vào chỗ trống trong văn bản ngắn (quảng cáo, thông báo).</div>
                        </button>
                        <button 
                            onClick={() => setSelectedType('ARRANGEMENT')}
                            className={`p-4 rounded-xl text-left border-2 transition-all ${selectedType === 'ARRANGEMENT' ? 'border-orange-500 bg-orange-50 text-orange-800' : 'border-slate-200 hover:bg-slate-50'}`}
                        >
                            <div className="font-bold">Sắp xếp đoạn văn / Lá thư</div>
                            <div className="text-xs opacity-70">Sắp xếp các câu xáo trộn thành văn bản hoàn chỉnh.</div>
                        </button>
                        <button 
                            onClick={() => setSelectedType('CLOZE')}
                            className={`p-4 rounded-xl text-left border-2 transition-all ${selectedType === 'CLOZE' ? 'border-orange-500 bg-orange-50 text-orange-800' : 'border-slate-200 hover:bg-slate-50'}`}
                        >
                            <div className="font-bold">Đọc điền đoạn văn (Cloze Test)</div>
                            <div className="text-xs opacity-70">Chọn từ thích hợp điền vào 5 chỗ trống trong đoạn văn 150 chữ.</div>
                        </button>
                        <button 
                            onClick={() => setSelectedType('READING')}
                            className={`p-4 rounded-xl text-left border-2 transition-all ${selectedType === 'READING' ? 'border-orange-500 bg-orange-50 text-orange-800' : 'border-slate-200 hover:bg-slate-50'}`}
                        >
                            <div className="font-bold">Đọc hiểu (Reading Comprehension)</div>
                            <div className="text-xs opacity-70">Trả lời câu hỏi trắc nghiệm dựa trên bài đọc dài.</div>
                        </button>
                    </div>
                </div>

                {/* 2. Topic */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-700 mb-3">2. Chủ đề bài đọc</h3>
                    <select 
                        value={topic} 
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                        {topics.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* 3. Length (Only for Reading) */}
                {selectedType === 'READING' && (
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-700 mb-3">3. Độ dài bài đọc</h3>
                        <div className="flex gap-4">
                            {['short', 'medium', 'long'].map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setLength(l as any)}
                                    className={`flex-1 py-2 px-4 rounded-lg capitalize border ${length === l ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-600 border-slate-300'}`}
                                >
                                    {l === 'short' ? 'Ngắn (150)' : l === 'medium' ? 'Vừa (250)' : 'Dài (350+)'}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <button 
                    onClick={handleStart}
                    className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition-transform transform active:scale-95 flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Tạo đề ngay
                </button>

            </div>
        </div>
    );
};

export default ExamPrepMenu;
