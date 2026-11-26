import Link from 'next/link';
import type { Metadata } from 'next';
import CompareView from '@/app/components/CompareView';
import CompareSync from '@/app/components/CompareSync';
import { fetchCompare } from '@/app/lib/api';
import { MAX_COMPARE } from '@/app/lib/constants'; // <-- Import from a shared file, NOT 
import type { CompareProduct } from '@/app/types/compare';
import styles from '@/app/components/Compare.module.css';
import CompareHeader from './CompareHeader';
import Footer from '../components/Footer';

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
    const hasIdsParam = raw !== undefined;
    console.log('[SERVER] raw:', raw, 'parsed ids:', ids, 'MAX_COMPARE:', MAX_COMPARE);

    let content: React.ReactNode;
    let synced: CompareProduct[] | null = null;

    if (ids.length === 0) {
        content = <EmptyState selected={0} />;
        if (hasIdsParam) synced = [];
    } else {
        try {
            const data = await fetchCompare(ids);
            synced = data.products.map(({ id, name, slug, image }) => ({ id, name, slug, image }));
            console.log('[SERVER] fetchCompare result:', data);
            content = !data?.products || data.products.length < 2
                ? <EmptyState selected={data.products.length} />
                : <CompareView data={data} />;
        } catch (e) {
            content = (
                <div className={styles.emptyState} role="alert">
                    <p>{e instanceof Error ? e.message : 'Something went wrong.'}</p>
                    <Link className={styles.btn} href="/shop">Back to products</Link>
                </div>
            );
        }
    }

    return (
        <>
            <CompareHeader />
            <main className={styles.page}>

                <h1 className={styles.title}>Compare products</h1>
                {content}
                {synced && <CompareSync products={synced} />}

            </main>
            <Footer />
        </>
    );
}


function EmptyState({ selected }: { selected: number }) {
    return (
        <div className={styles.emptyState}>
            {selected === 1 ? 'You have 1 product selected. ' : ''}
            <p>Pick at least 2 products to compare them side by side. You can compare up to {MAX_COMPARE}.</p>
            <Link className={styles.btn} href="/shop">Browse products</Link>{/* change to your list route */}
        </div>
    );
}