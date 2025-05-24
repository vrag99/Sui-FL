// Stores the blob ids and their statuses
module contracts::store;

use std::string::String;

public struct ModelStore has key, store {
    id: UID,
    models: vector<Model>,
}

public struct Model has copy, store, drop {
    id: String,
    status: String,
    blobId: String,
}

fun init(ctx: &mut TxContext) {
    let modelStore = ModelStore {
        id: object::new(ctx),
        models: vector::empty()
    };
    transfer::share_object(modelStore);
}

// Helper function to find the index of a model in the vector
fun find_model_index(store: &ModelStore, id: String): Option<u64> {
    let len = vector::length(&store.models);
    let mut i = 0;
    while (i < len) {
        let model = vector::borrow(&store.models, i);
        if (model.id == id) {
            return option::some(i)
        };
        i = i + 1;
    };
    option::none()
}

// CRUD operations
public fun create_model(store: &mut ModelStore, id: String, status: String, blobId: String) {
    let model = Model {
        id,
        status,
        blobId
    };
    vector::push_back(&mut store.models, model);
}

public fun update_model_status(store: &mut ModelStore, id: String, new_status: String) {
    let mut index_opt = find_model_index(store, id);
    if (option::is_none(&index_opt)) {
        abort 0
    };
    let model = vector::borrow_mut(&mut store.models, option::extract(&mut index_opt));
    model.status = new_status;
}

public fun update_model_blob(store: &mut ModelStore, id: String, new_blob_id: String) {
    let mut index_opt = find_model_index(store, id);
    if (option::is_none(&index_opt)) {
        abort 0
    };
    let model = vector::borrow_mut(&mut store.models, option::extract(&mut index_opt));
    model.blobId = new_blob_id;
}

public fun delete_model(store: &mut ModelStore, id: String) {
    let mut index_opt = find_model_index(store, id);
    if (option::is_none(&index_opt)) {
        abort 0
    };
    vector::remove(&mut store.models, option::extract(&mut index_opt));
}
