/**
 * Image Optimization Pipeline
 * 
 * This utility script helps convert and optimize images for the responsive image system.
 * It creates:
 * 1. Multiple resolution variants of each image
 * 2. WebP and AVIF format conversions with fallbacks
 * 3. Art direction variants for different screen sizes
 * 
 * Usage:
 * - Place images in the 'source-images' directory
 * - Run this script with Node.js
 * - Optimized images will be output to the 'images' directory
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Configuration
const config = {
  sourceDir: 'source-images',
  outputDir: 'images',
  resolutions: [320, 640, 960, 1280, 1920, 2560],
  formats: ['webp', 'avif', 'jpg'],
  artDirectionVariants: {
    mobile: { width: 640, height: 360 },
    tablet: { width: 1280, height: 720 },
    desktop: { width: 1920, height: 1080 }
  },
  quality: {
    webp: 80,
    avif: 70,
    jpg: 85
  }
};

// Create output directory if it doesn't exist
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Process all images in the source directory
function processImages() {
  // First, check if Sharp is installed (required for image processing)
  try {
    require.resolve('sharp');
    console.log('Sharp module found, proceeding with image optimization...');
  } catch (e) {
    console.error('Error: Sharp module not found. Please install it with:');
    console.error('npm install sharp');
    process.exit(1);
  }

  const sharp = require('sharp');
  
  console.log('Starting image optimization pipeline...');
  console.log(`Source directory: ${config.sourceDir}`);
  console.log(`Output directory: ${config.outputDir}`);
  
  const files = fs.readdirSync(config.sourceDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
  });
  
  console.log(`Found ${imageFiles.length} images to process`);
  
  // Process each image
  for (const file of imageFiles) {
    const filePath = path.join(config.sourceDir, file);
    const fileName = path.basename(file, path.extname(file));
    
    console.log(`Processing ${file}...`);
    
    // Create different resolutions
    for (const width of config.resolutions) {
      const image = sharp(filePath);
      
      // Resize image
      image.resize({
        width,
        withoutEnlargement: true
      });
      
      // Output each format
      for (const format of config.formats) {
        const outputFile = path.join(
          config.outputDir, 
          `${fileName}-${width}.${format}`
        );
        
        // Apply format-specific options
        if (format === 'webp') {
          image.webp({ quality: config.quality.webp });
        } else if (format === 'avif') {
          image.avif({ quality: config.quality.avif });
        } else {
          image.jpeg({ quality: config.quality.jpg });
        }
        
        // Save the file
        image.toFile(outputFile, (err, info) => {
          if (err) {
            console.error(`Error processing ${file} to ${format}:`, err);
          } else {
            console.log(`Created ${outputFile} (${info.width}x${info.height}, ${info.size} bytes)`);
          }
        });
      }
    }
    
    // Create art direction variants
    for (const [variant, dimensions] of Object.entries(config.artDirectionVariants)) {
      const { width, height } = dimensions;
      const image = sharp(filePath);
      
      // Resize and crop for art direction
      image.resize({
        width,
        height,
        fit: 'cover',
        position: 'center'
      });
      
      // Output each format
      for (const format of config.formats) {
        const outputFile = path.join(
          config.outputDir, 
          `${fileName}-${variant}.${format}`
        );
        
        // Apply format-specific options
        if (format === 'webp') {
          image.webp({ quality: config.quality.webp });
        } else if (format === 'avif') {
          image.avif({ quality: config.quality.avif });
        } else {
          image.jpeg({ quality: config.quality.jpg });
        }
        
        // Save the file
        image.toFile(outputFile, (err, info) => {
          if (err) {
            console.error(`Error processing ${file} to ${variant} ${format}:`, err);
          } else {
            console.log(`Created ${outputFile} (${info.width}x${info.height}, ${info.size} bytes)`);
          }
        });
      }
    }
  }
}

// Execute the processing
processImages();

console.log('Image optimization complete!');
console.log('To use these images with the responsive image system:');
console.log('1. Use data-src attribute instead of src');
console.log('2. Add data-src-mobile, data-src-tablet, and data-src-desktop for art direction');
console.log('3. For multiple resolutions, use {width} in the file path, e.g., "images/game-{width}.jpg"');