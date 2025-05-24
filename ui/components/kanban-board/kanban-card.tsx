"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PublisherModel } from "@/lib/types";
import DropIndicator from "./drop-indicator";
import { CircleFadingArrowUp, Pencil, RotateCw, Trash } from "lucide-react";
import { useAggregatorStore } from "@/lib/stores/aggregator-store";
import { useSuiAggregator } from "@/lib/hooks/use-sui-aggregator";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { shortenAddress } from "@polymedia/suitcase-core";
import { SCALE_FACTOR } from "@/lib/constants";
import { Button } from "../ui/button";

interface CardProps extends PublisherModel {
  column: "draft" | "published" | "trained";
  handleDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    model: PublisherModel
  ) => void;
  className?: string;
}

const KanbanCard: React.FC<CardProps> = ({
  id,
  title,
  description,
  status,
  epochs,
  stakeAmount,
  createdAt,
  column,
  handleDragStart,
  className,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable={column === "draft"}
        onDragStart={(e) =>
          handleDragStart(e, {
            id,
            title,
            description,
            status,
            epochs,
            createdAt,
            stakeAmount,
          })
        }
        onMouseEnter={() => setFocused(true)}
        onMouseLeave={() => setFocused(false)}
        className={`rounded-t bg-accent/50 p-3 border-b transition-all duration-200 hover:bg-accent/70 ${
          column === "draft" ? "cursor-grab active:cursor-grabbing" : ""
        } ${className}`}
      >
        <p
          className="text-lg font-semibold text-card-foreground line-clamp-1"
          title={title}
        >
          {title}
        </p>
        <p
          className="text-sm font-medium text-muted-foreground mt-1 line-clamp-2"
          title={description}
        >
          {description}
        </p>
        <div className="flex flex-col lg:flex-row gap-2 my-2 text-sm *:rounded">
          <div className="flex items-center justify-between flex-1 p-2 bg-card">
            <p className="font-medium">Epochs</p>
            <p className="bg-accent text-accent-foreground px-2 rounded font-bold text-xs py-1">
              {epochs}
            </p>
          </div>
          <div className="flex items-center justify-between flex-1 p-2 bg-card">
            <p className="font-medium">Stake</p>
            <p className="bg-accent text-primary px-2 rounded font-bold inline-flex text-xs py-1">
              {stakeAmount?.toFixed(3) || 0} SUI
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs font-medium text-muted-foreground">
            {new Date(createdAt).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
          {column === "draft" && <Actions visible={focused} />}
          {column === "published" && status === "waitingForClients" && (
            <WaitingForClients focused={focused} id={id} />
          )}
          {column === "trained" && status === "trained" && (
            <ShowParams id={id} />
          )}
        </div>
      </motion.div>
    </>
  );
};

const Actions = ({ visible = true }: { visible: boolean }) => {
  return (
    <div
      className={`flex items-center justify-between gap-2 transition-all duration-200 *:grid *:place-items-center ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        title="edit"
        className="text-muted-foreground cursor-default hover:text-foreground"
      >
        <Pencil size={14} />
      </button>
      <button
        title="delete"
        className="text-muted-foreground cursor-default hover:text-foreground"
      >
        <Trash size={14} />
      </button>
    </div>
  );
};

const WaitingForClients = ({
  focused,
  id,
}: {
  focused: boolean;
  id: string;
}) => {
  const [showButton, setShowButton] = useState(focused);
  const [buttonOpacity, setButtonOpacity] = useState(focused ? 1 : 0);
  const { fetchAggregators } = useSuiAggregator();
  const { aggregators } = useAggregatorStore();
  const clients =
    aggregators.find((aggregator) => aggregator.id === id)?.parameters.length ||
    0;

  useEffect(() => {
    if (focused) {
      setShowButton(true);
      setTimeout(() => setButtonOpacity(1), 50);
    } else {
      setButtonOpacity(0);
      setTimeout(() => setShowButton(false), 300);
    }
  }, [focused]);

  return (
    <div className="flex flex-row gap-2 items-center transition-all duration-300">
      <div
        className={`flex flex-row items-center gap-2 transition-all duration-300 ease-out`}
      >
        <div className="w-3 h-3 bg-highlight animate-pulse rounded-full"></div>
        <p className="text-xs text-muted-foreground font-medium">
          Waiting for clients{" "}
          <span className="text-highlight font-bold text-xs">({clients})</span>
        </p>
      </div>
      <div
        className={`overflow-hidden grid grid-cols-2 place-items-center transition-all duration-300 ease-out ${
          focused ? "w-12 opacity-100" : "w-0 opacity-0"
        }`}
      >
        <button
          title="refresh clients"
          className="transition-all duration-300 hover:text-primary"
          onClick={() => {
            fetchAggregators();
            console.log(aggregators);
            toast.success("Clients refreshed");
          }}
          style={{
            transform: `translateX(${buttonOpacity === 0 ? "10px" : "0"})`,
          }}
        >
          <RotateCw size={16} />
        </button>
        <AggregateParametersDialog id={id}>
          <button
            title="aggregate parameters"
            disabled={clients === 0}
            className={`transition-all duration-300 enabled:hover:text-primary disabled:cursor-not-allowed disabled:opacity-50`}
            style={{
              transform: `translateX(${buttonOpacity === 0 ? "10px" : "0"})`,
            }}
          >
            <CircleFadingArrowUp size={18} />
          </button>
        </AggregateParametersDialog>
      </div>
    </div>
  );
};

const AggregateParametersDialog = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) => {
  const { aggregators } = useAggregatorStore();
  const aggregator = aggregators.find((aggregator) => aggregator.id === id);
  const { aggregateParameters, fetchAggregators } = useSuiAggregator();
  const [isAggregated, setIsAggregated] = useState(false);
  const [fetchingAggregatedParams, setFetchingAggregatedParams] =
    useState(false);
  const handleAggregate = async () => {
    await aggregateParameters(id);
    toast.success("Parameters aggregated");
    setIsAggregated(true);
    setFetchingAggregatedParams(true);
    await fetchAggregators();
    setFetchingAggregatedParams(false);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aggregate Parameters</DialogTitle>
          <DialogDescription>
            Aggregate the parameters from all participating clients.
          </DialogDescription>
        </DialogHeader>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {aggregator?.parameters.length} clients
          </p>
          <div className="space-y-4">
            {aggregator?.parameters.map((parameter, index) => (
              <div
                key={index}
                className="flex flex-row gap-2 w-full items-center justify-between px-2 py-2 bg-card border-b rounded-md"
              >
                <p className="font-mono text-sm">
                  {shortenAddress(parameter.address)}
                </p>
                <Button variant="outline" size={"sm"}>
                  Slash Stake
                </Button>
              </div>
            ))}
          </div>
          <Button
            className="w-full mt-4"
            onClick={handleAggregate}
            disabled={isAggregated || fetchingAggregatedParams}
          >
            {fetchingAggregatedParams ? "Aggregating..." : "Aggregate"}
          </Button>
          {isAggregated && (
            <div className="flex flex-col gap-2 bg-card p-2 rounded-md">
              <p className="text-sm font-medium text-muted-foreground">
                Aggregated Parameters
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Weight:{" "}
                  {aggregator?.fedAvgWeight
                    ? aggregator.fedAvgWeight / SCALE_FACTOR
                    : 0}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  Bias:{" "}
                  {aggregator?.fedAvgBias
                    ? aggregator.fedAvgBias / SCALE_FACTOR
                    : 0}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ShowParams = ({ id }: { id: string }) => {
  const { aggregators } = useAggregatorStore();
  const aggregator = aggregators.find((aggregator) => aggregator.id === id);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-muted-foreground hover:text-foreground">
          <CircleFadingArrowUp size={14} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Model Parameters</DialogTitle>
          <DialogDescription>
            The aggregated parameters for this trained model.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 bg-card p-2 rounded-md">
          <p className="text-sm font-medium text-muted-foreground">
            Weight:{" "}
            {aggregator?.fedAvgWeight ? aggregator.fedAvgWeight / SCALE_FACTOR : 0}
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            Bias:{" "}
            {aggregator?.fedAvgBias ? aggregator.fedAvgBias / SCALE_FACTOR : 0}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KanbanCard;
