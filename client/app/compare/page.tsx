import Link from 'next/link';
import type { Metadata } from 'next';
import CompareView from '@/app/components/CompareView';
import { fetchCompare } from '@/app/lib/api';
import { MAX_COMPARE } from '@/app/lib/constants'; // <-- Import from a shared file, NOT CompareContext
import styles from '@/app/components/Compare.module.css';

export const metadata: Metadata = { title: 'Compare products' };

type Props = { searchParams: Promise<{ ids?: string | string[] }> };

function parseIds(raw?: string | string[]): number[] {
    if (!raw) return [];
    const joined = Array.isArray(raw) ? raw.join(',') : String(raw);
    const decoded = decodeURIComponent(joined);

    const ids = decoded
        .split(',')
        .map((s) => s.trim())
        .filter((s) => /^\d+$/.test(s))
        .map(Number);

    return [...new Set(ids)].slice(0, MAX_COMPARE);
}

export default async function ComparePage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const raw = resolvedParams?.ids;

    const ids = parseIds(raw);
    console.log('[SERVER] raw:', raw, 'parsed ids:', ids, 'MAX_COMPARE:', MAX_COMPARE);

    let content: React.ReactNode;

    if (ids.length < 2) {
        content = <EmptyState />;
    } else {
        try {
            const data = await fetchCompare(ids);
            console.log('[SERVER] fetchCompare result:', data);
            content = !data?.products || data.products.length < 2
                ? <EmptyState />
                : <CompareView data={data} />;
        } catch (e) {
            content = (
                <div className={styles.emptyState} role="alert">
                    <p>{e instanceof Error ? e.message : 'Something went wrong.'}</p>
                    <Link className={styles.btn} href="/">Back to products</Link>
                </div>
            );
        }
    }

    return (
        <main className={styles.page}>
            <h1 className={styles.title}>Compare products</h1>
            {content}
        </main>
    );
}


function EmptyState() {
    return (
        <div className={styles.emptyState}>
            <p>Pick at least 2 products to compare them side by side. You can compare up to {MAX_COMPARE}.</p>
            <Link className={styles.btn} href="/products">Browse products</Link>{/* change to your list route */}
        </div>
    );
}