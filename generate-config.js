const fs = require('fs');

// Example generated config (replace this with actual config generation logic)
const configText = `Your generated config goes here`;

// Make sure the directory exists where you want to save the file (if not, create it)
const dir = './generated'; // Directory where the config will be saved
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// Write the config to 'generated-config.txt' inside the 'generated' directory
const configFilePath = `${dir}/generated-config.txt`;

fs.writeFileSync(configFilePath, configText, 'utf8');
console.log('Config generated successfully:', configFilePath);