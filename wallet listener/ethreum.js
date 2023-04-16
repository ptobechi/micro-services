const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/your-infura-api-key'));


const walletAddress = '0x1234567890123456789012345678901234567890';

web3.eth.subscribe('pendingTransactions', function (error, result) {
    if (!error) {
        web3.eth.getTransaction(result, function (error, transaction) {
            if (!error && transaction.to.toLowerCase() === walletAddress.toLowerCase()) {
                console.log('Transaction received:', transaction);
                // Trigger your event here
            }
        });
    }
});
