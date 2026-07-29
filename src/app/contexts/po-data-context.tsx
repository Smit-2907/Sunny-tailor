import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { PurchaseOrder } from "@/app/components/purchase-order/purchase-order-types";
import { EmployeeData } from "@/app/components/measurement-system/employee-excel-upload";
import * as api from "@/app/api/supabase-api";

// ── localStorage cache helpers ──
const STORAGE_KEYS = {
  purchaseOrders: "erp_purchase_orders",
  employeesByPO: "erp_employees_by_po",
};

function loadCache<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function writeCache<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
}

// ── Context type ──
interface PODataContextType {
  purchaseOrders: PurchaseOrder[];
  employeesByPO: Record<string, EmployeeData[]>;
  addPurchaseOrder: (po: PurchaseOrder) => void;
  updatePurchaseOrder: (po: PurchaseOrder) => void;
  deletePurchaseOrder: (poId: string) => void;
  setEmployeesForPO: (poId: string, employees: EmployeeData[]) => void;
  updateEmployee: (poId: string, updatedEmployee: EmployeeData) => void;
  deleteEmployee: (poId: string, serialNumber: string) => void;
  getEmployeesForPO: (poId: string) => EmployeeData[];
  isLoading: boolean;
  isSyncing: boolean;
}

const PODataContext = createContext<PODataContextType | null>(null);

export function usePOData() {
  const ctx = useContext(PODataContext);

  // If context is not available (e.g., in Figma preview mode), return fallback
  if (!ctx) {
    // Context unavailable (e.g. rendered outside provider) — return safe fallback silently
    return {
      purchaseOrders: [],
      employeesByPO: {},
      addPurchaseOrder: () => {},
      updatePurchaseOrder: () => {},
      deletePurchaseOrder: () => {},
      setEmployeesForPO: () => {},
      updateEmployee: () => {},
      deleteEmployee: () => {},
      getEmployeesForPO: () => [],
      isLoading: false,
      isSyncing: false,
    };
  }

  return ctx;
}

// ── Provider ──
export function PODataProvider({ children }: { children: ReactNode }) {
  // State initialised from localStorage cache for instant UI
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() =>
    loadCache<PurchaseOrder[]>(STORAGE_KEYS.purchaseOrders, [])
  );
  const [employeesByPO, setEmployeesByPO] = useState<Record<string, EmployeeData[]>>(() =>
    loadCache<Record<string, EmployeeData[]>>(STORAGE_KEYS.employeesByPO, {})
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const initialLoadDone = useRef(false);

  // ── Load from Supabase on mount ──
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;

    (async () => {
      try {
        setIsLoading(true);
        console.log("[POData] Loading from Supabase...");

        const remotePOs = await api.fetchPOs();

        if (remotePOs.length > 0) {
          // Supabase has data – use it as source of truth
          setPurchaseOrders(remotePOs as PurchaseOrder[]);
          writeCache(STORAGE_KEYS.purchaseOrders, remotePOs);

          // Load employees for each PO
          const empMap: Record<string, EmployeeData[]> = {};
          await Promise.all(
            remotePOs.map(async (po: any) => {
              try {
                const emps = await api.fetchEmployees(po.id);
                if (emps.length > 0) empMap[po.id] = emps as EmployeeData[];
              } catch (e) {
                console.log(`[POData] Failed to load employees for ${po.id}:`, e);
              }
            })
          );
          setEmployeesByPO(empMap);
          writeCache(STORAGE_KEYS.employeesByPO, empMap);
          console.log(`[POData] Loaded ${remotePOs.length} POs from Supabase`);
        } else {
          // Supabase is empty – push localStorage cache up
          const cachedPOs = loadCache<PurchaseOrder[]>(STORAGE_KEYS.purchaseOrders, []);
          const cachedEmps = loadCache<Record<string, EmployeeData[]>>(STORAGE_KEYS.employeesByPO, {});

          if (cachedPOs.length > 0) {
            console.log(`[POData] Supabase empty, uploading ${cachedPOs.length} cached POs...`);
            setIsSyncing(true);
            await api.bulkSync({ purchaseOrders: cachedPOs, employeesByPO: cachedEmps });
            setIsSyncing(false);
            console.log("[POData] Initial sync complete");
          }
        }
      } catch (e) {
        console.log("[POData] Server unavailable, using localStorage cache");
        // Keep localStorage data as fallback
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ── CRUD with optimistic updates ──

  const addPurchaseOrder = useCallback((po: PurchaseOrder) => {
    setPurchaseOrders((prev) => {
      const next = [po, ...prev];
      writeCache(STORAGE_KEYS.purchaseOrders, next);
      return next;
    });
    // Fire-and-forget to Supabase
    api.savePO(po).catch((e) => console.error("[POData] Failed to save PO to Supabase:", e));
  }, []);

  const updatePurchaseOrder = useCallback((updated: PurchaseOrder) => {
    setPurchaseOrders((prev) => {
      const next = prev.map((po) => (po.id === updated.id ? updated : po));
      writeCache(STORAGE_KEYS.purchaseOrders, next);
      return next;
    });
    api.savePO(updated).catch((e) => console.error("[POData] Failed to update PO in Supabase:", e));
  }, []);

  const deletePurchaseOrder = useCallback((poId: string) => {
    setPurchaseOrders((prev) => {
      const next = prev.filter((po) => po.id !== poId);
      writeCache(STORAGE_KEYS.purchaseOrders, next);
      return next;
    });
    setEmployeesByPO((prev) => {
      const next = { ...prev };
      delete next[poId];
      writeCache(STORAGE_KEYS.employeesByPO, next);
      return next;
    });
    api.deletePO(poId).catch((e) => console.error("[POData] Failed to delete PO from Supabase:", e));
  }, []);

  const setEmployeesForPO = useCallback((poId: string, employees: EmployeeData[]) => {
    setEmployeesByPO((prev) => {
      const next = { ...prev, [poId]: employees };
      writeCache(STORAGE_KEYS.employeesByPO, next);
      return next;
    });
    api.saveEmployees(poId, employees).catch((e) =>
      console.error("[POData] Failed to save employees to Supabase:", e)
    );
  }, []);

  const updateEmployee = useCallback((poId: string, updatedEmp: EmployeeData) => {
    setEmployeesByPO((prev) => {
      const updatedList = (prev[poId] || []).map((emp) =>
        emp.uniqueSerialNumber === updatedEmp.uniqueSerialNumber ? updatedEmp : emp
      );
      const next = { ...prev, [poId]: updatedList };
      writeCache(STORAGE_KEYS.employeesByPO, next);
      // Persist entire list to Supabase
      api.saveEmployees(poId, updatedList).catch((e) =>
        console.error("[POData] Failed to update employee in Supabase:", e)
      );
      return next;
    });
  }, []);

  const deleteEmployee = useCallback((poId: string, serialNumber: string) => {
    setEmployeesByPO((prev) => {
      const updatedList = (prev[poId] || []).filter(
        (emp) => emp.uniqueSerialNumber !== serialNumber
      );
      const next = { ...prev, [poId]: updatedList };
      writeCache(STORAGE_KEYS.employeesByPO, next);
      api.saveEmployees(poId, updatedList).catch((e) =>
        console.error("[POData] Failed to delete employee from Supabase:", e)
      );
      return next;
    });
  }, []);

  const getEmployeesForPO = useCallback(
    (poId: string) => employeesByPO[poId] || [],
    [employeesByPO]
  );

  return (
    <PODataContext.Provider
      value={{
        purchaseOrders,
        employeesByPO,
        addPurchaseOrder,
        updatePurchaseOrder,
        deletePurchaseOrder,
        setEmployeesForPO,
        updateEmployee,
        deleteEmployee,
        getEmployeesForPO,
        isLoading,
        isSyncing,
      }}
    >
      {children}
    </PODataContext.Provider>
  );
}
