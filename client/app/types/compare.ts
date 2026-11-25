/** Minimal product snapshot stored in the compare list (localStorage). */
export type CompareProduct = {
    id: number;
    name: string;
    slug: string;
    image: string | null;
};

export type CompareColumn = CompareProduct & {
    price_display: string;
    compare_at_display: string | null;
};

export type CompareRow = {
    label: string;
    values: (string | null)[];
    differs: boolean;
    best: number[];
};

export type CompareSection = { title: string; rows: CompareRow[] };

export type CompareResponse = {
    products: CompareColumn[];
    sections: CompareSection[];
    min_items: number;
    max_items: number;
};