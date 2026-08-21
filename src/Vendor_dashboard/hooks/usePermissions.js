import { useCallback, useEffect, useState } from "react";

export default function usePermissions() {
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("profile") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const sync = () => {
      try {
        setProfile(JSON.parse(sessionStorage.getItem("profile") || "null"));
      } catch {
        setProfile(null);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const role = sessionStorage.getItem("role");
  const isVerified = Boolean(profile?.verify);
  const isVendor = role === "vendor";

  const canAccess = useCallback(
    (module) => {
      if (!isVerified) {
        return ["profile", "help-support", "settings"].includes(module);
      }
      return true;
    },
    [isVerified]
  );

  return { profile, role, isVerified, isVendor, canAccess };
}
