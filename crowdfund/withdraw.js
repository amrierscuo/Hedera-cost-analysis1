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

async function withdraw(contractId, withdrawerId, amount) {
  console.log("Withdrawer ID (Before Conversion):", withdrawerId);
  
  const withdrawerIdBytes32 = toBytes32(withdrawerId);
  
  console.log("Withdrawer ID (After Conversion):", withdrawerIdBytes32.toString('hex'));

  const withdrawTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(70000)
    .setFunction("withdraw", new ContractFunctionParameters().addUint256(amount).addBytes32(withdrawerIdBytes32));

  const withdrawResponse = await withdrawTx.execute(client);
  const withdrawReceipt = await withdrawResponse.getReceipt(client);

  console.log("Withdraw status:", withdrawReceipt.status.toString());
}

const contractId = "0.0.15061883"; // replace with your new contract ID
const withdrawerId = process.env.MY_ACCOUNT_ID2; // replace with your withdrawer ID
const amount = 10; // replace with the amount you want to withdraw in wei

// Execute the withdrawal
withdraw(contractId, withdrawerId, amount).catch(console.error);
