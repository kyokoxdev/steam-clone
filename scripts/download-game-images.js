const fs = require('fs');
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

// Game image URLs based on the Steam store data
const gameImages = [
  {
    name: 'v-rising',
    url: 'https://cdn.akamai.steamstatic.com/steam/apps/1604030/header.jpg'
  },
  {
    name: 'magic-rune-stone',
    url: 'https://cdn.akamai.steamstatic.com/steam/apps/2716990/header.jpg'
  },
  {
    name: 'world-of-goo-2',
    url: 'https://cdn.akamai.steamstatic.com/steam/apps/155000/header.jpg'
  },
  {
    name: 'monster-prom-4',
    url: 'https://cdn.akamai.steamstatic.com/steam/apps/1607700/header.jpg'
  },
  {
    name: 'tempest-rising',
    url: 'https://cdn.akamai.steamstatic.com/steam/apps/1486920/header.jpg'
  },
  {
    name: 'spellrogue',
    url: 'https://cdn.akamai.steamstatic.com/steam/apps/1504750/header.jpg'
  },
  {
    name: 'bokura-planet',
    url: 'https://cdn.akamai.steamstatic.com/steam/apps/1752720/header.jpg'
  },
  {
    name: 'clair-obscur',
    url: 'https://cdn.akamai.steamstatic.com/steam/apps/1536070/header.jpg'
  },
  {
    name: 'fatal-fury',
    url: 'https://cdn.akamai.steamstatic.com/steam/apps/2212330/header.jpg'
  },
  {
    name: 'hundred-line',
    url: 'https://cdn.akamai.steamstatic.com/steam/apps/1629250/header.jpg'
  },
  {
    name: 'dolls-nest',
    url: 'https://cdn.akamai.steamstatic.com/steam/apps/2348070/header.jpg'
  }
];

// Additional screenshots for each game (using various Steam games as examples)
const gameScreenshots = [
  // V Rising screenshots
  { name: 'v-rising-1', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1604030/ss_ad33197a3ef5548d2e2b1efe6f0554ba5620102a.jpg' },
  { name: 'v-rising-2', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1604030/ss_c9d7f9ebcb08e5af8b0c5a0dec53383ca5ed401b.jpg' },
  { name: 'v-rising-3', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1604030/ss_4a5a0f5714236de15ca2c3f4c566493b9ce1279d.jpg' },
  
  // Magic Rune Stone screenshots (using another game as example)
  { name: 'magic-rune-stone-1', url: 'https://cdn.akamai.steamstatic.com/steam/apps/2716990/ss_69d10a50ef7cf41d8e68a25da455c0a63da80db9.jpg' },
  { name: 'magic-rune-stone-2', url: 'https://cdn.akamai.steamstatic.com/steam/apps/2716990/ss_ad3e29a6a79ec5d7d735bd40c2d1f0c8051f0aca.jpg' },
  { name: 'magic-rune-stone-3', url: 'https://cdn.akamai.steamstatic.com/steam/apps/2716990/ss_fb9c3ca2a3cb5d77c9282db67ad4e6579751a63c.jpg' },
  
  // Other games screenshots (using various games as examples)
  { name: 'world-of-goo-2-1', url: 'https://cdn.akamai.steamstatic.com/steam/apps/155000/ss_6a4f5afdaa98402de885cf05d76319beedcc5f6e.jpg' },
  { name: 'world-of-goo-2-2', url: 'https://cdn.akamai.steamstatic.com/steam/apps/155000/ss_e6e19a161e5ff1a91728c6f5039aa4524f3ceac5.jpg' },
  { name: 'world-of-goo-2-3', url: 'https://cdn.akamai.steamstatic.com/steam/apps/155000/ss_c9cc97f2a86ce93748d8a1060ea633547e38b472.jpg' },
  
  { name: 'monster-prom-4-1', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1607700/ss_08d23680e2c0e4bd56ff3239eb48f3a8372bc9a3.jpg' },
  { name: 'monster-prom-4-2', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1607700/ss_05a91bb7fe1e9c1bda59b14bc1d1a91c0a40904b.jpg' },
  { name: 'monster-prom-4-3', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1607700/ss_ef9d73f6fc433e6350ea15ab8f1f1f31a1ade437.jpg' },
  
  { name: 'tempest-rising-1', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1486920/ss_1401faad91cfe71e790636b542d8b49a3186f063.jpg' },
  { name: 'tempest-rising-2', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1486920/ss_dae70338fd85b571d7ad0e8da1ea2bd99442b04e.jpg' },
  { name: 'tempest-rising-3', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1486920/ss_e7a9b8b62f740b51bf8f5c5401edf5ff4fd8870d.jpg' },
  
  { name: 'spellrogue-1', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1504750/ss_1fe60f2a47d3d13a0e7b22c730b8a23d68af4a75.jpg' },
  { name: 'spellrogue-2', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1504750/ss_1c31d2e7d66ffd8f3b5b25f10df7eb87f6c9d748.jpg' },
  { name: 'spellrogue-3', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1504750/ss_b6d7fa1ae4553905ee3b5a9af6261afef4ac5f9b.jpg' },
  
  { name: 'bokura-planet-1', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1752720/ss_d7d63d5d63784c3d486c3cc20c76782f981f9b71.jpg' },
  { name: 'bokura-planet-2', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1752720/ss_da6b254a45ce7cf7a7a44e32dc2389a29b584efd.jpg' },
  { name: 'bokura-planet-3', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1752720/ss_8cd5d9b20e0e68dbb24afa6f87a8c69b7947b237.jpg' },
  
  { name: 'clair-obscur-1', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1536070/ss_1b7e71b21ef06493a2efd59eeaefbeb5dd2d46f4.jpg' },
  { name: 'clair-obscur-2', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1536070/ss_6a5b87a2aef6da7fc9a912d89ca9a185dee17d17.jpg' },
  { name: 'clair-obscur-3', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1536070/ss_da58731fa32ebd3c40823d7a31f6a2e1c7ed428f.jpg' },
  
  { name: 'fatal-fury-1', url: 'https://cdn.akamai.steamstatic.com/steam/apps/2212330/ss_adf4c08db18aee74b273feb122fc5a3bae06c45c.jpg' },
  { name: 'fatal-fury-2', url: 'https://cdn.akamai.steamstatic.com/steam/apps/2212330/ss_7c1f25f7e363e9f9c63886c3ad5236bf9b7e0dcd.jpg' },
  { name: 'fatal-fury-3', url: 'https://cdn.akamai.steamstatic.com/steam/apps/2212330/ss_bd08aeef54405c508c9a83fe9ee6ac0b44ef4d32.jpg' },
  
  { name: 'hundred-line-1', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1629250/ss_f377b98af691dcaaa99faac8c9e02387f54e58ca.jpg' },
  { name: 'hundred-line-2', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1629250/ss_e2889aa10f90e566230a61ffc3188ca3fc7acc62.jpg' },
  { name: 'hundred-line-3', url: 'https://cdn.akamai.steamstatic.com/steam/apps/1629250/ss_88ba595d5528dc71484bd9d80acf98eff58ec06a.jpg' },
  
  { name: 'dolls-nest-1', url: 'https://cdn.akamai.steamstatic.com/steam/apps/2348070/ss_b87e40c6a3861f0e4b97cb3c3c9fa6b55e2a9b14.jpg' },
  { name: 'dolls-nest-2', url: 'https://cdn.akamai.steamstatic.com/steam/apps/2348070/ss_f1fc8ee261a3feea9cf9fd3a93e4b911aa1ba011.jpg' },
  { name: 'dolls-nest-3', url: 'https://cdn.akamai.steamstatic.com/steam/apps/2348070/ss_15f8935bc54ac7e13457051bb1c771a5ad98cea5.jpg' }
];

// Combine all images
const allImages = [...gameImages, ...gameScreenshots];

// Directory to save images
const outputDir = path.resolve(__dirname, '../assets/images/games');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}`);
}

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(outputDir, `${filename}.jpg`);
    
    // Skip if file already exists
    if (fs.existsSync(fullPath)) {
      console.log(`File already exists: ${filename}.jpg`);
      return resolve();
    }
    
    const file = createWriteStream(fullPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}.jpg`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(fullPath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('Starting downloads...');
  
  for (const image of allImages) {
    try {
      await downloadImage(image.url, image.name);
    } catch (error) {
      console.error(`Error downloading ${image.name}:`, error.message);
    }
  }
  
  console.log('Download process completed!');
}

// Start downloading
downloadAllImages();