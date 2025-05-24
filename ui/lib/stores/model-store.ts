import { create } from "zustand";
import { PublisherModel } from "../types";

interface ModelStore {
  models: PublisherModel[];
  myModels: PublisherModel[];
  availableModels: PublisherModel[];
  addModel: (model: PublisherModel) => void;
  setModels: (models: PublisherModel[]) => void;
  setMyModels: (currentAddress: string) => void;
  setAvailableModels: () => void;
  resetModels: () => void;
}

export const useModelStore = create<ModelStore>((set) => ({
  models: [],
  myModels: [],
  availableModels: [],
  addModel: (model: PublisherModel) =>
    set((state) => ({ models: [...state.models, model] })),
  setModels: (models: PublisherModel[]) => set({ models }),
  setMyModels: (currentAddress: string) =>
    set((state) => ({
      myModels: state.models.filter(
        (model) => model.creatorAddress === currentAddress
      ),
    })),
  setAvailableModels: () =>
    set((state) => ({
      availableModels: state.models.filter(
        (model) => model.status === "waitingForClients"
      ),
    })),
  resetModels: () => set({ models: [], myModels: [] }),
}));
