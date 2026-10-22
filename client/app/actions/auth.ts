'use server';

import { cookies } from 'next/headers';

export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();

    cookieStore.set('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        // maxAge: 60 * 60 * 24 * 7, // 7 days
        expires: new Date(Date.now() + 60 * 60 * 23 * 1000), // 1 day from now as a Date object
        path: '/',
    });
}

export async function getAuthCookie() {
    const cookieStore = await cookies();
    return cookieStore.get('access_token')?.value;
}

export async function deleteAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
}

