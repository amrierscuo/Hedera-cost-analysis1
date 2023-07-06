// File: reclaim.js


const {
  Client,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  PrivateKey,
  Hbar,
} = require("@hashgraph/sdk");

require("dotenv").config();

const operatorPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const operatorId = process.env.MY_ACCOUNT_ID;

let client = Client.forTestnet();
client.setOperator(operatorId, operatorPrivateKey);

client.setDefaultMaxTransactionFee(new Hbar(100));
client.setMaxQueryPayment(new Hbar(50));

function toBytes32(accountId) {
  const buffer = Buffer.from(accountId, 'utf8');
  if (buffer.length > 32) {
    throw new Error('Account ID is too long to fit in bytes32');
  }
  const bytes32 = Buffer.alloc(32);
  buffer.copy(bytes32);
  return bytes32;
}

async function reclaim(contractId, claimerId) {
  console.log("Claimer ID (Before Conversion):", claimerId);
  
  const claimerIdBytes32 = toBytes32(claimerId);
  
  console.log("Claimer ID (After Conversion):", claimerIdBytes32.toString('hex'));

  const reclaimTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(70000)
    .setFunction("reclaim", new ContractFunctionParameters().addBytes32(claimerIdBytes32));

  const reclaimResponse = await reclaimTx.execute(client);
  const reclaimReceipt = await reclaimResponse.getReceipt(client);

  console.log("Reclaim status:", reclaimReceipt.status.toString());
}

const contractId = "0.0.15061934"; // replace with your new contract ID
const claimerId = process.env.MY_ACCOUNT_ID; // replace with your claimer ID

// Execute the reclaim
reclaim(contractId, claimerId).catch(console.error);
