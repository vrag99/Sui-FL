import axios from "axios";

const AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";
const PUBLISHER = "https://publisher.walrus-testnet.walrus.space";

export async function uploadBlob(json: string) {
  try {
    const url = `${PUBLISHER}/v1/blobs?epochs=5`;
    const response = await axios({
      method: "PUT",
      url: url,
      data: json,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    const jsonResponse = response.data;
    console.log(jsonResponse);
    if (jsonResponse.alreadyCertified) {
      return jsonResponse.alreadyCertified.blobId;
    }
    return jsonResponse.newlyCreated.blobObject.blobId;
  } catch (error) {
    console.error(`Error uploading blob: ${error.message}`);
    throw error;
  }
}

export async function getBlob(blobId: string) {
  try {
    const url = `${AGGREGATOR}/v1/blobs/${blobId}`;
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "arraybuffer",
    });
    const dataBuffer = JSON.parse(Buffer.from(response.data).toString("utf-8"));
    return dataBuffer;
  } catch (error) {
    console.error(`Error downloading blob: ${error.message}`);
    throw error;
  }
}

export async function uploadOnnxModel(onnxModel: File) {
  try {
    const url = `${PUBLISHER}/v1/blobs?epochs=5`;
    const response = await axios({
      method: "PUT", 
      url: url,
      data: await onnxModel.arrayBuffer(),
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    const jsonResponse = response.data;
    if (jsonResponse.alreadyCertified) {
      return jsonResponse.alreadyCertified.blobId;
    }
    return jsonResponse.newlyCreated.blobObject.blobId;
  } catch (error) {
    console.error(`Error uploading model: ${error.message}`);
    throw error;
  }
}

export async function getOnnxModel(blobId: string) {
  try {
    const url = `${AGGREGATOR}/v1/blobs/${blobId}`;
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "arraybuffer",
    });
    console.log("getting onnx model", response.data);
    const dataBuffer = response.data;
    return dataBuffer;
  } catch (error) {
    console.error(`Error downloading blob: ${error.message}`);
    throw error;
  }
}
