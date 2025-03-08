const fs = require('fs');
const { fetchKeys, fetchAccount, generateWireGuardConfig } = require('./config-functions'); // Updated import

// Directory where the config will be saved
const dir = './generated';

// Ensure the directory exists
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

// Generate and save the config
(async () => {
    try {
        // Step 1: Fetch public and private keys
        const { publicKey, privateKey } = await fetchKeys();
        console.log('Fetched keys:', { publicKey, privateKey });

        // Step 2: Fetch account data
        const installId = 'your-install-id'; // Replace with actual install ID
        const fcmToken = 'your-fcm-token'; // Replace with actual FCM token
        const accountData = await fetchAccount(publicKey, installId, fcmToken);
        console.log('Fetched account data:', accountData);

        // Step 3: Generate WireGuard config
        const configText = generateWireGuardConfig(accountData, privateKey);
        console.log('Generated config:', configText);

        // Step 4: Write the config to a file
        const configFilePath = `${dir}/generated-config.txt`;
        fs.writeFileSync(configFilePath, configText, 'utf8');
        console.log('Config saved successfully:', configFilePath);
    } catch (error) {
        console.error('Error generating config:', error);
        process.exit(1);
    }
})();
