import { useState } from 'react';

export default function ExperienceManager({ experiences, onChange }) {
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    const handleAdd = () => {
        if (form.company && form.position) {
            onChange([...experiences, form]);
            setForm({ company: '', position: '', startDate: '', endDate: '', description: '' });
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">💼 Kinh nghiệm làm việc</h2>

            {experiences.map((exp, i) => (
                <div key={i} className="p-5 border-2 border-indigo-200 rounded-lg bg-gradient-to-r from-indigo-50 to-transparent">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800">{exp.position}</h3>
                            <p className="text-indigo-600 font-semibold text-lg">{exp.company}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {exp.startDate} → {exp.endDate}
                            </p>
                            {exp.description && (
                                <p className="text-gray-700 mt-3">{exp.description}</p>
                            )}
                        </div>
                        <button
                            onClick={() => onChange(experiences.filter((_, idx) => idx !== i))}
                            className="ml-4 text-red-600 hover:text-red-700 font-bold text-xl"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            ))}

            {isAdding ? (
                <div className="p-5 border-2 border-indigo-400 rounded-lg bg-indigo-50 space-y-3">
                    <input
                        type="text"
                        placeholder="Tên công ty"
                        value={form.company}
                        onChange={(e) => setForm({...form, company: e.target.value})}
                        className="input-base"
                    />
                    <input
                        type="text"
                        placeholder="Chức vụ"
                        value={form.position}
                        onChange={(e) => setForm({...form, position: e.target.value})}
                        className="input-base"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Bắt đầu</label>
                            <input
                                type="month"
                                value={form.startDate}
                                onChange={(e) => setForm({...form, startDate: e.target.value})}
                                className="input-base"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Kết thúc</label>
                            <input
                                type="month"
                                value={form.endDate}
                                onChange={(e) => setForm({...form, endDate: e.target.value})}
                                className="input-base"
                            />
                        </div>
                    </div>
                    <textarea
                        placeholder="Mô tả công việc"
                        value={form.description}
                        onChange={(e) => setForm({...form, description: e.target.value})}
                        rows="3"
                        className="input-base"
                    />
                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={handleAdd}
                            className="flex-1 btn-primary bg-green-600 hover:bg-green-700"
                        >
                            ✅ Thêm
                        </button>
                        <button
                            onClick={() => setIsAdding(false)}
                            className="flex-1 btn-secondary"
                        >
                            ❌ Hủy
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-full py-3 border-2 border-dashed border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold text-lg transition"
                >
                    ➕ Thêm kinh nghiệm
                </button>
            )}
        </div>
    );
}