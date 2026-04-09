import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import SkillsManager from '../components/SkillsManager';
import ExperienceManager from '../components/ExperienceManager';
import EducationManager from '../components/EducationManager';
import ProjectsManager from '../components/ProjectsManager';
import { clearAuthSession } from '../utils/auth';
import { createEmptyCV, normalizeCVData } from '../utils/cv';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [cv, setCv] = useState(createEmptyCV);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tab, setTab] = useState('basic');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCV();
    }, []);

    const fetchCV = async () => {
        try {
            const { data } = await api.get('/admin/cv');
            setCv(normalizeCVData(data));
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/admin/login');
            } else {
                setMessage('❌ Lỗi tải CV');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/admin/cv', normalizeCVData(cv));
            setMessage('✅ CV đã được lưu thành công!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('❌ Lỗi khi lưu CV: ' + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        try {
            await api.post(`/admin/cv/publish?publish=${!cv.isPublished}`);
            setCv({ ...cv, isPublished: !cv.isPublished });
            setMessage(cv.isPublished ? '🔒 CV đã bị ẩn' : '✅ CV đã công bố');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('❌ Lỗi: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleLogout = () => {
        clearAuthSession();
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 font-semibold">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">

            {/* Header - Updated */}
            <header className="bg-surface-container-high border-b-2 border-primary/20 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tighter text-white">
                            Admin Dashboard
                        </h1>
                        <p className="text-on-surface-variant text-sm">
                            Quản lý CV xin việc của bạn
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-error/20 hover:bg-error/30 text-error rounded-lg font-semibold transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Đăng xuất
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg font-semibold text-center ${
                        message.includes('✅') || message.includes('🔒')
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                    }`}>
                        {message}
                    </div>
                )}

                {/* Publish Status */}
                <div className={`mb-6 p-5 rounded-lg flex justify-between items-center border-2 ${
                    cv.isPublished
                        ? 'bg-green-50 border-green-300'
                        : 'bg-yellow-50 border-yellow-300'
                }`}>
                    <div>
                        <p className="font-bold text-lg text-gray-800">
                            {cv.isPublished ? '✅ CV đang công khai' : '🔒 CV đang ẩn'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            {cv.isPublished
                                ? 'Người tuyển dụng có thể xem CV của bạn'
                                : 'Công bố CV để người tuyển dụng có thể xem'
                            }
                        </p>
                    </div>
                    <button
                        onClick={handlePublish}
                        className={`px-8 py-2 rounded-lg font-semibold text-white transition ${
                            cv.isPublished
                                ? 'bg-yellow-600 hover:bg-yellow-700'
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {cv.isPublished ? '🔒 Ẩn CV' : '📤 Công bố CV'}
                    </button>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
                    {[
                        { id: 'basic', icon: '📋', label: 'Cơ bản' },
                        { id: 'skills', icon: '🎯', label: 'Kỹ năng' },
                        { id: 'experience', icon: '💼', label: 'Kinh nghiệm' },
                        { id: 'education', icon: '🎓', label: 'Học vấn' },
                        { id: 'projects', icon: '🚀', label: 'Dự án' },
                        { id: 'contact', icon: '📞', label: 'Liên hệ' },
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`py-2 px-3 rounded-lg font-semibold transition text-sm ${
                                tab === t.id
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {tab === 'basic' && (
                        <BasicTab cv={cv} setCv={setCv} />
                    )}
                    {tab === 'skills' && (
                        <SkillsManager skills={cv.skills} onChange={(skills) => setCv({...cv, skills})} />
                    )}
                    {tab === 'experience' && (
                        <ExperienceManager experiences={cv.experiences} onChange={(exp) => setCv({...cv, experiences: exp})} />
                    )}
                    {tab === 'education' && (
                        <EducationManager education={cv.education} onChange={(edu) => setCv({...cv, education: edu})} />
                    )}
                    {tab === 'projects' && (
                        <ProjectsManager projects={cv.projects} onChange={(proj) => setCv({...cv, projects: proj})} />
                    )}
                    {tab === 'contact' && (
                        <ContactTab cv={cv} setCv={setCv} />
                    )}
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-6 w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:shadow-lg transition disabled:opacity-50"
                >
                    {saving ? '⏳ Đang lưu...' : '💾 Lưu CV'}
                </button>
            </div>
        </div>
    );
}

const MAX_PROFILE_IMAGE_SIZE = 3 * 1024 * 1024;

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Không thể đọc file ảnh'));
        reader.readAsDataURL(file);
    });
}

function BasicTab({ cv, setCv }) {
    const [imageError, setImageError] = useState('');

    const handleProfileImageChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            setImageError('❌ Vui lòng chọn file ảnh hợp lệ.');
            event.target.value = '';
            return;
        }

        if (file.size > MAX_PROFILE_IMAGE_SIZE) {
            setImageError('❌ Ảnh đại diện phải nhỏ hơn 3MB.');
            event.target.value = '';
            return;
        }

        try {
            const dataUrl = await readFileAsDataUrl(file);
            setCv({ ...cv, profileImage: dataUrl });
            setImageError('');
        } catch (error) {
            setImageError(error.message);
        } finally {
            event.target.value = '';
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">📋 Thông tin cơ bản</h2>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên *</label>
                    <input
                        type="text"
                        value={cv.fullName}
                        onChange={(e) => setCv({...cv, fullName: e.target.value})}
                        className="input-base"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                    <input
                        type="email"
                        value={cv.email}
                        disabled
                        className="input-base bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh đại diện</label>
                <label className="inline-flex cursor-pointer items-center gap-3 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">
                    <span className="material-symbols-outlined">upload</span>
                    Tải ảnh lên
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                    />
                </label>
                <p className="mt-2 text-sm text-gray-500">
                    Chọn ảnh JPG, PNG hoặc WebP. Kích thước tối đa 3MB.
                </p>
                {imageError && (
                    <p className="mt-2 text-sm font-semibold text-red-600">{imageError}</p>
                )}
                {cv.profileImage && (
                    <div className="mt-4 flex items-center gap-4">
                        <img src={cv.profileImage} alt="Preview" className="h-32 w-32 rounded-lg object-cover shadow-md" />
                        <button
                            type="button"
                            onClick={() => {
                                setCv({ ...cv, profileImage: '' });
                                setImageError('');
                            }}
                            className="rounded-lg border border-red-200 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-50"
                        >
                            Xóa ảnh
                        </button>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tóm tắt nghề nghiệp</label>
                <textarea
                    value={cv.summary}
                    onChange={(e) => setCv({...cv, summary: e.target.value})}
                    placeholder="Mô tả ngắn gọn về bản thân và kinh nghiệm của bạn"
                    rows="3"
                    className="input-base"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Về bạn</label>
                <textarea
                    value={cv.about}
                    onChange={(e) => setCv({...cv, about: e.target.value})}
                    placeholder="Mô tả chi tiết về bản thân, mục tiêu sự nghiệp"
                    rows="5"
                    className="input-base"
                />
            </div>
        </div>
    );
}

function ContactTab({ cv, setCv }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">📞 Thông tin liên hệ</h2>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                    <input
                        type="tel"
                        value={cv.phoneNumber}
                        onChange={(e) => setCv({...cv, phoneNumber: e.target.value})}
                        placeholder="+84 123 456 789"
                        className="input-base"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ</label>
                    <input
                        type="text"
                        value={cv.location}
                        onChange={(e) => setCv({...cv, location: e.target.value})}
                        placeholder="Hà Nội, Việt Nam"
                        className="input-base"
                    />
                </div>
            </div>

            <div className="border-t pt-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4">🌐 Liên kết mạng xã hội</h3>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn</label>
                        <input
                            type="url"
                            placeholder="https://linkedin.com/in/yourprofile"
                            value={cv.socialLinks.linkedin}
                            onChange={(e) => setCv({
                                ...cv,
                                socialLinks: {...cv.socialLinks, linkedin: e.target.value}
                            })}
                            className="input-base"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub</label>
                        <input
                            type="url"
                            placeholder="https://github.com/yourprofile"
                            value={cv.socialLinks.github}
                            onChange={(e) => setCv({
                                ...cv,
                                socialLinks: {...cv.socialLinks, github: e.target.value}
                            })}
                            className="input-base"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Portfolio</label>
                        <input
                            type="url"
                            placeholder="https://yourportfolio.com"
                            value={cv.socialLinks.portfolio}
                            onChange={(e) => setCv({
                                ...cv,
                                socialLinks: {...cv.socialLinks, portfolio: e.target.value}
                            })}
                            className="input-base"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter</label>
                        <input
                            type="url"
                            placeholder="https://twitter.com/yourprofile"
                            value={cv.socialLinks.twitter}
                            onChange={(e) => setCv({
                                ...cv,
                                socialLinks: {...cv.socialLinks, twitter: e.target.value}
                            })}
                            className="input-base"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
