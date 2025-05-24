module contracts::aggregator;

use sui::event;
use std::string::String;

// Event struct for logging
public struct LogEvent has copy, drop, store {
    message: vector<u8>,
}

public struct AggregatorStore has key, store {
    id: UID,
    aggregators: vector<WeightedAggregator>,
}

public struct WeightedAggregator has store, drop {
    id: String, 
    parameters: vector<Parameter>,
    fed_avg_weight: u128, // Scaled by 10^9
    fed_avg_bias: u128, // Scaled by 10^9
}

public struct Parameter has store, drop {
    address: address,
    weight: u128, // Scaled by 10^9
    bias: u128, // Scaled by 10^9
}

const SCALE_FACTOR: u128 = 1_000_000_000;

fun init(ctx: &mut TxContext) {
    let aggregator = AggregatorStore {
        id: object::new(ctx),
        aggregators: vector::empty(),
    };
    transfer::share_object(aggregator);
    emit_log_event(b"Initialized Aggregator");
}

fun find_aggregator_index(aggregator: &AggregatorStore, id: String): Option<u64> {
    let len = vector::length(&aggregator.aggregators);
    let mut i = 0;
    while (i < len) {
        let aggregator = vector::borrow(&aggregator.aggregators, i);
        if (aggregator.id == id) {
            return option::some(i)
        };
        i = i + 1;
    };
    option::none()
}

public fun create_aggregator(aggregator: &mut AggregatorStore, id: String) {
    vector::push_back(&mut aggregator.aggregators, WeightedAggregator {
        id,
        parameters: vector::empty(),
        fed_avg_weight: 0,
        fed_avg_bias: 0,
    });
}

public fun add_parameters(aggregator: &mut AggregatorStore, id: String, address: address, weight: u128, bias: u128) {
    let index_opt = find_aggregator_index(aggregator, id);
    if (option::is_none(&index_opt)) {
        abort 0
    };
    let index = *option::borrow(&index_opt);
    let aggregator = vector::borrow_mut(&mut aggregator.aggregators, index);
    vector::push_back(&mut aggregator.parameters, Parameter { address, weight, bias });
}

public fun aggregate_parameters(aggregator: &mut AggregatorStore, id: String) {
    let index_opt = find_aggregator_index(aggregator, id);
    if (option::is_none(&index_opt)) {
        abort 0
    };
    let index = *option::borrow(&index_opt);
    let aggregator = vector::borrow_mut(&mut aggregator.aggregators, index);

    let len = vector::length(&aggregator.parameters);
    if (len == 0) {
        abort 0
    };

    let mut total_weight: u128 = 0;
    let mut total_bias: u128 = 0;
    let mut i = 0;

    while (i < len) {
        let param = vector::borrow(&aggregator.parameters, i);
        total_weight = total_weight + param.weight;
        total_bias = total_bias + param.bias;
        i = i + 1;
    };

    aggregator.fed_avg_weight = total_weight / (len as u128);
    aggregator.fed_avg_bias = total_bias / (len as u128);
}

public fun delete_aggregator(aggregator: &mut AggregatorStore, id: String) {
    let mut index_opt = find_aggregator_index(aggregator, id);
    if (option::is_none(&index_opt)) {
        abort 0
    };
    vector::remove(&mut aggregator.aggregators, option::extract(&mut index_opt));
}

// Helper function to emit log events
fun emit_log_event(message: vector<u8>) {
    event::emit(LogEvent { message });
}
