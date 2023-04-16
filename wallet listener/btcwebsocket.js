const axios = require('axios');
const WebSocket = require('ws');

const address = 'bc1ql4y9pqgxl6ecmfz33uya5x2zvtp2twrn7p40rj';
const token = 'ec22853c8f034516bcba9c9adc34324e';
const limit = 1;

const getInfor = async () => {
    try {
        const response = await axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?limit=${limit}&token=${token}`);
        const transactions = response.data.txs;
        let totalBtcReceived = 0;

        // Create a WebSocket connection to receive real-time transaction confirmation updates
        const ws = new WebSocket(`wss://ws.blockchain.info/inv`);

        ws.on('open', function () {
            // Subscribe to the transaction confirmation updates for the given address
            ws.send(`{"op":"addr_sub", "addr":"${address}"}`);
        });

        ws.on('message', function (data) {
            const message = JSON.parse(data);
            if (message.op === "utx" && message.x.outputs.some(output => output.addresses.includes(address))) {
                // If a new unconfirmed transaction output is detected for the given address, print the transaction hash and amount received
                const transactionHash = message.x.hash;
                const transactionBtcReceived = message.x.outputs.filter(output => output.addresses.includes(address)).reduce((total, output) => total + output.value, 0) / 100000000;
                console.log(`New transaction received: ${transactionHash} (amount: ${transactionBtcReceived} BTC)`);
            } else if (message.op === "block") {
                // If a new block is detected, check if any of the previously unconfirmed transactions have reached 1 confirmation
                transactions.forEach(transaction => {
                    if (transaction.confirmations === 1) {
                        console.log(`Transaction ${transaction.hash} has reached 1 confirmation.`);
                    }
                });
            }
        });

        transactions.forEach(transaction => {
            console.log(`Transaction hash: ${transaction.hash}`);

            let transactionBtcReceived = 0;
            transaction.outputs.forEach(output => {
                if (output.addresses.includes(address)) {
                    transactionBtcReceived += output.value;
                }
            });

            console.log(`Received amount: ${transactionBtcReceived}`);
            totalBtcReceived += transactionBtcReceived;

            console.log(`Confirmations: ${transaction.confirmations}`);

            if (transaction.confirmations === 1) {
                console.log(`Transaction ${transaction.hash} has reached 1 confirmation.`);
            }
        });

        // Close the WebSocket connection after all transactions have been processed
        ws.close();

        console.log(`Total BTC received: ${totalBtcReceived / 100000000} BTC`);

        // Convert BTC to USD using Coingecko API
        const btcPriceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const btcPriceInUsd = btcPriceResponse.data.bitcoin.usd;
        const totalUsdReceived = btcPriceInUsd * totalBtcReceived;

        console.log(`Total USD received: ${totalUsdReceived}`);

    } catch (error) {
        console.error(error);
    }
}

getInfor();
