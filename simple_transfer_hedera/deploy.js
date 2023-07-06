const {
  Client,
  ContractCreateTransaction,
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

async function deployContract(bytecodeFileId, recipientAddress) {
  const contractTx = new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId)
    .setGas(5000000) 
    .setConstructorParameters(new ContractFunctionParameters().addBytes32(toBytes32(recipientAddress))); 
  const contractResponse = await contractTx.execute(client);
  const contractReceipt = await contractResponse.getReceipt(client);

  const newContractId = contractReceipt.contractId;
  console.log("The smart contract ID is " + newContractId);
}

const recipientAddress = process.env.MY_ACCOUNT_ID2;
console.log("recipientAddress:", recipientAddress);
deployContract("0.0.15053099", recipientAddress).catch(console.error);
