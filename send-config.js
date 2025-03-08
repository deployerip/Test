const fs = require('fs');
const fetch = require('node-fetch'); // Make sure you install node-fetch
const config = fs.readFileSync('generated-config.txt', 'utf-8');

// Send config via Telegram
async function sendConfig() {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const message = `
        New Configuration Generated:
        \`\`\`
        ${config}
        \`\`\`
    `;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const payload = {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown' // To format the config text as code block
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error(`Error sending message: ${response.status}`);
        }
        console.log('Configuration sent to Telegram');
    } catch (error) {
        console.error('Failed to send configuration to Telegram:', error);
    }
}

sendConfig();