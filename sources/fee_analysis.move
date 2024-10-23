
/// Module: fee_analysis
module fee_analysis::fee_analysis;

use std::string::String;
use sui::table::{Self, Table};
use sui::vec_map::{Self, VecMap};

public struct TestObject has key, store {
    id : UID,
    name : String,
}

public struct OnlyOneShared has key, store {
    id : UID,
    table : Table<ID, TestMap>
}

public struct TestMap has key, store {
    id: UID,
    value: VecMap<String, String>,
}

public struct SharedforEachNFT has key, store {
    id : UID,
    bind_object : ID,
    table : Table<String, String>
}

public fun mint_one_sharedObject(
    ctx: &mut TxContext,
) {
    let only_one_shared = OnlyOneShared {
        id: object::new(ctx),
        table: table::new<ID, TestMap>(ctx),
    };
    transfer::public_share_object(only_one_shared)
}

public fun mint_3_objects(
    addr: address,
    ctx: &mut TxContext,
) {
    let mut i :u64 = 0;
    while (i < 3) {
        let obj = TestObject {
            id: object::new(ctx),
            name: i.to_string(),
        };
        transfer::public_transfer(obj, addr);
        i = i + 1;
    }
}


public fun mint_3_shared_objects(
    ctx: &mut TxContext,
) {
    let mut i :u64 = 0;
    while (i < 3) {
        let obj = TestObject {
            id: object::new(ctx),
            name: i.to_string(),
        };
        let shared_obj = SharedforEachNFT {
            id: object::new(ctx),
            bind_object: obj.id.to_inner(),
            table: table::new<String, String>(ctx),
        };
        transfer::public_share_object(shared_obj);
        transfer::public_transfer(obj, ctx.sender());
        i = i + 1;
    }
}

public fun add_init_table_contents(
    shared_obj: &mut OnlyOneShared,
    object_id: ID,
    ctx: &mut TxContext,
) {
    let map = vec_map::empty<String, String>();
    let test_map = TestMap {
        id: object::new(ctx),
        value: map,
    };
    shared_obj.table.add(object_id, test_map);
}

public fun add_table_contents_through_vec_map(
    shared_obj: &mut OnlyOneShared,
    object_id: ID, 
    key: String,
    value: String
) {
    let map = shared_obj.table.borrow_mut(object_id);
    map.value.insert(key, value);
}

public fun add_table_contents_through_table(
    shared_obj: &mut SharedforEachNFT,
    key: String,
    value: String
) {
    shared_obj.table.add( key, value);
}
