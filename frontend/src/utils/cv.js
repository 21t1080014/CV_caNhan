export const EMPTY_SOCIAL_LINKS = {
    linkedin: '',
    github: '',
    portfolio: '',
    twitter: '',
};

export function createEmptyCV() {
    return {
        fullName: '',
        email: '',
        summary: '',
        about: '',
        skills: [],
        experiences: [],
        education: [],
        projects: [],
        phoneNumber: '',
        location: '',
        profileImage: '',
        socialLinks: { ...EMPTY_SOCIAL_LINKS },
        isPublished: false,
    };
}

export function normalizeCVData(data) {
    const emptyCV = createEmptyCV();
    const source = data ?? {};

    return {
        ...emptyCV,
        ...source,
        fullName: source.fullName ?? emptyCV.fullName,
        email: source.email ?? emptyCV.email,
        summary: source.summary ?? emptyCV.summary,
        about: source.about ?? emptyCV.about,
        skills: Array.isArray(source.skills) ? source.skills : emptyCV.skills,
        experiences: Array.isArray(source.experiences) ? source.experiences : emptyCV.experiences,
        education: Array.isArray(source.education) ? source.education : emptyCV.education,
        projects: Array.isArray(source.projects) ? source.projects : emptyCV.projects,
        phoneNumber: source.phoneNumber ?? emptyCV.phoneNumber,
        location: source.location ?? emptyCV.location,
        profileImage: source.profileImage ?? emptyCV.profileImage,
        socialLinks: {
            ...EMPTY_SOCIAL_LINKS,
            ...(source.socialLinks ?? {}),
        },
        isPublished: Boolean(source.isPublished),
    };
}
