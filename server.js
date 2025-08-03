// server.js
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// ใช้ค่า Environment Variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(bodyParser.json());

// Route หลักสำหรับ Webhook
app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;
    console.log("Received Webhook:", data);

    // สร้างข้อความแจ้งเตือน
    const message = `
🚨 Triple T Alert
Symbol: ${data.symbol}
Price: ${data.price}
Time: ${data.time}
Action: ${data.signal}
TP: ${data.take_profit}
SL: ${data.stop_loss}
    `;

    // ส่งข้อความไป Telegram
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });

    res.status(200).send({ success: true, message: "Alert sent to Telegram!" });
  } catch (error) {
    console.error("Error sending alert:", error.response?.data || error.message);
    res.status(500).send({ success: false, error: "Failed to send alert" });
  }
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
