const {
  Client,
  ContractCreateTransaction,
  PrivateKey,
  Hbar,
} = require("@hashgraph/sdk");

require("dotenv").config();

const operatorPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const operatorId = process.env.MY_ACCOUNT_ID;
let client = Client.forTestnet();
client.setOperator(operatorId, operatorPrivateKey);

// Set the default maximum transaction fee (in Hbar)
client.setDefaultMaxTransactionFee(new Hbar(100));

// Set the maximum payment for queries (in Hbar)
client.setMaxQueryPayment(new Hbar(50));

async function deployContract(bytecodeFileId) {
  // Instantiate the contract instance
  const contractTx = new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId)
    .setGas(100000);

  // Submit the transaction to the Hedera test network
  const contractResponse = await contractTx.execute(client);

  // Get the receipt of the transaction
  const contractReceipt = await contractResponse.getReceipt(client);

  // Get the smart contract ID
  const newContractId = contractReceipt.contractId;

  // Log the smart contract ID
  console.log("The smart contract ID is " + newContractId);

  // Get the transaction record to find the actual cost
  const transactionRecord = await contractResponse.getRecord(client);
  
  // Log the actual transaction fee
  //console.log("The transaction fee was " + transactionRecord.fee);
}

// Call the async function
deployContract("0.0.14991537").catch(console.error);
