const {
  Client,
  ContractExecuteTransaction,
  PrivateKey,
  Hbar,
} = require("@hashgraph/sdk");

require("dotenv").config();

const operatorPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const operatorId = process.env.MY_ACCOUNT_ID;
let client = Client.forTestnet();
client.setOperator(operatorId, operatorPrivateKey);

async function deposit(contractId, amount) {
  const depositTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(1000000)
    .setFunction("deposit")
    .setPayableAmount(new Hbar(amount));

  const response = await depositTx.execute(client);
  const receipt = await response.getReceipt(client);

  console.log("Deposit status: " + receipt.status.toString());
}

// Call the function
deposit("0.0.15036746", 10).catch(console.error);               //ID
