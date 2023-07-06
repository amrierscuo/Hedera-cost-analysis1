require("dotenv").config();
const {
  Client,
  PrivateKey,
  FileCreateTransaction,
  Hbar,
} = require("@hashgraph/sdk");

const operatorPrivateKey = PrivateKey.fromString(
  process.env.MY_PRIVATE_KEY
);
const operatorId = process.env.MY_ACCOUNT_ID;
let client = Client.forTestnet();
client.setOperator(operatorId, operatorPrivateKey);

// Set the default maximum transaction fee (in Hbar)
client.setDefaultMaxTransactionFee(new Hbar(100));

// Set the maximum payment for queries (in Hbar)
client.setMaxQueryPayment(new Hbar(50));

//Import the compiled contract from the SimpleTransfer.json file
let dataStorage = require("./SimpleTransfer.json");
const bytecode = dataStorage.data.bytecode.object;

async function main() {
  //Create a file on Hedera and store the hex-encoded bytecode
  const fileCreateTx = new FileCreateTransaction()
    //Set the bytecode of the contract
    .setContents(bytecode);

  //Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
  const submitTx = await fileCreateTx.execute(client);

  //Get the receipt of the file create transaction
  const fileReceipt = await submitTx.getReceipt(client);

  //Get the file ID from the receipt
  const bytecodeFileId = fileReceipt.fileId;

  //Log the file ID
  console.log("The smart contract bytecode file ID is " + bytecodeFileId);
}

main().catch((error) => {
  console.error("Error:", error);
});
