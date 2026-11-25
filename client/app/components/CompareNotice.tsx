// components/CompareNotice.tsx
'use client';

import { useCompare } from '@/app/context/CompareContext';
import styles from './Compare.module.css';

export default function CompareNotice() {
    const { notice } = useCompare();
    if (!notice) return null;
    return <div className={styles.tray} role="status" aria-live="polite">{notice}</div>;
}