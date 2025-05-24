"use client";

import {
  useSignAndExecuteTransaction,
  useSuiClientContext,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { MODEL_STORE_ADDRESS, PACKAGE_ID } from "../constants";
import { useState } from "react";
import { getBlob, uploadBlob } from "../walrus";
import { PublisherModel } from "../types";
import { Transaction } from "@mysten/sui/transactions";
import { useModelStore } from "../stores/model-store";

export const useSuiModelStore = () => {
  const { client } = useSuiClientContext();
  const packageId = PACKAGE_ID;
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const {
    models: storedModels,
    addModel,
    resetModels,
    setMyModels,
    setAvailableModels,
  } = useModelStore();
  const currentAccount = useCurrentAccount();

  const createModel = async (model: PublisherModel) => {
    setLoading(true);
    const blobId = await uploadBlob(
      JSON.stringify({
        title: model.title,
        description: model.description,
        creatorAddress: model.creatorAddress,
        epochs: model.epochs,
        stakeAmount: model.stakeAmount,
        createdAt: model.createdAt,
        onnxModelBlobId: model.onnxModelBlobId,
      })
    );

    const tx = new Transaction();
    tx.moveCall({
      arguments: [
        tx.object(MODEL_STORE_ADDRESS),
        tx.pure.string(model.id),
        tx.pure.string(model.status),
        tx.pure.string(blobId),
      ],
      target: `${packageId}::store::create_model`,
    });

    const result = await signAndExecute({
      transaction: tx,
      chain: "sui:testnet",
    });

    setLoading(false);
    return result;
  };

  const fetchModels = async () => {
    setLoading(true);
    resetModels();
    const res = await client.getObject({
      id: MODEL_STORE_ADDRESS,
      options: {
        showContent: true,
      },
    });
    const modelData = res.data?.content as any;
    if (modelData) {
      const models = modelData.fields.models;
      for (const model of models) {
        const { id, blobId, status } = model.fields;
        const modelMetadata = await getBlob(blobId);
        if (modelMetadata) {
          const model: PublisherModel = {
            id,
            status,
            ...modelMetadata,
          };
          addModel(model);
        }
      }
    }
    setMyModels(currentAccount?.address ?? "");
    setAvailableModels();
    setLoading(false);
  };

  const publishModel = async (modelId: string) => {
    setPublishing(true);
    const tx = new Transaction();
    tx.moveCall({
      arguments: [
        tx.object(MODEL_STORE_ADDRESS),
        tx.pure.string(modelId),
        tx.pure.string("waitingForClients"),
      ],
      target: `${packageId}::store::update_model_status`,
    });

    const result = await signAndExecute({
      transaction: tx,
      chain: "sui:testnet",
    });

    setPublishing(false);
    return result;
  };

  return {
    createModel,
    fetchModels,
    loading,
    publishModel,
    publishing,
  };
};
