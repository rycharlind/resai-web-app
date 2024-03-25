import { writable } from 'svelte/store';

export const userStore = writable(null);
export const tokenStore = writable(null);

const redirectUri = process.env.NODE_ENV === "production"
    ? process.env.PROD_BASE_URL
    : process.env.DEV_BASE_URL;

const azureClientId = process.env.AZURE_CLIENT_ID;
const azureAuthority = process.env.AZURE_AUTHORITY;

export const msalConfig = {
    auth: {
        clientId: azureClientId,
        authority: azureAuthority,
        redirectUri: redirectUri,
    },
};

export function saveUser(user) {
    userStore.set(user);
    localStorage.setItem('user', JSON.stringify(user));
}

export function saveToken(token) {
    tokenStore.set(token);
    localStorage.setItem('token', token);
}

export function loadUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    userStore.set(user);
}

export function loadToken() {
    const token = localStorage.getItem('token');
    tokenStore.set(token);
}

export function clearUserAndToken() {
    userStore.set(null);
    tokenStore.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
}