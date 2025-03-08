const fs = require('fs');
const { fetchKeys, fetchAccount, generateConfig, generateRandomString } = require('./config-functions');

// Function to generate configuration and store it
async function generateConfiguration() {
    try {
        const { publicKey, privateKey } = await fetchKeys();
        const installId = generateRandomString(22);
        const fcmToken = `${installId}:APA91b${generateRandomString(134)}`;
        const accountData = await fetchAccount(publicKey, installId, fcmToken);
        if (accountData) {
            const config = generateConfig(accountData, privateKey);
            // Save the config to a file
            fs.writeFileSync('generated-config.txt', config);
            console.log('Config generated and saved.');
        }
    } catch (error) {
        console.error('Error generating config:', error);
    }
}

generateConfiguration();