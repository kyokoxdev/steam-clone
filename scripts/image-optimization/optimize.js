/**
 * Steam Clone - Image Optimization Pipeline
 * This script processes images for the website, creating optimized versions
 * in multiple formats and resolutions for responsive delivery.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const glob = require('glob');

// Configuration
const config = {
  // Source directory for original images
  sourceDir: path.resolve(__dirname, '../../assets/images/originals'),
  
  // Target directory for optimized images
  targetDir: path.resolve(__dirname, '../../assets/images/optimized'),
  
  // Placeholder directory
  placeholderDir: path.resolve(__dirname, '../../assets/images/placeholders'),
  
  // Image formats to generate
  formats: [
    { extension: 'webp', quality: 80 },
    { extension: 'jpg', quality: 85 },
    { extension: 'avif', quality: 70 } // Higher compression, newer format
  ],
  
  // Breakpoints for responsive images
  breakpoints: {
    small: 576,    // Small mobile
    medium: 768,   // Tablet/large mobile
    large: 992,    // Laptop
    xlarge: 1200,  // Desktop
    xxlarge: 1600  // Large desktop / ultrawide
  },
  
  // Art direction presets for different image types
  artDirectionSets: {
    'game-banner': {
      small: { width: 400, height: 150, crop: 'center' },
      medium: { width: 768, height: 250, crop: 'center' },
      large: { width: 1200, height: 300, crop: 'center' },
      xlarge: { width: 1600, height: 400, crop: 'center' }
    },
    'game-card': {
      small: { width: 300, height: 200, crop: 'center' },
      medium: { width: 320, height: 200, crop: 'center' },
      large: { width: 280, height: 180, crop: 'center' },
      xlarge: { width: 300, height: 200, crop: 'center' },
      xxlarge: { width: 320, height: 220, crop: 'center' }
    },
    'game-screenshot': {
      small: { width: 400, height: 225, crop: 'center' },
      medium: { width: 600, height: 338, crop: 'center' },
      large: { width: 800, height: 450, crop: 'center' },
      xlarge: { width: 1200, height: 675, crop: 'center' },
      xxlarge: { width: 1600, height: 900, crop: 'center' }
    },
    'game-detail-header': {
      small: { width: 576, height: 200, crop: 'center' },
      medium: { width: 768, height: 250, crop: 'center' },
      large: { width: 992, height: 300, crop: 'center' },
      xlarge: { width: 1400, height: 400, crop: 'center' },
      xxlarge: { width: 1800, height: 450, crop: 'center' }
    },
    'profile-avatar': {
      small: { width: 64, height: 64, crop: 'circle' },
      medium: { width: 96, height: 96, crop: 'circle' },
      large: { width: 128, height: 128, crop: 'circle' },
      xlarge: { width: 160, height: 160, crop: 'circle' }
    }
  },
  
  // Pixel densities to account for high-DPI screens
  pixelDensities: [1, 2]
};

// Setup directories
function setupDirectories() {
  // Create target directory if it doesn't exist
  if (!fs.existsSync(config.targetDir)) {
    fs.mkdirSync(config.targetDir, { recursive: true });
  }
  
  // Create placeholder directory if it doesn't exist
  if (!fs.existsSync(config.placeholderDir)) {
    fs.mkdirSync(config.placeholderDir, { recursive: true });
  }
  
  // Create type-specific subdirectories
  Object.keys(config.artDirectionSets).forEach(type => {
    const typeDir = path.join(config.targetDir, type);
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }
  });
  
  // Create source directory structure if it doesn't exist
  if (!fs.existsSync(config.sourceDir)) {
    fs.mkdirSync(config.sourceDir, { recursive: true });
    
    // Create subdirectories for each image type
    Object.keys(config.artDirectionSets).forEach(type => {
      const typeDir = path.join(config.sourceDir, type);
      if (!fs.existsSync(typeDir)) {
        fs.mkdirSync(typeDir, { recursive: true });
      }
    });
  }
}

// Get all image files from the source directory
function getImageFiles() {
  return glob.sync(path.join(config.sourceDir, '**/*.{jpg,jpeg,png}'));
}

// Determine image type based on path
function getImageType(imagePath) {
  // Extract the directory name, which should match the art direction set
  const pathParts = imagePath.split(path.sep);
  const sourceIndex = pathParts.indexOf('originals');
  
  if (sourceIndex !== -1 && pathParts.length > sourceIndex + 1) {
    const type = pathParts[sourceIndex + 1];
    
    // Check if this is a valid art direction type
    if (config.artDirectionSets[type]) {
      return type;
    }
  }
  
  // Default to game-card if not found or invalid
  return 'game-card';
}

// Create placeholder images
async function createPlaceholders() {
  console.log('Creating placeholder images...');
  
  // Create loading placeholder (simple SVG)
  const loadingSvg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1a2233"/>
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#66c0f4" text-anchor="middle">Loading...</text>
      <circle cx="200" cy="150" r="20" fill="none" stroke="#66c0f4" stroke-width="4">
        <animate attributeName="r" from="20" to="40" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite"/>
      </circle>
    </svg>
  `;
  
  fs.writeFileSync(path.join(config.placeholderDir, 'loading.svg'), loadingSvg);
  
  // Create error placeholder (simple SVG)
  const errorSvg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#2a3f5f"/>
      <text x="50%" y="45%" font-family="Arial" font-size="24" fill="#c7d5e0" text-anchor="middle">Image Not Found</text>
      <text x="50%" y="55%" font-family="Arial" font-size="16" fill="#8ba3bd" text-anchor="middle">Please try again later</text>
      <path d="M180,120 l40,40 m0,-40 l-40,40" stroke="#c7d5e0" stroke-width="8"/>
    </svg>
  `;
  
  fs.writeFileSync(path.join(config.placeholderDir, 'error.svg'), errorSvg);
  
  console.log('Placeholders created successfully.');
}

// Process a single image file
async function processImage(imagePath) {
  try {
    // Get file information
    const filename = path.basename(imagePath, path.extname(imagePath));
    const imageType = getImageType(imagePath);
    
    console.log(`Processing ${filename} as ${imageType}...`);
    
    // Load the image
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    // Process each breakpoint
    for (const [breakpoint, dimensions] of Object.entries(config.artDirectionSets[imageType])) {
      // Process each pixel density
      for (const density of config.pixelDensities) {
        // Calculate dimensions for this density
        const width = dimensions.width * density;
        const height = dimensions.height * density;
        
        // Process each format
        for (const format of config.formats) {
          // Create the output path
          const outputFilename = `${filename}_${breakpoint}_${width}x${height}.${format.extension}`;
          const outputPath = path.join(config.targetDir, imageType, outputFilename);
          
          // Skip if the file already exists (uncomment to enable skipping)
          // if (fs.existsSync(outputPath)) continue;
          
          // Apply transformations
          let processedImage = image.clone();
          
          if (dimensions.crop === 'circle') {
            // Create circular image with transparent background for avatars
            const size = Math.min(width, height);
            processedImage = processedImage
              .resize(size, size, { fit: 'cover' })
              .composite([{
                input: Buffer.from(`
                  <svg width="${size}" height="${size}">
                    <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/>
                  </svg>`
                ),
                blend: 'dest-in'
              }]);
          } else {
            // Normal resizing with crop if needed
            processedImage = processedImage.resize({
              width,
              height,
              fit: 'cover',
              position: dimensions.crop
            });
          }
          
          // Convert to the desired format with compression
          switch (format.extension) {
            case 'webp':
              await processedImage
                .webp({ quality: format.quality })
                .toFile(outputPath);
              break;
            case 'jpg':
              await processedImage
                .jpeg({ quality: format.quality })
                .toFile(outputPath);
              break;
            case 'avif':
              await processedImage
                .avif({ quality: format.quality })
                .toFile(outputPath);
              break;
          }
          
          console.log(`Created ${outputFilename}`);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
    return false;
  }
}

// Generate a manifest JSON file that maps original images to their optimized versions
function generateManifest() {
  console.log('Generating image manifest...');
  
  const manifest = {};
  
  // Scan the optimized directory
  Object.keys(config.artDirectionSets).forEach(type => {
    manifest[type] = {};
    
    const typeDir = path.join(config.targetDir, type);
    if (fs.existsSync(typeDir)) {
      const files = fs.readdirSync(typeDir);
      
      // Group files by original filename
      files.forEach(file => {
        // Extract the original filename from the optimized filename
        const parts = file.split('_');
        if (parts.length >= 3) {
          const originalName = parts[0];
          const breakpoint = parts[1];
          const sizeParts = parts[2].split('.');
          const format = sizeParts[sizeParts.length - 1];
          
          // Initialize entry if needed
          if (!manifest[type][originalName]) {
            manifest[type][originalName] = {
              breakpoints: {}
            };
          }
          
          // Initialize breakpoint if needed
          if (!manifest[type][originalName].breakpoints[breakpoint]) {
            manifest[type][originalName].breakpoints[breakpoint] = {};
          }
          
          // Add format entry
          if (!manifest[type][originalName].breakpoints[breakpoint][format]) {
            manifest[type][originalName].breakpoints[breakpoint][format] = file;
          }
        }
      });
    }
  });
  
  // Write the manifest to a JSON file
  const manifestPath = path.join(config.targetDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`Manifest generated at ${manifestPath}`);
}

// Main function to run the optimization process
async function main() {
  try {
    console.log('Starting image optimization pipeline...');
    
    // Setup directory structure
    setupDirectories();
    
    // Create placeholder images
    await createPlaceholders();
    
    // Get all image files
    const imageFiles = getImageFiles();
    console.log(`Found ${imageFiles.length} images to process.`);
    
    // Process each image
    let successful = 0;
    let failed = 0;
    
    for (let i = 0; i < imageFiles.length; i++) {
      const success = await processImage(imageFiles[i]);
      if (success) {
        successful++;
      } else {
        failed++;
      }
      
      // Log progress
      console.log(`Progress: ${i + 1}/${imageFiles.length} (${successful} successful, ${failed} failed)`);
    }
    
    // Generate manifest
    generateManifest();
    
    console.log('Optimization complete!');
    console.log(`Processed ${successful} images successfully. ${failed} images failed.`);
  } catch (error) {
    console.error('Error in optimization process:', error);
  }
}

// Run the main function
main();