import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function PublicPortfolio() {
    const [cv, setCv] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState('intro');

    useEffect(() => {
        const fetchCV = async () => {
            try {
                const { data } = await api.get('/public/cv');
                setCv(data);
            } catch (err) {
                setError('CV chưa được công bố hoặc đã xảy ra lỗi');
                console.error('Error fetching CV:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCV();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg text-on-surface-variant font-semibold">Đang tải CV...</p>
                </div>
            </div>
        );
    }

    if (error || !cv) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center card max-w-md">
                    <p className="text-2xl font-bold text-white">⚠️ {error || 'CV chưa được công bố'}</p>
                    <p className="text-on-surface-variant mt-2">Vui lòng quay lại sau</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background text-on-background min-h-screen">
            {/* TopNavBar */}
            <nav className="bg-[#131313]/70 backdrop-blur-xl fixed top-0 w-full z-50 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                <div className="flex justify-between items-center px-8 h-16 max-w-7xl mx-auto w-full">
                    <div className="text-lg font-bold tracking-tighter text-white">
                        {cv.fullName || 'Portfolio'}
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {[
                            { id: 'intro', label: 'Intro', icon: 'person' },
                            { id: 'experience', label: 'Experience', icon: 'work' },
                            { id: 'projects', label: 'Projects', icon: 'folder' },
                            { id: 'skills', label: 'Skills', icon: 'code' },
                            { id: 'education', label: 'Education', icon: 'school' },
                        ].map(item => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={() => setActiveSection(item.id)}
                                className={`font-['Inter'] tracking-tight text-sm font-medium transition-colors ${
                                    activeSection === item.id
                                        ? 'text-primary border-b-2 border-primary pb-1'
                                        : 'text-on-surface-variant hover:text-white'
                                }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <a
                        href={`mailto:${cv.email}`}
                        className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-medium text-sm hover:scale-95 duration-200 ease-in-out transition-all"
                    >
                        Contact
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-8 max-w-7xl mx-auto" id="intro">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Avatar Side */}
                    <div className="w-full lg:w-1/2 flex justify-start">
                        <div className="relative group">
                            <div className="absolute -inset-4 hero-gradient opacity-20 blur-3xl group-hover:opacity-30 transition duration-1000"></div>
                            {cv.profileImage && (
                                <img
                                    alt={cv.fullName}
                                    src={cv.profileImage}
                                    className="relative w-full max-w-md aspect-[4/5] object-cover rounded-xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                                />
                            )}
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div className="space-y-4 animate-fade-in">
                            <h2 className="text-primary font-medium tracking-widest text-sm uppercase">Developer</h2>
                            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white leading-tight">
                                {cv.fullName}
                            </h1>
                            <p className="text-on-surface-variant text-lg md:text-xl max-w-lg leading-relaxed font-light">
                                {cv.summary || cv.about}
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-6">
                            <button className="hero-gradient text-on-primary-container px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:shadow-glow-lg transition-all">
                                <span>Download CV</span>
                                <span className="material-symbols-outlined">download</span>
                            </button>

                            {/* Social Links */}
                            <div className="flex items-center gap-4">
                                {cv.socialLinks?.github && (
                                    <a
                                        href={cv.socialLinks.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-surface-container-high rounded-full hover:bg-primary hover:text-on-primary transition-all duration-300"
                                    >
                                        <span className="material-symbols-outlined">code</span>
                                    </a>
                                )}
                                {cv.socialLinks?.linkedin && (
                                    <a
                                        href={cv.socialLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-surface-container-high rounded-full hover:bg-primary hover:text-on-primary transition-all duration-300"
                                    >
                                        <span className="material-symbols-outlined">person</span>
                                    </a>
                                )}
                                {cv.email && (
                                    <a
                                        href={`mailto:${cv.email}`}
                                        className="p-3 bg-surface-container-high rounded-full hover:bg-primary hover:text-on-primary transition-all duration-300"
                                    >
                                        <span className="material-symbols-outlined">mail</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            {cv.experiences && cv.experiences.length > 0 && (
                <section className="py-24 bg-surface-container-low" id="experience">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="mb-16">
                            <h2 className="section-title mb-4">Experience</h2>
                            <div className="h-1 w-20 hero-gradient"></div>
                        </div>

                        <div className="relative max-w-4xl mx-auto">
                            {/* Vertical Line */}
                            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-px bg-outline-variant opacity-30"></div>

                            {cv.experiences.map((exp, i) => (
                                <div key={i} className="relative mb-20 md:mb-32">
                                    <div className="md:flex items-center justify-between">
                                        <div className="hidden md:block w-[45%] text-right pr-12">
                      <span className="text-primary font-bold text-sm tracking-widest uppercase">
                        {exp.startDate}
                      </span>
                                        </div>

                                        <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-surface shadow-[0_0_15px_rgba(174,198,255,0.6)]"></div>

                                        <div className="pl-12 md:pl-0 md:w-[45%]">
                                            <div className="card">
                                                <h4 className="text-white font-bold text-xl mb-1">{exp.position}</h4>
                                                <p className="text-primary text-sm mb-4">{exp.company}</p>
                                                <span className="md:hidden text-primary font-bold text-xs tracking-widest uppercase mb-4 block">
                          {exp.startDate} - {exp.endDate}
                        </span>
                                                <p className="text-on-surface-variant text-sm leading-relaxed">{exp.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Projects Section */}
            {cv.projects && cv.projects.length > 0 && (
                <section className="py-24 max-w-7xl mx-auto px-8" id="projects">
                    <div className="mb-16">
                        <h2 className="section-title mb-4">Featured Projects</h2>
                        <div className="h-1 w-20 hero-gradient"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cv.projects.map((proj, i) => (
                            <div
                                key={i}
                                className="group relative bg-surface-container-high rounded-xl overflow-hidden ghost-border hover:scale-[1.02] transition-all duration-500"
                            >
                                <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-900 to-blue-950 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-6xl text-primary/30">folder</span>
                                </div>

                                <div className="p-8 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-2xl font-bold text-white">{proj.name}</h3>
                                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                                    </div>

                                    <p className="text-on-surface-variant text-sm leading-relaxed">
                                        {proj.description}
                                    </p>

                                    {proj.technologies && (
                                        <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {proj.technologies.split(',').map((tech, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] uppercase tracking-widest rounded-full font-bold"
                                                >
                          {tech.trim()}
                        </span>
                                            ))}
                                        </div>
                                    )}

                                    {proj.link && (
                                        <a
                                            href={proj.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-3 mt-4 bg-surface-container-highest text-white font-semibold rounded-lg flex justify-center items-center gap-2 hover:bg-primary hover:text-on-primary transition-all"
                                        >
                                            View Project
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills Section */}
            {cv.skills && cv.skills.length > 0 && (
                <section className="py-24 bg-surface-container-low" id="skills">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="flex flex-col md:flex-row gap-16">
                            <div className="w-full md:w-1/3">
                                <h2 className="section-title mb-6">Technical Arsenal</h2>
                                <p className="text-on-surface-variant leading-relaxed mb-8">
                                    My tools are an extension of my craft. I prioritize modern stacks that offer type safety, performance, and scalability.
                                </p>
                            </div>

                            <div className="w-full md:w-2/3">
                                <div className="flex flex-wrap gap-3">
                                    {cv.skills.map((skill, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 px-4 py-3 bg-surface-container rounded-lg ghost-border hover:bg-surface-container-high transition-colors group"
                                        >
                                            <span className="material-symbols-outlined text-lg group-hover:text-primary transition-colors">check_circle</span>
                                            <span className="text-sm font-medium">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Education Section */}
            {cv.education && cv.education.length > 0 && (
                <section className="py-24 max-w-7xl mx-auto px-8" id="education">
                    <div className="mb-16">
                        <h2 className="section-title mb-4">Formative Path</h2>
                        <div className="h-1 w-20 hero-gradient"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {cv.education.map((edu, i) => (
                            <div key={i} className="card group hover:bg-surface-container-high transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-white font-bold text-lg">{edu.degree}</h4>
                                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">school</span>
                                </div>
                                <p className="text-primary font-semibold mb-2">{edu.school}</p>
                                <p className="text-on-surface-variant text-sm">
                                    Ngành: {edu.field}
                                </p>
                                <p className="text-on-surface-variant text-sm">
                                    Tốt nghiệp: {edu.graduationDate}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Contact Section */}
            <section className="py-24 bg-surface-container-low">
                <div className="max-w-7xl mx-auto px-8 text-center">
                    <h2 className="section-title mb-6">Let's Connect</h2>
                    <p className="text-on-surface-variant text-lg mb-8 max-w-2xl mx-auto">
                        I'm always interested in hearing about new projects and opportunities.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={`mailto:${cv.email}`}
                            className="btn-primary flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">mail</span>
                            Send Email
                        </a>

                        {cv.socialLinks?.linkedin && (
                            <a
                                href={cv.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">person</span>
                                LinkedIn
                            </a>
                        )}

                        {cv.socialLinks?.github && (
                            <a
                                href={cv.socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">code</span>
                                GitHub
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#1c1b1b] border-t border-outline-variant/20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto w-full py-12 px-8">
                    <div className="space-y-2">
                        <div className="text-sm font-semibold text-white">
                            {cv.fullName}
                        </div>
                        <p className="font-['Inter'] text-xs uppercase tracking-widest text-zinc-500">
                            © 2026 Professional Portfolio. Built with Craft.
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        {cv.socialLinks?.github && (
                            <a
                                href={cv.socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-['Inter'] text-xs uppercase tracking-widest text-zinc-500 hover:text-blue-400 transition-colors opacity-80 hover:opacity-100"
                            >
                                GitHub
                            </a>
                        )}
                        {cv.socialLinks?.linkedin && (
                            <a
                                href={cv.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-['Inter'] text-xs uppercase tracking-widest text-zinc-500 hover:text-blue-400 transition-colors opacity-80 hover:opacity-100"
                            >
                                LinkedIn
                            </a>
                        )}
                        {cv.socialLinks?.twitter && (
                            <a
                                href={cv.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-['Inter'] text-xs uppercase tracking-widest text-zinc-500 hover:text-blue-400 transition-colors opacity-80 hover:opacity-100"
                            >
                                Twitter
                            </a>
                        )}
                        {cv.email && (
                            <a
                                href={`mailto:${cv.email}`}
                                className="font-['Inter'] text-xs uppercase tracking-widest text-zinc-500 hover:text-blue-400 transition-colors opacity-80 hover:opacity-100"
                            >
                                Email
                            </a>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}