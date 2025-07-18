import { chromium } from 'playwright';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

/**
 * MCP Function: Post to Nextdoor using Playwright automation
 * Handles login, navigation, and posting with images
 */
export async function postToNextdoor(postData, imageUrls = []) {
  let browser;
  let page;
  
  try {
    console.log('🏠 Starting Nextdoor posting process...');
    
    // Launch browser
    browser = await chromium.launch({
      headless: false, // Set to true for production
      slowMo: 1000 // Slow down for reliability
    });
    
    page = await browser.newPage();
    
    // Set viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navigate to Nextdoor
    console.log('🌐 Navigating to Nextdoor...');
    await page.goto('https://nextdoor.com/login');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if already logged in
    const isLoggedIn = await checkIfLoggedIn(page);
    
    if (!isLoggedIn) {
      console.log('🔐 Logging in to Nextdoor...');
      await loginToNextdoor(page);
    } else {
      console.log('✅ Already logged in to Nextdoor');
    }
    
    // Navigate to create post
    console.log('✍️ Navigating to create post...');
    await navigateToCreatePost(page);
    
    // Create the post
    console.log('📝 Creating post...');
    const postResult = await createPost(page, postData, imageUrls);
    
    return postResult;
    
  } catch (error) {
    console.error('❌ Error posting to Nextdoor:', error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Check if user is already logged in to Nextdoor
 */
async function checkIfLoggedIn(page) {
  try {
    // Look for elements that indicate logged-in state
    const loggedInIndicators = [
      '[data-testid="profile-menu"]',
      '.profile-menu',
      '[aria-label="Profile"]',
      '.user-avatar'
    ];
    
    for (const selector of loggedInIndicators) {
      try {
        await page.waitForSelector(selector, { timeout: 3000 });
        return true;
      } catch (e) {
        // Continue to next selector
      }
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Login to Nextdoor using credentials from environment variables
 */
async function loginToNextdoor(page) {
  try {
    const email = process.env.NEXTDOOR_EMAIL;
    const password = process.env.NEXTDOOR_PASSWORD;
    
    if (!email || !password) {
      throw new Error('Nextdoor credentials not found in environment variables');
    }
    
    // Wait for login form
    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
    
    // Fill email
    await page.fill('input[type="email"], input[name="email"]', email);
    
    // Fill password
    await page.fill('input[type="password"], input[name="password"]', password);
    
    // Click login button
    await page.click('button[type="submit"], .login-button, [data-testid="login-button"]');
    
    // Wait for login to complete
    await page.waitForLoadState('networkidle');
    
    // Verify login success
    await page.waitForSelector('[data-testid="profile-menu"], .profile-menu', { timeout: 15000 });
    
    console.log('✅ Successfully logged in to Nextdoor');
    
  } catch (error) {
    console.error('❌ Login failed:', error);
    throw new Error(`Login failed: ${error.message}`);
  }
}

/**
 * Navigate to the create post page
 */
async function navigateToCreatePost(page) {
  try {
    // Try multiple ways to find the create post button
    const createPostSelectors = [
      '[data-testid="create-post-button"]',
      '.create-post-button',
      'button:has-text("Post")',
      'a[href*="post"]',
      '.post-button'
    ];
    
    let createPostButton = null;
    
    for (const selector of createPostSelectors) {
      try {
        createPostButton = await page.waitForSelector(selector, { timeout: 3000 });
        break;
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!createPostButton) {
      // Try navigating directly to post URL
      await page.goto('https://nextdoor.com/post');
      await page.waitForLoadState('networkidle');
    } else {
      await createPostButton.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Wait for post creation interface
    await page.waitForSelector('textarea, [contenteditable="true"], .post-textarea', { timeout: 10000 });
    
    console.log('✅ Navigated to create post page');
    
  } catch (error) {
    console.error('❌ Failed to navigate to create post:', error);
    throw error;
  }
}

/**
 * Create and submit the post
 */
async function createPost(page, postData, imageUrls) {
  try {
    // Find the post text area
    const textAreaSelectors = [
      'textarea[placeholder*="post"]',
      'textarea[placeholder*="share"]',
      '[contenteditable="true"]',
      '.post-textarea',
      'textarea'
    ];
    
    let textArea = null;
    for (const selector of textAreaSelectors) {
      try {
        textArea = await page.waitForSelector(selector, { timeout: 3000 });
        break;
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!textArea) {
      throw new Error('Could not find post text area');
    }
    
    // Clear and fill the post text
    await textArea.click();
    await textArea.fill('');
    await textArea.type(postData.post);
    
    console.log('📝 Post text entered');
    
    // Upload images if provided
    if (imageUrls && imageUrls.length > 0) {
      console.log(`📸 Uploading ${imageUrls.length} images...`);
      await uploadImagesToPost(page, imageUrls);
    }
    
    // Submit the post
    console.log('🚀 Submitting post...');
    await submitPost(page);
    
    // Wait for post to be published
    await page.waitForLoadState('networkidle');
    
    // Get the post URL
    const postUrl = await getPostUrl(page);
    
    console.log('✅ Post successfully published!');
    
    return {
      success: true,
      postUrl: postUrl,
      timestamp: new Date().toISOString(),
      postData: postData,
      imagesUsed: imageUrls
    };
    
  } catch (error) {
    console.error('❌ Failed to create post:', error);
    throw error;
  }
}

/**
 * Upload images to the post
 */
async function uploadImagesToPost(page, imageUrls) {
  try {
    // Find file input or image upload button
    const uploadSelectors = [
      'input[type="file"]',
      '[data-testid="image-upload"]',
      '.image-upload-button',
      'button:has-text("Photo")',
      'button:has-text("Image")'
    ];
    
    let uploadElement = null;
    for (const selector of uploadSelectors) {
      try {
        uploadElement = await page.waitForSelector(selector, { timeout: 3000 });
        break;
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!uploadElement) {
      console.warn('⚠️ Could not find image upload element');
      return;
    }
    
    // Upload each image
    for (let i = 0; i < Math.min(imageUrls.length, 3); i++) {
      const imageUrl = imageUrls[i];
      
      if (uploadElement.tagName === 'INPUT') {
        // File input
        await uploadElement.setInputFiles(imageUrl.originalPath || imageUrl.url);
      } else {
        // Click upload button and then set files
        await uploadElement.click();
        const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 5000 });
        await fileInput.setInputFiles(imageUrl.originalPath || imageUrl.url);
      }
      
      // Wait for upload to complete
      await page.waitForTimeout(2000);
      console.log(`✅ Uploaded image ${i + 1}`);
    }
    
  } catch (error) {
    console.error('❌ Failed to upload images:', error);
    // Continue without images rather than failing the entire post
  }
}

/**
 * Submit the post
 */
async function submitPost(page) {
  try {
    // Find submit button
    const submitSelectors = [
      'button[type="submit"]',
      '[data-testid="post-button"]',
      '.post-button',
      'button:has-text("Post")',
      'button:has-text("Share")'
    ];
    
    let submitButton = null;
    for (const selector of submitSelectors) {
      try {
        submitButton = await page.waitForSelector(selector, { timeout: 3000 });
        break;
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!submitButton) {
      throw new Error('Could not find submit button');
    }
    
    await submitButton.click();
    
  } catch (error) {
    console.error('❌ Failed to submit post:', error);
    throw error;
  }
}

/**
 * Get the URL of the published post
 */
async function getPostUrl(page) {
  try {
    // Wait a moment for the post to be published
    await page.waitForTimeout(3000);
    
    // Try to get the current URL or look for post URL indicators
    const currentUrl = page.url();
    
    // If we're on a post page, return the current URL
    if (currentUrl.includes('/post/') || currentUrl.includes('/p/')) {
      return currentUrl;
    }
    
    // Otherwise, try to find the post URL in the page
    const postUrlSelectors = [
      'a[href*="/post/"]',
      'a[href*="/p/"]',
      '[data-testid="post-link"]'
    ];
    
    for (const selector of postUrlSelectors) {
      try {
        const link = await page.waitForSelector(selector, { timeout: 5000 });
        const href = await link.getAttribute('href');
        if (href) {
          return href.startsWith('http') ? href : `https://nextdoor.com${href}`;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    // Fallback to current URL
    return currentUrl;
    
  } catch (error) {
    console.warn('⚠️ Could not get post URL:', error);
    return page.url();
  }
}

/**
 * MCP Function: Test Nextdoor connection
 * Verifies login credentials and connectivity
 */
export async function testNextdoorConnection() {
  let browser;
  let page;
  
  try {
    console.log('🔍 Testing Nextdoor connection...');
    
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    
    await page.goto('https://nextdoor.com/login');
    await page.waitForLoadState('networkidle');
    
    const email = process.env.NEXTDOOR_EMAIL;
    const password = process.env.NEXTDOOR_PASSWORD;
    
    if (!email || !password) {
      throw new Error('Nextdoor credentials not configured');
    }
    
    await page.fill('input[type="email"], input[name="email"]', email);
    await page.fill('input[type="password"], input[name="password"]', password);
    await page.click('button[type="submit"], .login-button');
    
    await page.waitForLoadState('networkidle');
    
    const isLoggedIn = await checkIfLoggedIn(page);
    
    return {
      success: isLoggedIn,
      message: isLoggedIn ? 'Connection successful' : 'Login failed'
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Export for MCP usage
export default {
  postToNextdoor,
  testNextdoorConnection
}; 