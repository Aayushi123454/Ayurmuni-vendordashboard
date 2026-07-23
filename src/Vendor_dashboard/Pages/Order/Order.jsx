import React from "react";
import UnavailableFeature from "../Unavailable/UnavailableFeature";

export default function OrderUnavailable() {
    return (
        <UnavailableFeature
            title="Order Management Coming Soon"
            description="Vendor order listing and fulfillment APIs are not available in the backend yet. This screen will be connected once vendor order endpoints are released."
            backendNote="Current /order/ APIs are customer-facing only. Wallet, earnings, and transaction APIs are also not exposed for vendors yet."
        />
    );
}
