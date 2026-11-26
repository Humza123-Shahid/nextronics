'use client';

import { useEffect } from 'react';
import { useCompare } from '@/app/context/CompareContext';
import type { CompareProduct } from '@/app/types/compare';

export default function CompareSync({ products }: { products: CompareProduct[] }) {
    const { replaceAll } = useCompare();

    useEffect(() => {
        replaceAll(products);
    }, [products, replaceAll]);

    return null;
}