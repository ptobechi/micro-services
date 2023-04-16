const axios = require('axios');
const address = 'bc1ql4y9pqgxl6ecmfz33uya5x2zvtp2twrn7p40rj';
const token = 'ec22853c8f034516bcba9c9adc34324e';
const limit = 1;

const getInfor = async () => {
    try {
        const response = await axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?limit=${limit}&token=${token}`);
        const transactions = response.data.txs;
        let totalBtcReceived = 0;

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

        // const totalBtcReceivedInSatoshis = totalBtcReceived * 100000000;
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
