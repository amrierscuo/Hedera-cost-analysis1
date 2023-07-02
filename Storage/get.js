const {
  Client,
  PrivateKey,
  ContractCallQuery,
  Hbar,
  ContractId,
} = require("@hashgraph/sdk");

require("dotenv").config();

// Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

// Create your connection to the Hedera Network
const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

// Set the maximum payment for queries (in Hbar)
client.setMaxQueryPayment(new Hbar(50));

async function callContract() {
  const newContractId = ContractId.fromString("0.0.14838403"); //  ID

  // Calls a function of the smart contract
  const contractQuery = new ContractCallQuery()
    //Set the gas for the query
    .setGas(100000)
    //Set the contract ID to return the request for
    .setContractId(newContractId)
    //Set the contract function to call
    .setFunction("get_message")
    //Set the query payment for the node returning the request
    //This value must cover the cost of the request otherwise will fail
    .setQueryPayment(new Hbar(2));

  // Submit to a Hedera network
  const getMessage = await contractQuery.execute(client);

  // Get a string from the result at index 0
  const message = getMessage.getString(0);

  // Log the message
  console.log("The contract message: " + message);
}

callContract().catch(console.error);
