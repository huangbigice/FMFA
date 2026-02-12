import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { VirtualOrder, VirtualOrderSource } from '../api/types';

const STORAGE_KEY = 'fmfa_virtual_orders';

interface VirtualOrderContextType {
  orders: VirtualOrder[];
  addOrder: (params: {
    stockCode: string;
    side: 'buy' | 'sell';
    quantity: number;
    price: number;
    source: VirtualOrderSource;
    note?: string;
  }) => void;
}

const VirtualOrderContext = createContext<VirtualOrderContextType | undefined>(undefined);

function loadFromStorage(): VirtualOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as VirtualOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(orders: VirtualOrder[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

export function VirtualOrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<VirtualOrder[]>(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(orders);
  }, [orders]);

  const addOrder = useCallback(
    (params: {
      stockCode: string;
      side: 'buy' | 'sell';
      quantity: number;
      price: number;
      source: VirtualOrderSource;
      note?: string;
    }) => {
      const { stockCode, side, quantity, price, source, note } = params;
      const amount = quantity * price;
      const order: VirtualOrder = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        stockCode,
        side,
        quantity,
        price,
        amount,
        orderDate: new Date().toISOString(),
        source,
        note,
      };
      setOrders((prev) => [...prev, order]);
    },
    []
  );

  const value: VirtualOrderContextType = {
    orders,
    addOrder,
  };

  return (
    <VirtualOrderContext.Provider value={value}>
      {children}
    </VirtualOrderContext.Provider>
  );
}

export function useVirtualOrders() {
  const ctx = useContext(VirtualOrderContext);
  if (ctx === undefined) {
    throw new Error('useVirtualOrders 必須在 VirtualOrderProvider 內使用');
  }
  return ctx;
}
