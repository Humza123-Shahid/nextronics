// components/CompareNavLink.tsx
'use client';

import Link from 'next/link';
import {
    Shuffle
} from "lucide-react";
import { useCompare } from '@/app/context/CompareContext';

export default function CompareNavLink({
    showLabel = false,
    onClick,
}: {
    showLabel?: boolean;
    onClick?: () => void;
}) {
    const actionLink =
        "flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400";
    const badge =
        "absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center";

    const { items, ready } = useCompare();
    const count = ready ? items.length : 0;
    const href = count ? `/compare?ids=${items.map((p) => p.id).join(',')}` : '/compare';

    return (
        <Link href={href} onClick={onClick} className={actionLink}>
            <span className="relative">
                <Shuffle className={showLabel ? "w-4 h-4" : "w-5 h-5"} />
                <span className={badge}>{count}</span>
            </span>
            <span className={showLabel ? "" : "sr-only"}>Compare</span>
        </Link>
        // <Link href={href} aria-label={`Compare products${count ? `, ${count} selected` : ''}`}
        //     style={{ position: 'relative', display: 'inline-flex' }}>
        //     {/* your existing shuffle icon here */}
        //     <Shuffle className="w-5 h-5" />
        //     {count > 0 && (
        //         <span style={{
        //             position: 'absolute', top: -6, right: -8, minWidth: 18, height: 18,
        //             borderRadius: 9, background: '#0b5fff', color: '#fff',
        //             fontSize: 11, lineHeight: '18px', textAlign: 'center',
        //         }}>{count}</span>
        //     )}
        // </Link>
    );
}