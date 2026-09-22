import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import CustomerList from "./CustomerList";
import CustomerDetails from "./CustomerDetails";
import {
  getCustomersApi,
  getCustomerByIdApi,
  addCustomerApi,
} from "@/lib/customerApi";
import useMyBranch from "@/lib/useMyBranch";
import NoBranchNotice from "@/components/NoBranchNotice";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function CustomerLookup() {
  const { branchId } = useMyBranch();

  const [customers, setCustomers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [listError, setListError] = useState("");

  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const fetchCustomers = async () => {
    try {
      const data = await getCustomersApi(search);
      setCustomers(data);
      setListError("");
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
    } catch (err) {
      setCustomers([]);
      setListError(getErrorMessage(err, "Could not load customers"));
    }
  };

  useEffect(() => {
    if (!branchId) return;
    fetchCustomers();
  }, [search, branchId]);

  useEffect(() => {
    if (!branchId || !selectedId) {
      setDetails(null);
      return;
    }

    let active = true;
    setDetailsLoading(true);
    setDetailsError("");

    getCustomerByIdApi(selectedId)
      .then((data) => {
        if (active) setDetails(data);
      })
      .catch((err) => {
        if (active) {
          setDetails(null);
          setDetailsError(getErrorMessage(err, "Could not load customer details"));
        }
      })
      .finally(() => {
        if (active) setDetailsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedId, branchId]);

  const handleAddNew = async () => {
    const name = prompt("Enter customer name:");
    if (!name) return;
    const email = prompt("Enter customer email:") || "";
    const phone = prompt("Enter customer phone:") || "";

    try {
      const created = await addCustomerApi({ name, email, phone });
      await fetchCustomers();
      setSelectedId(created.id);
    } catch (err) {
      alert(getErrorMessage(err, "Could not add customer"));
    }
  };

  if (!branchId) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Management</h1>
          <NoBranchNotice />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Customer Management
          </h1>
        </div>

        {listError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
            {listError}
          </div>
        )}

        <div className="flex-1 flex gap-4 overflow-hidden">
          <CustomerList
            customers={customers}
            selectedId={selectedId}
            onSelectCustomer={setSelectedId}
            search={search}
            setSearch={setSearch}
            onAddNew={handleAddNew}
          />

          {detailsLoading ? (
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-[#312e81]" />
            </div>
          ) : detailsError ? (
            <div className="flex-1 bg-white rounded-xl border border-red-200 shadow-sm flex items-center justify-center text-xs text-red-600 p-4 text-center">
              {detailsError}
            </div>
          ) : (
            <CustomerDetails customer={details} />
          )}
        </div>
      </div>
    </div>
  );
}