// Image optimization script
// Requires Node.js v14.8.0 or higher for ES modules support

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sharp from 'sharp';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

// Get current file's directory (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Base directory where images are stored
const imageDir = path.resolve(__dirname, '../assets/images');
const outputDir = path.resolve(__dirname, '../assets/images/optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to compress images with sharp
async function compressImages() {
  console.log('Compressing images...');
  
  // Get all image files from the directory
  const files = fs.readdirSync(imageDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
  });

  for (const file of files) {
    const inputPath = path.join(imageDir, file);
    const outputPath = path.join(outputDir, file);
    
    // Skip directories
    if (fs.statSync(inputPath).isDirectory()) continue;

    try {
      // Compress and resize the image
      await sharp(inputPath)
        .resize({ width: 1200, withoutEnlargement: true }) // Limit max width
        .jpeg({ quality: 80 }) // Reduce quality for JPEGs
        .png({ quality: 80 }) // Reduce quality for PNGs
        .toFile(outputPath);
      
      console.log(`Compressed: ${file}`);
    } catch (error) {
      console.error(`Error compressing ${file}:`, error);
    }
  }
}

// Function to convert images to WebP
async function convertToWebP() {
  console.log('Converting images to WebP...');
  
  try {
    const files = await imagemin([`${outputDir}/*.{jpg,jpeg,png}`], {
      destination: outputDir,
      plugins: [
        imageminWebp({ quality: 75 })
      ]
    });
    
    console.log(`${files.length} images converted to WebP format`);
  } catch (error) {
    console.error('Error converting to WebP:', error);
  }
}

// Function to generate responsive image sets
async function generateResponsiveSizes() {
  console.log('Generating responsive image sizes...');
  
  const files = fs.readdirSync(outputDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext);
  });

  // Different image sizes for responsive images
  const sizes = [320, 640, 960, 1280];

  for (const file of files) {
    const inputPath = path.join(outputDir, file);
    const filename = path.basename(file, path.extname(file));
    
    // Skip directories
    if (fs.statSync(inputPath).isDirectory()) continue;
    
    for (const size of sizes) {
      try {
        const outputPath = path.join(outputDir, `${filename}-${size}${path.extname(file)}`);
        
        await sharp(inputPath)
          .resize({ width: size, withoutEnlargement: true })
          .toFile(outputPath);
          
        // Also create WebP version
        await sharp(inputPath)
          .resize({ width: size, withoutEnlargement: true })
          .webp({ quality: 75 })
          .toFile(path.join(outputDir, `${filename}-${size}.webp`));
        
        console.log(`Created ${size}px version of ${file}`);
      } catch (error) {
        console.error(`Error creating responsive size for ${file}:`, error);
      }
    }
  }
}

// Run all optimization tasks
async function optimizeImages() {
  try {
    await compressImages();
    await convertToWebP();
    await generateResponsiveSizes();
    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Error during image optimization:', error);
  }
}

optimizeImages();