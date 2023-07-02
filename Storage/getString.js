const {
  Client,
  PrivateKey,
  ContractCallQuery,
  Hbar,
  ContractId,
} = require("@hashgraph/sdk");

require("dotenv").config();

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

client.setMaxQueryPayment(new Hbar(50));

async function getString() {
  const contractId = ContractId.fromString("0.0.14990560"); // ID

  const contractQuery = new ContractCallQuery()
    .setGas(100000)
    .setContractId(contractId)
    .setFunction("textString")
    .setQueryPayment(new Hbar(2));

  const response = await contractQuery.execute(client);

  const storedString = response.getString(0);

  console.log("The stored string: " + storedString);
}

getString().catch(console.error);
