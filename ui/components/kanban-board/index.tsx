"use client";

import React, { useEffect, useState } from "react";
import Column from "./column";
import { useModelStore } from "@/lib/stores/model-store";
import { useSuiModelStore } from "@/lib/hooks/use-sui-model-store";
import { Loader2 } from "lucide-react";
import { useSuiAggregator } from "@/lib/hooks/use-sui-aggregator";
import { useAggregatorStore } from "@/lib/stores/aggregator-store";

export const PublisherKanbanBoard: React.FC = () => {
  const { myModels: models, setModels } = useModelStore();
  const { fetchModels, loading } = useSuiModelStore();
  const { fetchAggregators } = useSuiAggregator();
  useEffect(() => {
    fetchModels();
    fetchAggregators();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-20">
        <Loader2 className="animate-spin text-highlight" />
      </div>
    );
  } else if (!models) {
    return (
      <div className="flex justify-center items-center h-20">
        <p className="text-muted-foreground font-medium uppercase">
          Create your first model :)
        </p>
      </div>
    );
  } else {
    return (
      <div className="flex h-full w-full gap-3 py-6">
        <Column
          title="Drafts"
          column="draft"
          headingColor="text-muted-foreground"
          models={models}
          setModels={setModels}
        />
        <Column
          title="Published"
          column="published"
          headingColor="text-highlight"
          models={models}
          setModels={setModels}
        />
        <Column
          title="Trained"
          column="trained"
          headingColor="text-primary"
          models={models}
          setModels={setModels}
        />
      </div>
    );
  }
};
export default PublisherKanbanBoard;
