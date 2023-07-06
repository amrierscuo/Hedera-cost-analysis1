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
const recipientId = process.env.MY_ACCOUNT_ID;

let client = Client.forTestnet();
client.setOperator(operatorId, operatorPrivateKey);

// Conversion function to turn a Hedera account ID into a bytes32 value
function toBytes32(accountId) {
  const buffer = Buffer.from(accountId, 'utf8');
  if (buffer.length > 32) {
    throw new Error('Account ID is too long to fit in bytes32');
  }
  const bytes32 = Buffer.alloc(32);
  buffer.copy(bytes32);
  return bytes32;
}

async function withdraw(contractId, amount, withdrawerId) {
  const withdrawTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(1000000)
    .setFunction("withdraw", new ContractFunctionParameters().addUint256(amount).addBytes32(toBytes32(withdrawerId)));

  const response = await withdrawTx.execute(client);
  const receipt = await response.getReceipt(client);

  console.log("Withdraw status: " + receipt.status.toString());
}

const hbarAmount = 5;
const tinybarAmount = hbarAmount * 100000000;


// Call the function, replace '0.0.15053101' and '5' with your own values
withdraw("0.0.15053101", tinybarAmount, recipientId).catch(console.error);

//withdraw("0.0.15053101", tinybarAmount, withdrawerId).catch(console.error);
