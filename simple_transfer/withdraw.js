const {
  Client,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  PrivateKey,
  Hbar,
} = require("@hashgraph/sdk");

require("dotenv").config();

const operatorPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY2);
const operatorId = process.env.MY_ACCOUNT_ID2;
//const operatorPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY1);
//const operatorId = process.env.MY_ACCOUNT_ID1;
let client = Client.forTestnet();
client.setOperator(operatorId, operatorPrivateKey);

async function withdraw(contractId, amount) {
  const withdrawTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(1000000)
    .setFunction("withdraw", new ContractFunctionParameters().addUint64(amount));

  console.log("Withdraw: msg.sender.operatorId =", operatorId);
  console.log("Withdraw: recipient.contractId =", contractId);

//console.log("Withdraw: recipient.recipientAddress =", recipientAddress);
  const response = await withdrawTx.execute(client);
  const receipt = await response.getReceipt(client);

  console.log("Withdraw status: " + receipt.status.toString());
}

// Call the function
withdraw("0.0.15036746", 1).catch(console.error);
