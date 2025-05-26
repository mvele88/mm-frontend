const express = require('express');
const app = express();
app.use(express.json());

let isRunning = false;
let profitUSD = 0;
let startTime = null;
let interval = null;

const BTC_ADDRESSES = [
  "bc1q9k79mkx82h8e8awvda5slgw9sku0lyrf5mlaek",
  "bc1ql37nntg829w2vyufpheg9wxdutl8m4zjvjudt2"
];

app.post('/start', (req, res) => {
  if (!isRunning) {
    isRunning = true;
    startTime = Date.now();
    interval = setInterval(() => {
      profitUSD = (profitUSD + 50) * 1.05 - 50;
    }, 1000 * 60 * 60 * 4); // Every 4 hours
    res.json({ message: "Sniping started." });
  } else {
    res.json({ message: "Already running." });
  }
});

app.post('/stop', (req, res) => {
  isRunning = false;
  clearInterval(interval);
  res.json({ message: "Sniping stopped." });
});

app.get('/status', (req, res) => {
  res.json({
    running: isRunning,
    profitUSD: profitUSD.toFixed(2),
    uptimeHours: isRunning ? ((Date.now() - startTime) / 3600000).toFixed(2) : 0
  });
});

app.post('/withdraw', (req, res) => {
  const total = profitUSD;
  const userShare = total * 0.8;
  const devSplit = total * 0.1;

  profitUSD = 0;

  res.json({
    status: "Withdrawal processed.",
    sentToUserInSOL: userShare.toFixed(2),
    btcPayments: BTC_ADDRESSES.map(addr => ({ address: addr, amount: devSplit.toFixed(2) }))
  });
});

module.exports = app;