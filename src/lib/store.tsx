import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  createSeedState,
  isProcurementState,
  normalizeState,
  STORAGE_KEY,
  type DomainResult,
  type FocusTarget,
  type ProcurementState,
} from "@/lib/domain";

type Action = { type: "replace"; state: ProcurementState };

function reducer(_state: ProcurementState, action: Action) {
  return action.state;
}

type ProcurementContextValue = {
  state: ProcurementState;
  commit: (result: DomainResult, success: string) => boolean;
  replace: (state: ProcurementState) => void;
  focus: FocusTarget | null;
  setFocus: (focus: FocusTarget | null) => void;
};

const ProcurementContext = createContext<ProcurementContextValue | null>(null);

export function ProcurementProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createSeedState);
  const [ready, setReady] = useState(false);
  const [focus, setFocus] = useState<FocusTarget | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isProcurementState(parsed)) dispatch({ type: "replace", state: normalizeState(parsed) });
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const replace = (next: ProcurementState) => dispatch({ type: "replace", state: next });

  const commit = (result: DomainResult, success: string) => {
    if (!result.ok) {
      toast.error(result.error);
      return false;
    }
    replace(result.state);
    toast.success(success);
    return true;
  };

  return <ProcurementContext.Provider value={{ state, commit, replace, focus, setFocus }}>{children}</ProcurementContext.Provider>;
}

export function useProcurement() {
  const value = useContext(ProcurementContext);
  if (!value) throw new Error("useProcurement must be used within ProcurementProvider");
  return value;
}
