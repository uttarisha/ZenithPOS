import React from "react";
import { Printer, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShiftHeader({ onPrint, onEndShift, ending }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Shift Summary</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Overview of active shift sales, payments, and activity.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button 
          variant="outline" 
          onClick={onPrint}
          className="h-9 px-3.5 text-xs font-medium"
        >
          <Printer className="h-3.5 w-3.5 mr-2 text-gray-600" />
          Print Summary
        </Button>
        <Button 
          variant="destructive" 
          onClick={onEndShift} 
          disabled={ending}
          className="h-9 px-3.5 text-xs font-medium bg-red-600 hover:bg-red-700"
        >
          <LogOut className="h-3.5 w-3.5 mr-2" />
          {ending ? "Ending..." : "End Shift & Logout"}
        </Button>
      </div>
    </div>
  );
}