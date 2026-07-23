import React from "react";
import UnavailableFeature from "../Unavailable/UnavailableFeature";

export default function FinanceUnavailable() {
    return (
        <UnavailableFeature
            title="Finance & Earnings Coming Soon"
            description="Wallet and transaction APIs exist in the backend models but are not yet exposed for vendor dashboards."
            backendNote="Payments wallet/escrow models are present server-side; vendor-facing finance endpoints are pending."
        />
    );
}
