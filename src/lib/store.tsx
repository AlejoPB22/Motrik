"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { RECORDS, USER_VEHICLES, type MaintenanceRecord, type Vehicle } from "@/data/mock";

type Ctx = {
  vehicles: Vehicle[];
  active: Vehicle;
  setActiveId: (id: string) => void;
  updateVehicle: (id: string, data: Partial<Vehicle>) => void;
  records: MaintenanceRecord[];
  addRecord: (r: Omit<MaintenanceRecord, "id">) => void;
  dark: boolean;
  toggleDark: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState(USER_VEHICLES);
  const [activeId, setActiveId] = useState(USER_VEHICLES[0]!.id);
  const [records, setRecords] = useState(RECORDS);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const active = vehicles.find((v) => v.id === activeId) ?? vehicles[0]!;

  const addRecord: Ctx["addRecord"] = (r) => {
    setRecords((prev) => [{ ...r, id: `m${Date.now()}` }, ...prev]);
    setVehicles((prev) => prev.map((v) => (v.id === r.vehicleId && r.km > v.odometer ? { ...v, odometer: r.km } : v)));
  };

  const updateVehicle: Ctx["updateVehicle"] = (id, data) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...data } : v)));
  };

  return (
    <AppCtx.Provider value={{ vehicles, active, setActiveId, updateVehicle, records, addRecord, dark, toggleDark: () => setDark((d) => !d) }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp outside AppProvider");
  return c;
}
