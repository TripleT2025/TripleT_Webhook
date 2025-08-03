// server.js
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// ใช้ค่า Environment Variable
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(bodyParser.json());

// Route หลักสำหรับ Webhook
app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;
    console.log("Received Webhook:", data);

    const message = `
📢 Triple T Alert
Symbol: ${data.ticker}
Price: ${data.price}
Time: ${data.time}
Action: ${data.signal}
TP: ${data.take_profit}
SL: ${data.stop_loss}
    `;

    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }
    );

    res.status(200).send("Alert sent to Telegram ✅");
  } catch (error) {
    console.error("Error sending alert:", error);
    res.status(500).send("Error sending alert ❌");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
