import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStepper } from "@/components/ui/stepper";
import { Textarea } from "@/components/ui/textarea";
import { useNewModelStore } from "@/lib/stores/new-model-store";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react";
import React from "react";
import { generateRandomID } from "@/lib/utils";
import { useSuiModelStore } from "@/lib/hooks/use-sui-model-store";

interface ModelDetailProps {
  hasCompletedAllSteps: boolean;
  setHasCompletedAllSteps: (hasCompletedSteps: boolean) => void;
}

const ModelDetails = (props: ModelDetailProps) => {
  const { setHasCompletedAllSteps } = props;
  const { nextStep, prevStep } = useStepper();
  const {
    title,
    description,
    epochs,
    stakeAmount,
    onnxModelBlobId,
    setTitle,
    setDescription,
    setEpochs,
    setStakeAmount,
  } = useNewModelStore();
  const { createModel, loading } = useSuiModelStore();
  const currentAccount = useCurrentAccount();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await createModel({
      id: generateRandomID(),
      title,
      description,
      creatorAddress: currentAccount?.address || "",
      epochs,
      stakeAmount,
      status: "draft",
      createdAt: new Date(),
      onnxModelBlobId: onnxModelBlobId || "",
    });
    if (result) {
      setHasCompletedAllSteps(true);
    }
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter model title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required
              placeholder="Enter model description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="epochs">Epochs</Label>
            <Input
              id="epochs"
              type="number"
              required
              placeholder="Enter number of epochs"
              min={1}
              value={epochs}
              onChange={(e) => setEpochs(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stakeAmount">Stake Amount (SUI)</Label>
            <Input
              id="stakeAmount"
              type="number"
              required
              placeholder="Enter stake amount (SUI Tokens)"
              min={0}
              step={0.01}
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex">
        <div className="flex-1"></div>
        <div className="flex flex-row items-center gap-2">
          <Button
            className="w-24 !h-10"
            variant={"ghost"}
            onClick={() => {
              prevStep();
            }}
          >
            <ChevronsLeft className="mr-1" size={16} /> Back
          </Button>
          <Button className="w-24 h-10" type="submit" disabled={loading}>
            <>
              Next{" "}
              {loading ? (
                <Loader2 className="ml-1 animate-spin" size={16} />
              ) : (
                <ChevronsRight className="ml-1" size={16} />
              )}
            </>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ModelDetails;
