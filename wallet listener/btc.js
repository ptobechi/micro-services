const bitcoin = require('bitcoinjs-lib');
const request = require('request');
const blockstreamBaseUrl = 'https://blockstream.info/api';
const walletAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';

const url = `${blockstreamBaseUrl}/address/${walletAddress}/txs`;
request(url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    const transactions = body;
    transactions.forEach((tx) => {

        console.log('Transaction:', tx);
        // Trigger your event here
    });
    console.log(transactions.length)
});
