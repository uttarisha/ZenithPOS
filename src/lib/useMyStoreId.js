import { useEffect, useState } from "react";
import { getStoreByAdminApi } from "@/lib/storeApi";

export default function useMyStoreId() {
  const [storeId, setStoreId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getStoreByAdminApi()
      .then((store) => {
        if (active) setStoreId(store ? store.id : null);
      })
      .catch(() => {
        if (active) setStoreId(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { storeId, loading };
}