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

async function deployContract(bytecodeFileId, recipientAddress) {
  const contractTx = new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId)
    .setGas(100000)
    .setConstructorParameters(new ContractFunctionParameters().addString(recipientAddress)); // pass the recipient address

  const contractResponse = await contractTx.execute(client);
  const contractReceipt = await contractResponse.getReceipt(client);

  const newContractId = contractReceipt.contractId;
  console.log("The smart contract ID is " + newContractId);
  
  // Log the actual transaction fee
  // const transactionRecord = await contractResponse.getRecord(client);
  // console.log("The transaction fee was " + transactionRecord.fee);
}

const recipientAddress = "0.0.10610753";
console.log("recipientAddress:", recipientAddress);
deployContract("0.0.15036745", recipientAddress).catch(console.error);
