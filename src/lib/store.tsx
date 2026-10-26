"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { RECORDS, USER_VEHICLES, type MaintenanceRecord, type Vehicle } from "@/data/mock";
import { getVehiculos, getRegistrosBitacora } from "@/services/bitacora.service";

type Ctx = {
  vehicles: Vehicle[];
  active: Vehicle;
  setActiveId: (id: string) => void;
  updateVehicle: (id: string, data: Partial<Vehicle>) => void;
  records: MaintenanceRecord[];
  addRecord: (r: Omit<MaintenanceRecord, "id">) => void;
  setAllRecords: (records: MaintenanceRecord[]) => void;
  dark: boolean;
  toggleDark: () => void;
  refreshData: () => Promise<void>;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(USER_VEHICLES);
  const [activeId, setActiveId] = useState<string>(USER_VEHICLES[0]!.id);
  const [records, setRecords] = useState<MaintenanceRecord[]>(RECORDS);
  const [dark, setDark] = useState(false);

  const syncFromBackend = async () => {
    try {
      const vList = await getVehiculos();
      if (vList && vList.length > 0) {
        setVehicles(vList);
        setActiveId((prev) => {
          const prevNorm = prev.replace(/^v/, "");
          const match = vList.find((v) => v.id === prev || v.id.replace(/^v/, "") === prevNorm);
          return match ? match.id : vList[0].id;
        });
      }
      const rList = await getRegistrosBitacora(vList);
      if (rList && rList.length > 0) {
        setRecords(rList);
      }
    } catch (err) {
      console.warn("[AppProvider] Error sincronizando con base de datos:", err);
    }
  };

  useEffect(() => {
    syncFromBackend();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const activeNorm = activeId.replace(/^v/, "");
  const active =
    vehicles.find((v) => v.id === activeId || v.id.replace(/^v/, "") === activeNorm) ??
    vehicles[0]!;

  const addRecord: Ctx["addRecord"] = (r) => {
    const newRecord: MaintenanceRecord = { ...r, id: `m${Date.now()}` };
    setRecords((prev) => [newRecord, ...prev]);
    const rVNorm = String(r.vehicleId).replace(/^v/, "");
    setVehicles((prev) =>
      prev.map((v) => {
        const vNorm = v.id.replace(/^v/, "");
        return (v.id === r.vehicleId || vNorm === rVNorm) && r.km > v.odometer
          ? { ...v, odometer: r.km }
          : v;
      })
    );
  };

  const updateVehicle: Ctx["updateVehicle"] = (id, data) => {
    const targetNorm = id.replace(/^v/, "");
    setVehicles((prev) =>
      prev.map((v) => {
        const vNorm = v.id.replace(/^v/, "");
        return v.id === id || vNorm === targetNorm ? { ...v, ...data } : v;
      })
    );
  };

  const setAllRecords = (newRecords: MaintenanceRecord[]) => {
    setRecords(newRecords);
  };

  return (
    <AppCtx.Provider
      value={{
        vehicles,
        active,
        setActiveId,
        updateVehicle,
        records,
        addRecord,
        setAllRecords,
        dark,
        toggleDark: () => setDark((d) => !d),
        refreshData: syncFromBackend,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp outside AppProvider");
  return c;
}
