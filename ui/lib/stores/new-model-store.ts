import { create } from "zustand";

interface NewModelStates {
  code: string;
  title: string;
  description: string;
  epochs: number;
  stakeAmount: number;
  onnxModel: File | null;
  onnxModelBlobId: string | null;

  setOnnxModel: (onnxModel: File | null) => void;
  setOnnxModelBlobId: (onnxModelBlobId: string | null) => void;
  setCode: (code: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setEpochs: (epochs: number) => void;
  setStakeAmount: (stakeAmount: number) => void;
}

export const useNewModelStore = create<NewModelStates>((set) => ({
  code: "",
  title: "",
  description: "",
  epochs: 0,
  stakeAmount: 0,
  onnxModel: null,
  onnxModelBlobId: null,

  setOnnxModel: (onnxModel) => set({ onnxModel }),
  setOnnxModelBlobId: (onnxModelBlobId) => set({ onnxModelBlobId }),
  setCode: (code) => set({ code }),
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setEpochs: (epochs) => set({ epochs }),
  setStakeAmount: (stakeAmount) => set({ stakeAmount }),
}));
