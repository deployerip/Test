const fs = require('fs');
const axios = require('axios');

// Telegram bot token and chat ID (secrets passed from GitHub Actions)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Define the path to the generated config
const configFilePath = './generated/generated-config.txt';

// Maximum message length for Telegram (4096 characters)
const MAX_MESSAGE_LENGTH = 4096;

try {
    // Check if the file exists
    if (!fs.existsSync(configFilePath)) {
        console.error(`Config file not found at ${configFilePath}`);
        process.exit(1);
    }

    // Read the config file
    const configText = fs.readFileSync(configFilePath, 'utf8');

    // Check if the file is empty
    if (!configText.trim()) {
        console.error('Config file is empty');
        process.exit(1);
    }

    // Debugging logs
    console.log('Telegram Bot Token:', TELEGRAM_BOT_TOKEN ? '***' : 'Not set');
    console.log('Telegram Chat ID:', TELEGRAM_CHAT_ID ? '***' : 'Not set');
    console.log('Config file content length:', configText.length);

    // Telegram API URL
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    // Split the config text into chunks if it exceeds the maximum length
    const chunks = [];
    for (let i = 0; i < configText.length; i += MAX_MESSAGE_LENGTH) {
        chunks.push(configText.slice(i, i + MAX_MESSAGE_LENGTH));
    }

    // Send each chunk as a separate message
    const sendMessage = async (chunk, index) => {
        try {
            const response = await axios.post(url, {
                chat_id: TELEGRAM_CHAT_ID,
                text: `Config part ${index + 1}:\n\n${chunk}`
            });
            console.log(`Config part ${index + 1} sent to Telegram successfully`);
        } catch (error) {
            console.error(`Error sending config part ${index + 1} to Telegram:`, error.response ? error.response.data : error.message);
        }
    };

    // Send all chunks sequentially
    (async ()
