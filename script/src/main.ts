
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";
import { SIGNER_PHRASE, SUI_NETWORK, PACKAGE_ID, ONE_SHARED_OBJECT_ID, EACH_USER_SHARED_OBJECT_ID } from "./config";
// Create a client to connect to the Sui network
const getClient = () => {
    console.log("Connecting to ", SUI_NETWORK);
      let client = new SuiClient({
      url: SUI_NETWORK,
      });
  
    return client;
  };

  // Derive the keypair from the Mnemonic phrase to sign transactions
const getSigner = () => {
    // derive keypair from the Mnemonic phrase
    const keypair = Secp256k1Keypair.deriveKeypair(SIGNER_PHRASE);
    return keypair;
  };

let signerAddress = getSigner().getPublicKey().toSuiAddress();

const mint_3_objects = async () => {
    let tx = new Transaction();
    tx.setSender(signerAddress);
    tx.moveCall({
        package: PACKAGE_ID,
        module: "fee_analysis",
        function: "mint_3_objects",
        arguments: [
            tx.pure.address(signerAddress),
        ],
    });
    tx.setGasBudget(1000000000);
    const resp = await getClient().signAndExecuteTransaction({
		signer: getSigner(),
		transaction: tx,
        requestType: "WaitForLocalExecution",
        options: {
            showObjectChanges: true,
            showEffects: true,
          },
	});
	const res = await getClient().waitForTransaction({ digest: resp.digest });
	console.log(res);
};


const mint_one_sharedObject = async () => {
    let tx = new Transaction();
    tx.setSender(signerAddress);
    tx.moveCall({
        package: PACKAGE_ID,
        module: "fee_analysis",
        function: "mint_one_sharedObject",
    });
    tx.setGasBudget(1000000000);

    const resp = await getClient().signAndExecuteTransaction({
		signer: getSigner(),
		transaction: tx,
        requestType: "WaitForLocalExecution",
        options: {
            showObjectChanges: true,
            showEffects: true,
          },
	});
    const res = await getClient().waitForTransaction({ digest: resp.digest });
	console.log(res);
}

const mint_3_shared_objects = async () => {
    let tx = new Transaction();
    tx.setSender(signerAddress);
    tx.moveCall({
        package: PACKAGE_ID,
        module: "fee_analysis",
        function: "mint_3_shared_objects",
    });
    tx.setGasBudget(1000000000);

    const resp = await getClient().signAndExecuteTransaction({
		signer: getSigner(),
		transaction: tx,
        requestType: "WaitForLocalExecution",
        options: {
            showObjectChanges: true,
            showEffects: true,
          },
	});
    const res = await getClient().waitForTransaction({ digest: resp.digest });
	console.log(res);
}

const add_init_table_contents = async (object_id: string) => {
    let tx = new Transaction();
    tx.setSender(signerAddress);
    tx.moveCall({
        package: PACKAGE_ID,
        module: "fee_analysis",
        function: "add_init_table_contents",
        arguments: [
            tx.object(ONE_SHARED_OBJECT_ID),
            tx.object(object_id),
        ],
    });
    tx.setGasBudget(1000000000);

    const resp = await getClient().signAndExecuteTransaction({
		signer: getSigner(),
		transaction: tx,
        requestType: "WaitForLocalExecution",
        options: {
            showObjectChanges: true,
            showEffects: true,
          },
	});
    const res = await getClient().waitForTransaction({ digest: resp.digest });
	console.log(res);
}

const dry_run_use_borrow_mut = async (object_id: string) => {
    let tx = new Transaction();
    tx.setSender(signerAddress);
    tx.moveCall({
        package: PACKAGE_ID,
        module: "fee_analysis",
        function: "add_table_contents_through_vec_map",
        arguments: [
            tx.object(ONE_SHARED_OBJECT_ID),
            tx.object(object_id),
            tx.pure.string("key"),
            tx.pure.string("value"),
        ],
    });
    const txbuild = await tx.build({
        client: getClient()
    })

    try {
        const txRes = await getClient().dryRunTransactionBlock({
            transactionBlock: txbuild
        });
        console.log(JSON.stringify(txRes, null, 2));

        console.log(txRes.effects.gasUsed.computationCost)
        console.log(txRes.effects.gasUsed.storageCost)
        console.log(txRes.effects.gasUsed.storageRebate + "\n")


        console.log(
            Number(txRes.effects.gasUsed.computationCost) +
            Number(txRes.effects.gasUsed.storageCost) -
            Number(txRes.effects.gasUsed.storageRebate)
        );
    } catch (e) {
        console.error("Error in dryRun", e);
    }
}

const dry_run_use_table_add = async (shard_object_id: string) => {
    let tx = new Transaction();
    tx.setSender(signerAddress);
    tx.moveCall({
        package: PACKAGE_ID,
        module: "fee_analysis",
        function: "add_table_contents_through_table",
        arguments: [
            tx.object(shard_object_id),
            tx.pure.string("key"),
            tx.pure.string("value"),
        ],
    });

    const txbuild = await tx.build({
        client: getClient()
    })

    try {
        const txRes = await getClient().dryRunTransactionBlock({
            transactionBlock: txbuild
        });
        // console.log(JSON.stringify(txRes, null, 2));

        console.log(txRes.effects.gasUsed.computationCost)
        console.log(txRes.effects.gasUsed.storageCost)
        console.log(txRes.effects.gasUsed.storageRebate + "\n")


        console.log(
            Number(txRes.effects.gasUsed.computationCost) +
            Number(txRes.effects.gasUsed.storageCost) -
            Number(txRes.effects.gasUsed.storageRebate)
        );
    } catch (e) {
        console.error("Error in dryRun", e);
    }
}

const command = process.argv[2];
switch (command) {
    case "mint_3_objects":
        mint_3_objects();
        break;
    case "mint_one_sharedObject":
        mint_one_sharedObject();
        break;
    case "mint_3_shared_objects":
        mint_3_shared_objects();
        break;
    case "add_init_table_contents":
        add_init_table_contents(process.argv[3]);
        break;
    // 0x57e1f52326bacfc392e211c846828bb2b43df31e31427018b6c4b7f9b4751aed
    // 0xb66ab59b8bf66011320f1c351026e26a298d133644e61b6c1793f4b4108360c4
    // 0xbd3bbcc47c2209fe5b75af563c5dba2c9744134da34fd4f166857bf0762e8807
    // Spent 1129124 MIST
    case "dry_run_use_borrow_mut":
        dry_run_use_borrow_mut(process.argv[3]);
        break;
    // 0x1ecc99c03f416dde63cb7fa32158de65382577c5d70fd2614f6aa48a1a4101b8
    // 0x49530ced297acec155c70a966e21a23605fe73563b044f77b32e4d08761f94fc
    // 0xf0b6abca573f25367641a1bf5d81e2db2a4d69a9a982007c0576dc631fd61325
    // Spent 3165316 MIST
    case "dry_run_use_table_add":
        dry_run_use_table_add(process.argv[3]);
        break;
}