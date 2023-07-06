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
  const contractId = ContractId.fromString("0.0.15047821"); // Replace with your contract ID

  // Get recipient
  const getRecipientQuery = new ContractCallQuery()
    .setContractId(contractId)
    .setFunction("getRecipient")
    .setGas(2000000);
  const queryResult = await getRecipientQuery.execute(client);
  
  try {
    const recipientBytes = queryResult.getBytes32(0); // gets the 32 bytes returned from getRecipient function
    const recipient = recipientBytes.toString('hex'); // convert bytes to hexadecimal string
    console.log("The recipient of contract " + contractId + " is: " + recipient);

    // printing the non-hexadecimal version
    const recipientNonHex = recipientBytes.toString('utf8'); 
    console.log("The recipient of contract " + contractId + " in non-hexadecimal is: " + recipientNonHex);
    const recipientNumber = parseInt(recipient, 16); // convert hex to integer
console.log("The recipient of contract " + contractId + " in number is: " + recipientNumber);

  } catch (error) {
    console.error("Error reading recipient: ", error);
  }
}

main().catch(console.error);
