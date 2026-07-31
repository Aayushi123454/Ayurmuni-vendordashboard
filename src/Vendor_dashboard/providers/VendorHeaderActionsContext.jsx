import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const VendorHeaderActionsContext = createContext(null);

export function VendorHeaderActionsProvider({ children }) {
    const [actions, setActions] = useState(null);

    const value = useMemo(() => ({ actions, setActions }), [actions]);

    return (
        <VendorHeaderActionsContext.Provider value={value}>
            {children}
        </VendorHeaderActionsContext.Provider>
    );
}

export function useVendorHeaderActions(actions) {
    const ctx = useContext(VendorHeaderActionsContext);

    useEffect(() => {
        if (!ctx) return undefined;
        ctx.setActions(actions ?? null);
        return () => ctx.setActions(null);
    }, [ctx, actions]);
}

export function useVendorHeaderActionsSlot() {
    return useContext(VendorHeaderActionsContext)?.actions ?? null;
}
