const express = require('express');
const app = express();
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
});

app.use(express.json());

app.post('/send-dm', async (req, res) => {
  const { from, discord_ids, message } = req.body;

  if (!discord_ids || discord_ids.length === 0 || !message) {
    return res.status(400).json({ error: "데이터 부족" });
  }

  const fullMessage = `📢 **${from}님의 팀 제안**\n\n${message}`;

  for (const id of discord_ids) {
    try {
      const user = await client.users.fetch(id);
      await user.send(fullMessage);
      console.log(`✅ ${id} 에게 전송됨`);
    } catch (err) {
      console.error(`❌ ${id} 전송 실패:`, err);
    }
  }

  res.json({ success: true });
});

client.once('ready', () => {
  console.log(`🤖 로그인됨: ${client.user.tag}`);
  app.listen(3000, () => {
    console.log("✅ DM 서버 실행 중 (포트 3000)");
  });
});

client.login(process.env.TOKEN);
