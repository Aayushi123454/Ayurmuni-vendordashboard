import React from "react";
import UnavailableFeature from "../Unavailable/UnavailableFeature";

export default function RatingsUnavailable() {
    return (
        <UnavailableFeature
            title="Ratings & Reviews Coming Soon"
            description="Product reviews exist on variants in the backend, but vendor review management APIs are not available yet."
            backendNote="Vendor review listing and response endpoints are not implemented in the current backend."
        />
    );
}
