"use client";

import { TrainerModel } from "@/lib/types";
import TrainerModelCard from "./trainer-model-card";
import { useModelStore } from "@/lib/stores/model-store";

const TrainerModelView = ({ status }: { status: TrainerModel["status"] }) => {
  const { availableModels } = useModelStore();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3  gap-4">
      {availableModels.map((model) => (
        <TrainerModelCard key={model.id} {...model} />
      ))}
    </div>
  );
};

export default TrainerModelView;
