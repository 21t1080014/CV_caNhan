import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getStoredToken, saveAuthSession } from '../utils/auth';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (getStoredToken()) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/login', { username, password });
            saveAuthSession(data.token);
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || '❌ Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface-container-low p-4">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="card backdrop-blur-xl">
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="space-y-2">
                            <h1 className="text-4xl font-extrabold tracking-tighter text-white">
                                Admin Portal
                            </h1>
                            <p className="text-on-surface-variant">Quản lý CV xin việc của bạn</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-error-container border border-error text-error-container rounded-lg text-sm font-semibold">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input-base"
                                    placeholder="Nhập tên đăng nhập"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-base"
                                    placeholder="Nhập mật khẩu"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Đang đăng nhập...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">lock_open</span>
                                    Đăng nhập
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <p className="text-center text-on-surface-variant mt-6 text-xs tracking-widest uppercase">
                    © 2026 Professional Portfolio Management
                </p>
            </div>
        </div>
    );
}
