import React, { useState } from "react";
import { useStepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { ChevronsRight, Loader2 } from "lucide-react";
import { useNewModelStore } from "@/lib/stores/new-model-store";
import { FileUpload } from "@/components/ui/file-upload";
import { uploadOnnxModel } from "@/lib/walrus";
import { toast } from "sonner";

const UploadCode = () => {
  const { nextStep } = useStepper();
  const { onnxModel, setOnnxModel, setOnnxModelBlobId } = useNewModelStore();
  const [loading, setLoading] = useState(false);

  const uploadOnnxModelHandler = async () => {
    if (!onnxModel) return;
    setLoading(true);
    const res = await uploadOnnxModel(onnxModel);
    setOnnxModelBlobId(res);
    toast.success("Model uploaded successfully to Walrus");
    setLoading(false);
    nextStep();
  };

  return (
    <div className="flex flex-col">
      <FileUpload
        onChange={(file) => {
          setOnnxModel(file[0]);
        }}
        defaultFile={onnxModel}
      />

      <div className="flex flex-row px-1">
        <div className="flex-1" />
        <Button
          onClick={uploadOnnxModelHandler}
          className="flex items-center"
          disabled={!onnxModel || loading}
        >
          Next{" "}
          {loading ? (
            <Loader2 className="ml-1 animate-spin" size={16} />
          ) : (
            <>
              <ChevronsRight className="ml-1" size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default UploadCode;
