import { useState } from 'react';

export default function EducationManager({ education, onChange }) {
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState({
        school: '',
        degree: '',
        field: '',
        graduationDate: ''
    });

    const handleAdd = () => {
        if (form.school && form.degree) {
            onChange([...education, form]);
            setForm({ school: '', degree: '', field: '', graduationDate: '' });
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">🎓 Học vấn</h2>

            {education.map((edu, i) => (
                <div key={i} className="p-5 border-2 border-purple-200 rounded-lg bg-gradient-to-r from-purple-50 to-transparent">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3>
                            <p className="text-purple-600 font-semibold text-lg">{edu.school}</p>
                            <p className="text-sm text-gray-500 mt-1">Ngành: {edu.field}</p>
                            <p className="text-sm text-gray-500">Tốt nghiệp: {edu.graduationDate}</p>
                        </div>
                        <button
                            onClick={() => onChange(education.filter((_, idx) => idx !== i))}
                            className="text-red-600 hover:text-red-700 font-bold text-xl"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            ))}

            {isAdding ? (
                <div className="p-5 border-2 border-purple-400 rounded-lg bg-purple-50 space-y-3">
                    <input
                        type="text"
                        placeholder="Trường học/Đại học"
                        value={form.school}
                        onChange={(e) => setForm({...form, school: e.target.value})}
                        className="input-base"
                    />
                    <input
                        type="text"
                        placeholder="Bằng cấp (vd: Cử nhân, Thạc sĩ)"
                        value={form.degree}
                        onChange={(e) => setForm({...form, degree: e.target.value})}
                        className="input-base"
                    />
                    <input
                        type="text"
                        placeholder="Ngành học"
                        value={form.field}
                        onChange={(e) => setForm({...form, field: e.target.value})}
                        className="input-base"
                    />
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tốt nghiệp</label>
                        <input
                            type="month"
                            value={form.graduationDate}
                            onChange={(e) => setForm({...form, graduationDate: e.target.value})}
                            className="input-base"
                        />
                    </div>
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
                    className="w-full py-3 border-2 border-dashed border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-semibold text-lg transition"
                >
                    ➕ Thêm học vấn
                </button>
            )}
        </div>
    );
}