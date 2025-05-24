"use client";

import PublisherKanbanBoard from "@/components/kanban-board";
import NewModelTrigger from "@/components/new-model-trigger";
import { Button } from "@/components/ui/button";
import { PlusIcon, RefreshCcwIcon } from "lucide-react";
import { useSuiModelStore } from "@/lib/hooks/use-sui-model-store";

const Publisher = () => {
  const { fetchModels } = useSuiModelStore();
  return (
    <>
      <div className="space-y-2">
        <h1 className="text-4xl font-display ">Greetings, fellow human 👋</h1>
        <p className="text-lg text-muted-foreground">
          Publish and share your models seamlessly here :)
        </p>
        <div className="relative flex flex-row items-end justify-between space-y-2 pb-4 bg-gradient-to-l underline-theme">
          <h1 className="text-2xl font-medium">Your Models</h1>
          <div className="flex flex-row gap-2">
            <Button
              variant={"outline"}
              size={'icon'}
              onClick={() => {
                fetchModels();
              }}
            >
              <RefreshCcwIcon size={16} />
            </Button>
            <NewModelTrigger>
              <Button
                className="bg-highlight hover:bg-highlighti hover:brightness-90"
                variant={"expandIcon"}
                iconPlacement="right"
                Icon={<PlusIcon size={16} />}
              >
                New Model
              </Button>
            </NewModelTrigger>
          </div>
        </div>
        <PublisherKanbanBoard />
      </div>
    </>
  );
};

export default Publisher;
