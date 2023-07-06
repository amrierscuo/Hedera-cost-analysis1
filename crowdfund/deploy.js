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

async function deployContract(bytecodeFileId, receiverAddress, endDonate, goal) {
  console.log("Receiver Address (Before Conversion):", receiverAddress);
  const receiverAddressBytes32 = toBytes32(receiverAddress);
  console.log("Receiver Address (After Conversion):", receiverAddressBytes32.toString('hex'));

  const contractTx = new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId)
    .setGas(5000000)
    .setConstructorParameters(
      new ContractFunctionParameters()
        .addBytes32(receiverAddressBytes32) // receiver_ parameter as bytes32
        .addUint256(endDonate) // end_donate_ parameter as uint256
        .addUint256(goal) // goal_ parameter as uint256
    );

  const contractResponse = await contractTx.execute(client);
  const contractReceipt = await contractResponse.getReceipt(client);

  const newContractId = contractReceipt.contractId;
  console.log("The smart contract ID is " + newContractId);
  console.log("https://hashscan.io/testnet/contract/" + newContractId);
}

const receiverAddress = process.env.MY_ACCOUNT_ID2;
//const endDonate = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours from now
const endDonate = Math.floor(Date.now() / 1000) + 40; // 40 seconds from now
const goal = 100; // replace with your goal amount
const currentTime = Math.floor(Date.now() / 1000);
const remainingTime = endDonate - currentTime;



console.log("Receiver Address:", receiverAddress);
console.log("End Donate (Unix Timestamp in seconds) ", endDonate);
console.log("Goal (unit of measure):", goal);
console.log("Remaining time to donate (seconds):", remainingTime);
deployContract("0.0.15061777", receiverAddress, endDonate, goal).catch(console.error);
