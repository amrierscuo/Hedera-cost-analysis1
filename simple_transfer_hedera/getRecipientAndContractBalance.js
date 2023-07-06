const {
  Client,
  ContractCallQuery,
  ContractId,
  PrivateKey,
  Hbar,
} = require("@hashgraph/sdk");

require("dotenv").config();

const operatorPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const operatorId = process.env.MY_ACCOUNT_ID;
let client = Client.forTestnet();
client.setOperator(operatorId, operatorPrivateKey);
client.setMaxQueryPayment(new Hbar(50));

async function main() {
  const contractId = ContractId.fromString("0.0.15053101"); // Replace with your contract ID

  // Get recipient
  const getRecipientQuery = new ContractCallQuery()
    .setContractId(contractId)
    .setFunction("getRecipient")
    .setGas(2000000);
  const recipient = await getRecipientQuery.execute(client);
  //const recipientBytes32 = recipient.getString(0);
  //const recipientAddress = Buffer.from(recipientBytes32.slice(2), 'hex').toString('utf8');
  console.log("The recipient of contract " + contractId + " is: " + recipientAddress);
  //console.log("The recipient of contract " + contractId + " is: " + recipient.getUint256(0).toString());
  //console.log("The recipient of contract " + contractId + " is recipient.getString(0): " + recipient.getString(0));
    //console.log("The recipient of contract " + contractId + " is recipient.getUint256(0).toString(): " + recipient.getUint256(0).toString());
    //console.log("The recipient of contract " + contractId + " is recipient.toString(): " + recipient.toString());
    //console.log("The recipient of contract " + contractId + " is recipient.getAddress(): " + recipient.getAddress());console.log("The recipient of contract " + contractId  + process.env.MY_ACCOUNT_ID2);
    console.log("The recipient of contract " + contractId + " is process.env.MY_ACCOUNT_ID2: " + process.env.MY_ACCOUNT_ID2);
 // console.log("The recipient of contract " + contractId + " is recipientAddress: " + recipientAddress); //ReferenceError: recipientAddress is not defined at main 
    console.log("The recipient of contract " + contractId + " is: " + recipient.getBytes32(0).toString('hex'));
  // Get contract balance
console.log("The recipient of contract " + contractId + " is: " + recipient.getBytes32(0).toString('hex'));

  const getContractBalanceQuery = new ContractCallQuery()
    .setContractId(contractId)
    .setFunction("getContractBalance")
    .setGas(2000000);
  const balance = await getContractBalanceQuery.execute(client);
  console.log("The balance of contract " + contractId + " is: " + balance.getUint256(0).toString() + " tinybars (" + (balance.getUint256(0).toNumber() / 100000000) + " Hbars)");

}

main().catch(console.error);
