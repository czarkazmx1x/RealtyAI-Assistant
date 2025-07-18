import { v2 as cloudinary } from 'cloudinary';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Configure Cloudinary
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * MCP Function: Upload images to Cloudinary
 * Returns array of image URLs for posting
 */
export async function uploadImagesToCloudinary(imagePaths, listingAddress) {
  try {
    console.log('☁️ Uploading images to Cloudinary...');
    
    const uploadedUrls = [];
    
    for (let i = 0; i < imagePaths.length; i++) {
      const imagePath = imagePaths[i];
      
      if (!existsSync(imagePath)) {
        console.warn(`⚠️ Image not found: ${imagePath}`);
        continue;
      }

      console.log(`Uploading: ${imagePath}`);
      
      // Create unique folder name based on address
      const folderName = listingAddress.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: `real-estate/${folderName}`,
        public_id: `listing_${i + 1}`,
        transformation: [
          { width: 1200, height: 800, crop: 'fill' },
          { quality: 'auto' }
        ]
      });

      uploadedUrls.push({
        originalPath: imagePath,
        cloudinaryUrl: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height
      });

      console.log(`✅ Uploaded: ${result.secure_url}`);
    }

    return {
      success: true,
      urls: uploadedUrls,
      totalUploaded: uploadedUrls.length
    };

  } catch (error) {
    console.error('❌ Error uploading to Cloudinary:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * MCP Function: Upload images (Cloudinary only)
 * Simplified version that only uses Cloudinary
 */
export async function uploadImages(imagePaths, listingAddress) {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      throw new Error('Cloudinary credentials not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.');
    }

    console.log('📸 Using Cloudinary for image uploads');
    return await uploadImagesToCloudinary(imagePaths, listingAddress);

  } catch (error) {
    console.error('❌ Error in image upload:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * MCP Function: Get image URLs from local paths
 * Useful for testing with existing image URLs
 */
export async function getImageUrlsFromPaths(imagePaths) {
  try {
    console.log('🔗 Processing image paths...');
    
    const imageUrls = [];
    
    for (const imagePath of imagePaths) {
      if (existsSync(imagePath)) {
        // For local testing, return the path as-is
        // In production, this would upload and return URLs
        imageUrls.push({
          originalPath: imagePath,
          url: imagePath,
          type: 'local'
        });
      } else {
        console.warn(`⚠️ Image not found: ${imagePath}`);
      }
    }

    return {
      success: true,
      urls: imageUrls,
      totalProcessed: imageUrls.length
    };

  } catch (error) {
    console.error('❌ Error processing image paths:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export for MCP usage
export default {
  uploadImages,
  uploadImagesToCloudinary,
  getImageUrlsFromPaths
}; 