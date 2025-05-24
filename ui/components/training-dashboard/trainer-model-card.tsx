"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Download, Loader2, Rocket } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PublisherModel } from "@/lib/types";
import Papa from "papaparse";
import { toast } from "sonner";
import { getOnnxModel } from "@/lib/walrus";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useSuiAggregator } from "@/lib/hooks/use-sui-aggregator";
import { SCALE_FACTOR } from "@/lib/constants";

const TrainerModelCard = (props: PublisherModel) => {
  const [focused, setFocused] = useState(false);
  // reward calc
  const suiToUsd = 3.6;
  const rewardInSUI = props.epochs * 0.25;
  const rewardInDollars = rewardInSUI * suiToUsd;
  const formattedRewardInUSD = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(rewardInDollars));

  const truncatedWallet =
    props.creatorAddress.slice(0, 6) + "..." + props.creatorAddress.slice(-6);

  return (
    <div
      className="rounded-t bg-accent/50 p-3 border-b transition-all duration-200 hover:bg-accent/70"
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
    >
      <div className="flex flex-row gap-2">
        <div className="flex-1">
          <p
            className="text-lg font-semibold text-card-foreground line-clamp-2"
            title={props.title}
          >
            {props.title}
          </p>
          <p
            className="text-sm font-medium text-muted-foreground mt-1 line-clamp-2"
            title={props.description}
          >
            {props.description}
          </p>
        </div>
        <div className="w-36 bg-card rounded-md flex flex-col p-3 border-t justify-between">
          <p className="text-xs text-muted-foreground font-medium mb-2">
            Reward
          </p>
          <div>
            <p className="text-3xl font-bold text-primary">
              {formattedRewardInUSD}
            </p>
            <p className="text-xs font-bold text-muted-foreground">
              {rewardInSUI.toFixed(3)} SUI
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-2 mt-4 text-sm *:rounded">
        <div className="flex items-center justify-between flex-1 p-2 bg-card">
          <p className="font-medium">Epochs</p>
          <p className="bg-accent text-accent-foreground px-2 rounded font-bold text-xs py-1">
            {props.epochs}
          </p>
        </div>
        <div className="flex items-center justify-between flex-1 p-2 bg-card">
          <p className="font-medium">Stake</p>
          <p className="bg-accent text-highlight px-2 rounded font-bold inline-flex text-xs py-1">
            {props.stakeAmount.toFixed(3)} SUI
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs font-medium text-muted-foreground">
          {new Date(props.createdAt).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}{" "}
          | <span className="text-foreground"> {truncatedWallet} </span>
        </span>
        {props.status === "waitingForClients" && (
          <StartTrainingButton visible={focused} model={props} />
        )}
        {props.status === "trained" && <CompletedIndicator />}
      </div>
    </div>
  );
};

const StartTrainingButton = ({
  visible,
  model,
}: {
  visible: boolean;
  model: PublisherModel;
}) => {
  const [dataSet, setDataSet] = useState<File | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { addParameters } = useSuiAggregator();
  const [updatedWeight, setUpdatedWeight] = useState(0);
  const [updatedBias, setUpdatedBias] = useState(0);

  const verifyDataset = async () => {
    if (dataSet) {
      Papa.parse(dataSet, {
        header: false,
        complete: (results) => {
          const firstRow = results.data[0];
          toast.success("Dataset verified");
          setIsValid(Array.isArray(firstRow) && firstRow.length === 2);
        },
      });
    }
  };

  const downloadModel = async () => {
    if (!dataSet) return;
    setDownloading(true);
    const onnxModel = await getOnnxModel(model.onnxModelBlobId);
    const parsedOnnxModel = Buffer.from(onnxModel);
    const modelBlob = new Blob([parsedOnnxModel], {
      type: "application/octet-stream",
    });
    const staticFileNames = ["readme.txt", "requirements.txt", "train.py"];
    const zip = new JSZip();
    for (const fileName of staticFileNames) {
      const res = await fetch(`/${fileName}`);
      const fileBlob = await res.blob();
      zip.file(fileName, fileBlob);
    }
    zip.file("model.onnx", modelBlob);
    zip.file("data.csv", dataSet);
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${model.title.toLowerCase().split(" ").join("_")}.zip`);
    setDownloading(false);
  };



  return (
    <Dialog>
      <DialogTrigger>
        <button
          className={`inline-flex gap-1 bg-primary text-primary-foreground rounded py-1 px-2 font-medium text-xs transition-all duration-200 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          Start Training <Rocket size={16} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-normal tracking-normal">
            Stake to Continue
          </DialogTitle>
          <DialogDescription>
            Stake {model.stakeAmount.toFixed(3)} SUI to start training this
            model. This stake will be refunded after training is complete.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col lg:flex-row gap-2 my-2 text-sm *:rounded-lg">
          <div className="flex items-center justify-between flex-1 p-2 bg-card border-b">
            <p className="font-medium">Epochs</p>
            <p className="bg-accent text-accent-foreground px-2 rounded font-bold text-xs py-1">
              {model.epochs}
            </p>
          </div>

          <div className="flex items-center justify-between flex-1 p-2 bg-card border-b">
            <p className="font-medium">Stake</p>
            <p className="bg-accent text-primary px-2 rounded font-bold inline-flex text-xs py-1">
              {model.stakeAmount.toFixed(3)} SUI
            </p>
          </div>
        </div>
        <div>
          <Label>Upload Dataset (for training the model)</Label>
          <Input
            type="file"
            accept=".csv"
            onChange={(e) =>
              setDataSet(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>
        {isValid && (
          <>
            <div className="bg-card rounded-lg p-2 text-muted-foreground space-y-2">
              <p className="inline-flex items-center gap-1 text-foreground font-medium">
                Dataset Verified <Check size={16} />
              </p>
              <p>
                Now download the model zip file and give out the updated params
                on your dataset.
              </p>
              <Button
                variant={"outline"}
                className="gap-2 w-full"
                onClick={downloadModel}
                disabled={downloading}
              >
                {downloading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                Download Model
              </Button>

              <div className="flex flex-col md:flex-row gap-2 mt-2 *:flex-1">
                <div>
                  <Label>Updated Weight</Label>
                  <Input
                    type="number"
                    value={updatedWeight}
                    onChange={(e) => setUpdatedWeight(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Updated Bias</Label>
                  <Input
                    type="number"
                    value={updatedBias}
                    onChange={(e) => setUpdatedBias(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </>
        )}
        <Button
          disabled={
            !dataSet ||
            (dataSet && isValid && (updatedWeight === 0 || updatedBias === 0))
          }
          onClick={!isValid ? verifyDataset : async () => {
            await addParameters(model.id, updatedWeight * SCALE_FACTOR, updatedBias * SCALE_FACTOR);
            toast.success("Parameters added");
            setUpdatedWeight(0);
            setUpdatedBias(0);
            setDataSet(null);
            setIsValid(false);
          }}
        >
          {isValid ? "Stake & Upload Parameters" : "Verify Dataset"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};


const CompletedIndicator = () => {
  return (
    <div
      className={`flex items-center gap-1 transition-all duration-300 ease-out text-primary`}
    >
      <Check size={16} />
      <p className="text-xs font-medium">Completed</p>
    </div>
  );
};

export default TrainerModelCard;
