import React from "react";
import UnavailableFeature from "../Unavailable/UnavailableFeature";

export default function OrderDetailUnavailable() {
    return (
        <UnavailableFeature
            title="Order Details Unavailable"
            description="Vendor order detail APIs are not implemented in the backend yet."
            backendNote="Order detail will be available once vendor order endpoints are added to the API."
        />
    );
}
