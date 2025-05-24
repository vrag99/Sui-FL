export type PublisherModelStatus = "draft" | "waitingForClients" | "trained";

export type PublisherModel = {
  id: string;
  creatorAddress: string;
  title: string;
  description: string;
  status: PublisherModelStatus;
  epochs: number;
  createdAt: Date;
  stakeAmount: number;
  onnxModelBlobId: string;
};

export type TrainerModel = Omit<PublisherModel, "status"> & {
  status: "available" | "training" | "completed";
};

export type WeightedAggregator = {
  id: string;
  parameters: Parameter[];
  fedAvgWeight: number;
  fedAvgBias: number;
};

export type Parameter = {
  address: string;
  weight: number;
  bias: number;
};