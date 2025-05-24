import { create } from "zustand";

import { WeightedAggregator } from "../types";

interface AggregatorStore {
  aggregators: WeightedAggregator[];
  addAggregator: (aggregator: WeightedAggregator) => void;
  setAggregators: (aggregators: WeightedAggregator[]) => void;
  resetAggregators: () => void;
}

export const useAggregatorStore = create<AggregatorStore>((set) => ({
  aggregators: [],
  addAggregator: (aggregator) => set((state) => ({ aggregators: [...state.aggregators, aggregator] })),
  setAggregators: (aggregators) => set({ aggregators }),
  resetAggregators: () => set({ aggregators: [] }),
}));