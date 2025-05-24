import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClientContext,
} from "@mysten/dapp-kit";
import {
  AGGREGATOR_ADDRESS,
  MODEL_STORE_ADDRESS,
  PACKAGE_ID,
} from "../constants";
import { Transaction } from "@mysten/sui/transactions";
import { useAggregatorStore } from "../stores/aggregator-store";
import { Parameter } from "../types";

export const useSuiAggregator = () => {
  const { client } = useSuiClientContext();
  const packageId = PACKAGE_ID;
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  const { addAggregator, resetAggregators } = useAggregatorStore();

  const createAggregator = async (modelId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      arguments: [tx.object(AGGREGATOR_ADDRESS), tx.pure.string(modelId)],
      target: `${packageId}::aggregator::create_aggregator`,
    });

    const result = await signAndExecute({
      transaction: tx,
      chain: "sui:testnet",
    });

    return result;
  };

  const fetchAggregators = async () => {
    resetAggregators();
    const res = await client.getObject({
      id: AGGREGATOR_ADDRESS,
      options: {
        showContent: true,
      },
    });
    const aggregatorData = res.data?.content as any;
    const aggregators = aggregatorData.fields;
    for (const aggregator of aggregators.aggregators) {
      const { id, parameters, fed_avg_bias, fed_avg_weight } =
        aggregator.fields;
      const params: Parameter[] = parameters.map((p: any) => ({
        address: p.fields.address,
        weight: p.fields.weight,
        bias: p.fields.bias,
      }));
      addAggregator({
        id,
        parameters: params,
        fedAvgBias: fed_avg_bias,
        fedAvgWeight: fed_avg_weight,
      });
    }
  };

  const addParameters = async (
    modelId: string,
    weight: number,
    bias: number
  ) => {
    if (!currentAccount?.address) return;
    const tx = new Transaction();
    tx.moveCall({
      arguments: [
        tx.object(AGGREGATOR_ADDRESS),
        tx.pure.string(modelId),
        tx.pure.address(currentAccount?.address),
        tx.pure.u128(weight),
        tx.pure.u128(bias),
      ],
      target: `${packageId}::aggregator::add_parameters`,
    });

    const result = await signAndExecute({
      transaction: tx,
      chain: "sui:testnet",
    });
    return result;
  };

  const aggregateParameters = async (modelId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      arguments: [tx.object(AGGREGATOR_ADDRESS), tx.pure.string(modelId)],
      target: `${packageId}::aggregator::aggregate_parameters`,
    });
    tx.moveCall({
      arguments: [
        tx.object(MODEL_STORE_ADDRESS),
        tx.pure.string(modelId),
        tx.pure.string("trained"),
      ],
      target: `${packageId}::store::update_model_status`,
    });
    const result = await signAndExecute({
      transaction: tx,
      chain: "sui:testnet",
    });

    return result;
  };

  return {
    createAggregator,
    fetchAggregators,
    addParameters,
    aggregateParameters,
  };
};
