const {
  Client,
  AccountBalanceQuery,
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

async function checkAccountBalance(accountId) {
  // Create a query to get the account balance
  const balanceQuery = new AccountBalanceQuery()
    .setAccountId(accountId);

  // Execute the query
  const balance = await balanceQuery.execute(client);

  console.log("The balance of account " + accountId + " is: " + balance.hbars.toString());
}

// Replace with your account IDs
checkAccountBalance("0.0.4652957").catch(console.error);
checkAccountBalance("0.0.10610753").catch(console.error);
checkAccountBalance("0.0.10611009").catch(console.error);
