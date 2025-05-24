/// Module: weighted_aggregator
module contracts::aggregator;

use sui::event;

// Event struct for logging
public struct LogEvent has copy, drop, store {
    message: vector<u8>,
}

// Main aggregator struct
public struct WeightedAggregator has key, store {
    id: UID,
    numbers: vector<NumberWeight>, // (number, weight) pairs
    total_sum: u128,              // Using u128 for fixed-point arithmetic
    total_weight: u128,           // Using u128 for fixed-point arithmetic
}

// Struct to hold number and weight pair
public struct NumberWeight has copy, drop, store {
    number: u128, // Fixed-point representation (scaled by 10^9)
    weight: u128, // Fixed-point representation (scaled by 10^9)
}

// Constants
const SCALE_FACTOR: u128 = 1_000_000_000; // 10^9 for fixed-point precision

// Initialize the aggregator
public fun create_weights(ctx: &mut TxContext) {
    let aggregator = WeightedAggregator {
        id: object::new(ctx),
        numbers: vector::empty(),
        total_sum: 0,
        total_weight: 1,
    };
    // move_to(account, aggregator);
    // emit_log_event(b"Initialized WeightedAggregator");
    transfer::public_transfer(aggregator, ctx.sender());
}

// Add a new number with its weight
public fun add(number: u64, weight: u64, weighted_aggregator: &mut WeightedAggregator) {
    let aggregator = weighted_aggregator;
    
    // Convert to fixed-point (assuming input number and weight are integers)
    let scaled_number = (number as u128) * SCALE_FACTOR;
    let scaled_weight = (weight as u128) * SCALE_FACTOR;

    // Log addition
    emit_log_event(b"Adding number and weight");

    // Store the number and weight
    vector::push_back(&mut aggregator.numbers, NumberWeight {
        number: scaled_number,
        weight: scaled_weight,
    });

    // Update running totals
    aggregator.total_sum = aggregator.total_sum + (scaled_number * scaled_weight / SCALE_FACTOR);
    aggregator.total_weight = aggregator.total_weight + scaled_weight;
}

// Get the current weighted average
public fun get_weighted_average(weighted_aggregator: &WeightedAggregator): u64 {
    let aggregator = weighted_aggregator;
    
    emit_log_event(b"Calculating weighted average");

    if (aggregator.total_weight == 0) {
        0 // Return 0 if no weights
    } else {
        // Return weighted average scaled back to integer
        ((aggregator.total_sum / aggregator.total_weight) as u64)
    }
}

// Get all numbers and their weights
public fun get_all(weighted_aggregator: &WeightedAggregator): vector<NumberWeight> {
    let aggregator = weighted_aggregator;
    
    emit_log_event(b"Getting all numbers and weights");
    
    aggregator.numbers
}

// Get the total weight
public fun get_total_weight(weighted_aggregator: &WeightedAggregator): u64 {
    let aggregator = weighted_aggregator;
    (aggregator.total_weight / SCALE_FACTOR as u64)
}

// Get the number of entries
public fun len(weighted_aggregator: &WeightedAggregator): u64 {
    let aggregator = weighted_aggregator;
    vector::length(&aggregator.numbers)
}

// Check if the aggregator is empty
public fun is_empty(weighted_aggregator: &WeightedAggregator): bool {
    let aggregator = weighted_aggregator;
    vector::is_empty(&aggregator.numbers)
}

// Helper function to emit log events
fun emit_log_event(message: vector<u8>) {
    event::emit(LogEvent { message });
}
