import { useMemo } from "react";

// Reads the logged-in branch user's branchId / storeId saved at login.
export default function useMyBranch() {
  return useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      return {
        branchId: user?.branchId ?? null,
        storeId: user?.storeId ?? null,
      };
    } catch {
      return { branchId: null, storeId: null };
    }
  }, []);
}