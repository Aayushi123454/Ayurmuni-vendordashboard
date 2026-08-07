import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock3 } from "lucide-react";
import DashboardPageShell from "../../components/shared/DashboardPageShell";
import Button from "../../components/shared/Button";

export default function UnavailableFeature({ title, description, backendNote }) {
    const navigate = useNavigate();

    return (
        <DashboardPageShell title={title} subtitle={description}>
            <div className="mx-auto flex min-h-[360px] max-w-2xl flex-col items-center justify-center rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 px-8 py-12 text-center shadow-sm">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Clock3 size={38} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Coming Soon</h2>
                {backendNote && (
                    <p className="mt-4 rounded-xl border border-amber-100 bg-white px-4 py-3 text-xs leading-relaxed text-gray-500">
                        {backendNote}
                    </p>
                )}
                <Button className="mt-8" onClick={() => navigate("/vendor/dashboard")}>
                    Back to Dashboard
                </Button>
            </div>
        </DashboardPageShell>
    );
}
