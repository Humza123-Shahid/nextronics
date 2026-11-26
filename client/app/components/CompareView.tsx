'use client';

import Link from 'next/link';
import { useEffect, useState, type CSSProperties } from 'react';
import { useCompare } from '@/app/context/CompareContext';
import type { CompareResponse } from '@/app/types/compare';
import styles from './Compare.module.css';

export default function CompareView({ data }: { data: CompareResponse }) {
    // const { replaceAll, clear } = useCompare();
    const { clear } = useCompare();
    const [diffOnly, setDiffOnly] = useState(false);
    const { products, sections } = data;

    // The URL is the source of truth: keep the stored list in sync with it.
    // useEffect(() => {
    //     replaceAll(products.map(({ id, name, slug, image }) => ({ id, name, slug, image })));
    // }, [products, replaceAll]);

    const visibleSections = sections
        .map((s) => ({ ...s, rows: s.rows.filter((r) => !diffOnly || r.differs) }))
        .filter((s) => s.rows.length > 0);

    return (
        <>
            <div className={styles.toolbar}>
                <label className={styles.check}>
                    <input type="checkbox" checked={diffOnly} onChange={(e) => setDiffOnly(e.target.checked)} />
                    Show differences only
                </label>
                <p className={styles.legend}>
                    <span className={`${styles.swatch} ${styles.swatchDiff}`} /> Differs
                    <span className={`${styles.swatch} ${styles.swatchBest}`} /> Best value
                </p>
                <Link href="/compare" className={styles.link} onClick={clear}>Clear all</Link>
            </div>

            <div className={styles.scroll} tabIndex={0} role="region"
                aria-label="Comparison table, scrolls sideways on small screens">
                <table className={styles.table} style={{ '--cols': products.length } as CSSProperties}>
                    <thead>
                        <tr>
                            <th scope="col"><span className={styles.sr}>Product</span></th>
                            {products.map((p) => {
                                const others = products.filter((o) => o.id !== p.id).map((o) => o.id).join(',');
                                return (
                                    <th scope="col" key={p.id}>
                                        <div className={styles.product}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            {p.image && <img src={p.image} alt="" loading="lazy" />}
                                            <strong className={styles.name}>
                                                <Link href={`/products/${p.slug}`}>{p.name}</Link>{/* change to your product route */}
                                            </strong>
                                            <span className={styles.price}>
                                                {p.price_display}
                                                {p.compare_at_display && <s>{p.compare_at_display}</s>}
                                            </span>
                                            <Link className={styles.remove} href={`/compare?ids=${others}`}
                                                aria-label={`Remove ${p.name} from comparison`}>
                                                Remove
                                            </Link>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    {visibleSections.map((section) => (
                        <tbody key={section.title}>
                            <tr className={styles.section}>
                                <th colSpan={products.length + 1} scope="colgroup">{section.title}</th>
                            </tr>
                            {section.rows.map((row) => (
                                <tr key={row.label} className={row.differs ? styles.differs : undefined}>
                                    <th scope="row">{row.label}</th>
                                    {row.values.map((value, i) => {
                                        const best = row.best.includes(i);
                                        return (
                                            <td key={i} className={best ? styles.best : undefined}>
                                                {value ?? <span className={styles.empty} aria-label="Not specified">—</span>}
                                                {best && <span className={styles.tag}>Best</span>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    ))}
                </table>
            </div>

            {visibleSections.length === 0 && (
                <p className={styles.emptyNote}>These products have identical specifications.</p>
            )}
        </>
    );
}