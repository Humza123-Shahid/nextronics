'use client';

import {
    createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';
import type { CompareProduct } from '@/app/types/compare';
import { useAuth } from './AuthContext';

export const MAX_COMPARE = 4;
//const STORAGE_KEY = 'compare:products';

type CompareContextValue = {
    items: CompareProduct[];
    ready: boolean; // false until localStorage has been read (avoids hydration mismatch)
    notice: string | null;
    has: (id: number) => boolean;
    toggle: (product: CompareProduct) => void;
    remove: (id: number) => void;
    clear: () => void;
    replaceAll: (products: CompareProduct[]) => void;
};

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();                                   // NEW
    const storageKey = `compare:products:${user?.id ?? 'guest'}`; // NEW
    const [items, setItems] = useState<CompareProduct[]>([]);
    //const [ready, setReady] = useState(false);
    const [loadedKey, setLoadedKey] = useState<string | null>(null);  // replaces `ready` state
    const ready = loadedKey === storageKey;
    const [notice, setNotice] = useState<string | null>(null);


    // load whenever the key changes (login / logout / first render)
    useEffect(() => {
        let stored: CompareProduct[] = [];
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) stored = JSON.parse(raw).slice(0, MAX_COMPARE);
        } catch { /* ignore corrupted storage */ }
        setItems(stored);
        setLoadedKey(storageKey);
    }, [storageKey]);

    // persist only after this key's data has been loaded,
    // so one user's items never get written into another user's key
    useEffect(() => {
        if (!ready) return;
        try { localStorage.setItem(storageKey, JSON.stringify(items)); } catch { /* ignore */ }
    }, [items, ready, storageKey]);

    // keep tabs in sync
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === storageKey && e.newValue) {
                try { setItems(JSON.parse(e.newValue)); } catch { /* ignore */ }
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [storageKey]);

    // load once on the client
    // useEffect(() => {
    //     try {
    //         const raw = localStorage.getItem(STORAGE_KEY);
    //         if (raw) setItems(JSON.parse(raw).slice(0, MAX_COMPARE));
    //     } catch { /* ignore corrupted storage */ }
    //     setReady(true);
    // }, []);

    // // persist
    // useEffect(() => {
    //     if (!ready) return;
    //     try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* storage full/blocked */ }
    // }, [items, ready]);

    // // keep tabs in sync
    // useEffect(() => {
    //     const onStorage = (e: StorageEvent) => {
    //         if (e.key === STORAGE_KEY && e.newValue) {
    //             try { setItems(JSON.parse(e.newValue)); } catch { /* ignore */ }
    //         }
    //     };
    //     window.addEventListener('storage', onStorage);
    //     return () => window.removeEventListener('storage', onStorage);
    // }, []);

    // auto-hide notices
    useEffect(() => {
        if (!notice) return;
        const t = setTimeout(() => setNotice(null), 3500);
        return () => clearTimeout(t);
    }, [notice]);

    const has = useCallback((id: number) => items.some((p) => p.id === id), [items]);

    const toggle = useCallback((product: CompareProduct) => {
        if (items.some((p) => p.id === product.id)) {
            setItems(items.filter((p) => p.id !== product.id));
            return;
        }
        if (items.length >= MAX_COMPARE) {
            setNotice(`You can compare up to ${MAX_COMPARE} products. Remove one first.`);
            return;
        }
        setItems([...items, { id: product.id, name: product.name, slug: product.slug, image: product.image }]);
    }, [items]);

    const remove = useCallback((id: number) => setItems((cur) => cur.filter((p) => p.id !== id)), []);
    const clear = useCallback(() => setItems([]), []);
    const replaceAll = useCallback((products: CompareProduct[]) => setItems(products.slice(0, MAX_COMPARE)), []);

    const value = useMemo(
        () => ({ items, ready, notice, has, toggle, remove, clear, replaceAll }),
        [items, ready, notice, has, toggle, remove, clear, replaceAll],
    );

    return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
    const ctx = useContext(CompareContext);
    if (!ctx) throw new Error('useCompare must be used inside <CompareProvider>');
    return ctx;
}