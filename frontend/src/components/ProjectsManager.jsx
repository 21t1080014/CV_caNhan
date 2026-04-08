import { useState } from 'react';

export default function ProjectsManager({ projects, onChange }) {
    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        technologies: '',
        link: ''
    });

    const handleAdd = () => {
        if (form.name && form.description) {
            onChange([...projects, form]);
            setForm({ name: '', description: '', technologies: '', link: '' });
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">🚀 Dự án</h2>

            {projects.map((proj, i) => (
                <div key={i} className="p-5 border-2 border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-transparent">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800">{proj.name}</h3>
                            <p className="text-gray-700 mt-2">{proj.description}</p>
                            {proj.technologies && (
                                <p className="text-sm text-gray-500 mt-2">
                                    <strong>Công nghệ:</strong> {proj.technologies}
                                </p>
                            )}
                            {proj.link && (
                                <a href={proj.link} target="_blank" rel="noopener noreferrer"
                                   className="text-indigo-600 hover:underline font-semibold mt-2 inline-block">
                                    🔗 Xem dự án →
                                </a>
                            )}
                        </div>
                        <button
                            onClick={() => onChange(projects.filter((_, idx) => idx !== i))}
                            className="ml-4 text-red-600 hover:text-red-700 font-bold text-xl"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            ))}

            {isAdding ? (
                <div className="p-5 border-2 border-green-400 rounded-lg bg-green-50 space-y-3">
                    <input
                        type="text"
                        placeholder="Tên dự án"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        className="input-base"
                    />
                    <textarea
                        placeholder="Mô tả dự án"
                        value={form.description}
                        onChange={(e) => setForm({...form, description: e.target.value})}
                        rows="2"
                        className="input-base"
                    />
                    <input
                        type="text"
                        placeholder="Công nghệ sử dụng (vd: React, Spring Boot, MongoDB)"
                        value={form.technologies}
                        onChange={(e) => setForm({...form, technologies: e.target.value})}
                        className="input-base"
                    />
                    <input
                        type="url"
                        placeholder="Link dự án (GitHub, Demo)"
                        value={form.link}
                        onChange={(e) => setForm({...form, link: e.target.value})}
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
                    className="w-full py-3 border-2 border-dashed border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-semibold text-lg transition"
                >
                    ➕ Thêm dự án
                </button>
            )}
        </div>
    );
}