const fetch = require('node-fetch');

// Fetch Public and Private Keys from the API
const fetchKeys = async () => {
    try {
        const response = await fetch('https://www.iranguard.workers.dev/keys');
        if (!response.ok) throw new Error(`Failed to fetch keys: ${response.status}`);
        const data = await response.text();
        return {
            publicKey: extractKey(data, 'PublicKey'),
            privateKey: extractKey(data, 'PrivateKey'),
        };
    } catch (error) {
        console.error('Error fetching keys:', error);
        throw error;
    }
};

// Extract Specific Key from Text Data (e.g., PublicKey or PrivateKey)
const extractKey = (data, keyName) => {
    const regex = new RegExp(`${keyName}:\\s(.+)`);
    const match = data.match(regex);
    return match ? match[1].trim() : null;
};

// Fetch Account Data based on publicKey and installId
const fetchAccount = async (publicKey, installId, fcmToken) => {
    const apiUrl = 'https://www.iranguard.workers.dev/wg';
    try {
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
        if (!response.ok) throw new Error(`Failed to fetch account: ${response.status}`);
        return response.json();
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

// Generate Reserved Parameter Dynamically
const generateReserved = (clientId) => {
    return Array.from(atob(clientId))
        .map((char) => char.charCodeAt(0))
        .slice(0, 3)
        .join('%2C');
};

// Generate V2Ray URL
const generateV2RayURL = (privateKey, publicKey, ipv4, ipv6, reserved) => {
    return `wireguard://${encodeURIComponent(privateKey)}@engage.cloudflareclient.com:2408?address=${encodeURIComponent(
        ipv4 + '/32'
    )},${encodeURIComponent(ipv6 + '/128')}&reserved=${reserved}&publickey=${encodeURIComponent(
        publicKey
    )}&mtu=1420#V2ray-Config`;
};

// Export all functions to be used in other scripts
module.exports = {
    fetchKeys,
    fetchAccount,
    generateWireGuardConfig,
    generateReserved,
    generateV2RayURL
};