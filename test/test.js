const {
  Client,
  ContractCreateTransaction,
  ContractFunctionParameters,
  PrivateKey,
  Hbar,
  ContractExecuteTransaction, // Aggiungi questa riga
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

  return contractReceipt; // Restituisce l'oggetto contractReceipt
}

async function withdraw(contractId, amount) {
  const contractReceipt = await deployContract("0.0.15036602", "0.0.10610753");
  const recipient = contractReceipt.status.contractId; // Ottieni il valore di recipient da contractReceipt
  const owner = operatorId; // Il valore di owner sarà l'operatore

  console.log("Recipient:", recipient);
  console.log("Owner:", owner);

  const withdrawTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(1000000)
    .setFunction("withdraw", new ContractFunctionParameters().addUint64(amount));

  console.log("Withdraw: msg.sender =", operatorId);
  console.log("Withdraw: recipient =", contractId);

  const response = await withdrawTx.execute(client);
  const receipt = await response.getReceipt(client);

  console.log("Withdraw status: " + receipt.status.toString());
}

// Call the function
withdraw("0.0.15036603", 5).catch(console.error);
