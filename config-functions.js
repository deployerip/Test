const fetch = require('node-fetch');

// Fetch Public and Private Keys from the API
const fetchKeys = async () => {
    try {
        console.log('Fetching keys from API...');
        const response = await fetch('https://www.iranguard.workers.dev/keys');

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Failed to fetch keys: ${response.status} ${response.statusText}`);
        }

        // Parse the response as JSON
        const data = await response.json();
        console.log('API response:', data);

        // Extract public and private keys
        const publicKey = data.PublicKey;
        const privateKey = data.PrivateKey;

        // Log the extracted keys
        console.log('Extracted Public Key:', publicKey);
        console.log('Extracted Private Key:', privateKey);

        // Check if keys are valid
        if (!publicKey || !privateKey) {
            throw new Error('PublicKey or PrivateKey not found in the API response');
        }

        return { publicKey, privateKey };
    } catch (error) {
        console.error('Error fetching keys:', error);
        throw error;
    }
};

// Fetch Account Data based on publicKey and installId
const fetchAccount = async (publicKey, installId, fcmToken) => {
    const apiUrl = 'https://www.iranguard.workers.dev/wg';
    try {
        console.log('Fetching account data...');
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'User-Agent': 'okhttp/3.12.1',
                'CF-Client-Version': 'a-6.10-2158',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: publicKey,
                install_id: installId,
                fcm_token: fcmToken,
                tos: new Date().toISOString(),
                model: 'PC',
                serial_number: installId,
                locale: 'de_DE',
            }),
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Failed to fetch account: ${response.status} ${response.statusText}`);
        }

        // Parse the response as JSON
        const accountData = await response.json();
        console.log('Account data:', accountData);

        return accountData;
    } catch (error) {
        console.error('Error fetching account:', error);
        throw error;
    }
};

// Generate WireGuard Configuration Text
const generateWireGuardConfig = (data, privateKey) => {
    return `
[Interface]
PrivateKey = ${privateKey}
Address = ${data.config.interface.addresses.v4}/32, ${data.config.interface.addresses.v6}/128
DNS = 1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001
MTU = 1280

[Peer]
PublicKey = ${data.config.peers[0].public_key}
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = engage.cloudflareclient.com:2408
`;
};

// Export all functions to be used in other scripts
module.exports = {
    fetchKeys,
    fetchAccount,
    generateWireGuardConfig,
};
