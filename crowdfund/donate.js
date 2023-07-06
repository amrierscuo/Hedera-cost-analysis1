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

async function donate(contractId, donorId, amount) {
  console.log("Donor ID (Before Conversion):", donorId);
  
  const donorIdBytes32 = toBytes32(donorId);
  
  console.log("Donor ID (After Conversion):", donorIdBytes32.toString('hex'));

  const donateTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(70000)
    .setFunction("donate", new ContractFunctionParameters().addBytes32(donorIdBytes32))
    .setPayableAmount(new Hbar(amount));

  const donateResponse = await donateTx.execute(client);
  const donateReceipt = await donateResponse.getReceipt(client);

  console.log("Donate status:", donateReceipt.status.toString());
}

const contractId = "0.0.15061934"; // replace with your contract ID
const donorId = process.env.MY_ACCOUNT_ID; // replace with your donor ID
const amount = 51; // replace with your donation amount

donate(contractId, donorId, amount).catch(console.error);

