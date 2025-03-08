const fs = require('fs');
const axios = require('axios');

// Telegram bot token and chat ID (secrets passed from GitHub Actions)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Define the path to the generated config
const configFilePath = './generated/generated-config.txt';

try {
    // Check if the file exists
    if (!fs.existsSync(configFilePath)) {
        console.error(`Config file not found at ${configFilePath}`);
        process.exit(1);
    }

    // Read the config file
    const configText = fs.readFileSync(configFilePath, 'utf8');

    // Telegram API URL
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    // Send the config as a message to the Telegram channel
    axios.post(url, {
        chat_id: TELEGRAM_CHAT_ID,
        text: `Here is the generated config:\n\n${configText}`
    })
    .then(response => {
        console.log('Config sent to Telegram successfully');
    })
    .catch(error => {
        console.error('Error sending config to Telegram:', error);
    });

} catch (error) {
    console.error('Error reading config file:', error);
    process.exit(1);
}