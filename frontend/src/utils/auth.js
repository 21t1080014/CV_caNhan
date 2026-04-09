const TOKEN_STORAGE_KEY = 'token';

function decodeBase64Url(value) {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), '=');
    return window.atob(padded);
}

function parseTokenPayload(token) {
    if (!token) {
        return null;
    }

    try {
        const [, payload] = token.split('.');
        if (!payload) {
            return null;
        }

        return JSON.parse(decodeBase64Url(payload));
    } catch {
        return null;
    }
}

export function getTokenExpiration(token) {
    const payload = parseTokenPayload(token);
    const expirationInSeconds = Number(payload?.exp);

    if (!Number.isFinite(expirationInSeconds) || expirationInSeconds <= 0) {
        return null;
    }

    return expirationInSeconds * 1000;
}

export function isTokenValid(token) {
    if (!token) {
        return false;
    }

    const expiration = getTokenExpiration(token);
    if (!expiration) {
        return false;
    }

    return Date.now() < expiration;
}

export function getStoredToken() {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!isTokenValid(token)) {
        clearAuthSession();
        return null;
    }

    return token;
}

export function saveAuthSession(token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAuthSession() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
}
