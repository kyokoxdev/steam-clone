const fs = require('fs');
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

// List of games that need placeholder screenshots
const games = [
  'v-rising',
  'magic-rune-stone',
  'world-of-goo-2',
  'monster-prom-4',
  'tempest-rising',
  'spellrogue',
  'bokura-planet',
  'clair-obscur',
  'fatal-fury',
  'hundred-line',
  'dolls-nest'
];

// Unsplash collection IDs for gaming-related images
const gamingKeywords = [
  'gaming',
  'video-game',
  'game-art',
  'fantasy',
  'sci-fi',
  'rpg',
  'action-game',
  'adventure-game'
];

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

// Generate Unsplash image URLs based on keywords
function getUnsplashUrls(keyword, count = 1, width = 1280, height = 720) {
  const urls = [];
  for (let i = 0; i < count; i++) {
    // Use Unsplash source for random images with a specific keyword
    urls.push(`https://source.unsplash.com/featured/?${keyword}&sig=${Math.random()}`);
  }
  return urls;
}

// Download game screenshots
async function downloadGameScreenshots() {
  console.log('Starting downloads for game screenshots...');
  
  // For each game
  for (const game of games) {
    // For screenshots 1-3
    for (let i = 1; i <= 3; i++) {
      const screenshotName = `${game}-${i}`;
      const fullPath = path.join(outputDir, `${screenshotName}.jpg`);
      
      // Skip if file already exists
      if (fs.existsSync(fullPath)) {
        console.log(`Screenshot already exists: ${screenshotName}.jpg`);
        continue;
      }
      
      // Get a random gaming keyword
      const keyword = gamingKeywords[Math.floor(Math.random() * gamingKeywords.length)];
      const url = getUnsplashUrls(keyword)[0];
      
      try {
        await downloadImage(url, screenshotName);
        // Add a small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error downloading ${screenshotName}:`, error.message);
      }
    }
  }
  
  console.log('Screenshot download process completed!');
}

// Download missing header images
async function downloadMissingHeaders() {
  console.log('Starting downloads for missing header images...');
  
  for (const game of games) {
    const fullPath = path.join(outputDir, `${game}.jpg`);
    
    // Skip if file already exists
    if (fs.existsSync(fullPath)) {
      console.log(`Header already exists: ${game}.jpg`);
      continue;
    }
    
    // Get a random gaming keyword
    const keyword = gamingKeywords[Math.floor(Math.random() * gamingKeywords.length)];
    const url = getUnsplashUrls(keyword)[0];
    
    try {
      await downloadImage(url, game);
      // Add a small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error downloading ${game}:`, error.message);
    }
  }
  
  console.log('Header download process completed!');
}

// Start downloading
async function downloadAllImages() {
  await downloadMissingHeaders();
  await downloadGameScreenshots();
  console.log('All downloads completed!');
}

downloadAllImages();