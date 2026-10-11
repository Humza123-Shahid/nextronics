"use client";

export type GadgetTabId = "popular" | "new" | "sale";

export const GADGET_TAB_EVENT = "gadgets:select-tab";
export const GADGETS_SECTION_ID = "gadgets";

// header href -> gadget tab
export const GADGET_TAB_MAP: Record<string, GadgetTabId> = {
    "#most-popular": "popular",
    "#new-arrival": "new",
    "#on-sale": "sale",
};

/** Same-page navigation: used when the header AND GadgetsSection are both
 *  mounted together (the home page). */
export function goToGadgets(tab: GadgetTabId) {
    window.dispatchEvent(new CustomEvent<GadgetTabId>(GADGET_TAB_EVENT, { detail: tab }));
    document.getElementById(GADGETS_SECTION_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Cross-page navigation: reads the tab out of the URL hash, e.g. after
 *  landing on "/#on-sale" coming from /shop. GadgetsSection calls this once
 *  on mount. */
export function getGadgetTabFromHash(): GadgetTabId | null {
    if (typeof window === "undefined") return null;
    return GADGET_TAB_MAP[window.location.hash] ?? null;
}

/** For pages where GadgetsSection is NOT mounted (e.g. /shop): if href maps
 *  to a gadget tab, route to the home page with that hash; otherwise leave
 *  the href untouched. */
export function resolveGadgetHref(href: string, homePath = "/"): string {
    return GADGET_TAB_MAP[href] ? `${homePath}${href}` : href;
}

/** Use when you're already on the page that contains GadgetsSection. */
export function selectGadgetTab(tab: GadgetTabId) {
    window.dispatchEvent(new CustomEvent<GadgetTabId>(GADGET_TAB_EVENT, { detail: tab }));
    document.getElementById("gadgets")?.scrollIntoView({ behavior: "smooth", block: "start" });
}