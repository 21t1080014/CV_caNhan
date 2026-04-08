import { useState } from 'react';

export default function SkillsManager({ skills, onChange }) {
    const [newSkill, setNewSkill] = useState('');

    const addSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill)) {
            onChange([...skills, newSkill]);
            setNewSkill('');
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">🎯 Kỹ năng</h2>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Nhập kỹ năng (vd: React, Java, Python...)"
                    className="flex-1 input-base"
                />
                <button
                    onClick={addSkill}
                    className="btn-primary"
                >
                    ➕ Thêm
                </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
                {skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-full">
                        <span className="font-semibold text-indigo-900">{skill}</span>
                        <button
                            onClick={() => onChange(skills.filter((_, idx) => idx !== i))}
                            className="text-red-600 hover:text-red-700 font-bold ml-1"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}