import { generatePostFromCSV, generateSinglePost } from './generate_post.mcp.js';
import { uploadImages, getImageUrlsFromPaths } from './upload_images.mcp.js';
import { postToNextdoor, testNextdoorConnection } from './post_to_nextdoor.mcp.js';
import { logPostToSheets, setupTrackingSheets, getPostStatistics } from './log_post.mcp.js';
import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';

dotenv.config();

/**
 * Main Workflow Orchestrator for Real Estate Nextdoor Automation
 * Coordinates all MCP functions in the correct sequence
 */
class RealEstateWorkflowOrchestrator {
  constructor() {
    this.results = {
      postsGenerated: [],
      imagesUploaded: [],
      postsPublished: [],
      logsCreated: []
    };
  }

  /**
   * Complete workflow: CSV → Generate Posts → Upload Images → Post → Log
   */
  async runCompleteWorkflow(csvFilePath, imagePaths = []) {
    console.log('🚀 Starting Real Estate Nextdoor Workflow...');
    console.log('=' .repeat(50));

    try {
      // Step 1: Generate posts from CSV
      console.log('\n📊 STEP 1: Generating posts from CSV...');
      const postsResult = await this.generatePostsFromCSV(csvFilePath);
      
      if (!postsResult.success) {
        throw new Error(`Failed to generate posts: ${postsResult.error}`);
      }

      // Step 2: Upload images (if provided)
      let imageUrls = [];
      if (imagePaths && imagePaths.length > 0) {
        console.log('\n📸 STEP 2: Uploading images...');
        const uploadResult = await this.uploadListingImages(imagePaths, postsResult.posts[0]?.address || 'listing');
        
        if (uploadResult.success) {
          imageUrls = uploadResult.urls;
        } else {
          console.warn('⚠️ Image upload failed, continuing without images');
        }
      }

      // Step 3: Setup tracking sheets
      console.log('\n📋 STEP 3: Setting up tracking sheets...');
      await this.setupTracking();

      // Step 4: Post each listing to Nextdoor
      console.log('\n🏠 STEP 4: Posting to Nextdoor...');
      for (let i = 0; i < postsResult.posts.length; i++) {
        const postData = postsResult.posts[i];
        
        console.log(`\n📝 Posting listing ${i + 1}/${postsResult.posts.length}: ${postData.address}`);
        
        // Use images for this specific listing if available
        const listingImages = imageUrls.filter(img => 
          img.originalPath && img.originalPath.includes(postData.address.replace(/[^a-zA-Z0-9]/g, '_'))
        );
        
        const postResult = await this.postListingToNextdoor(postData, listingImages);
        
        if (postResult.success) {
          // Step 5: Log the post
          console.log('\n📊 STEP 5: Logging post results...');
          await this.logPostResults(postResult);
        }
        
        // Add delay between posts to avoid rate limiting
        if (i < postsResult.posts.length - 1) {
          const delayMinutes = parseInt(process.env.POST_DELAY_MINUTES) || 30;
          console.log(`\n⏰ Waiting ${delayMinutes} minutes before next post...`);
          await this.delay(delayMinutes * 60 * 1000);
        }
      }

      // Step 6: Generate summary
      console.log('\n📈 STEP 6: Generating workflow summary...');
      const summary = await this.generateWorkflowSummary();

      console.log('\n✅ Workflow completed successfully!');
      console.log('=' .repeat(50));
      
      return {
        success: true,
        summary,
        results: this.results
      };

    } catch (error) {
      console.error('\n❌ Workflow failed:', error);
      return {
        success: false,
        error: error.message,
        results: this.results
      };
    }
  }

  /**
   * Generate posts from CSV data
   */
  async generatePostsFromCSV(csvFilePath) {
    try {
      if (!existsSync(csvFilePath)) {
        throw new Error(`CSV file not found: ${csvFilePath}`);
      }

      const result = await generatePostFromCSV(csvFilePath);
      
      if (result.success) {
        this.results.postsGenerated = result.posts;
        console.log(`✅ Generated ${result.totalProcessed} posts`);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error generating posts:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Upload images for listings
   */
  async uploadListingImages(imagePaths, listingAddress) {
    try {
      const result = await uploadImages(imagePaths, listingAddress);
      
      if (result.success) {
        this.results.imagesUploaded = result.urls;
        console.log(`✅ Uploaded ${result.totalUploaded} images`);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error uploading images:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Setup tracking sheets
   */
  async setupTracking() {
    try {
      const result = await setupTrackingSheets();
      
      if (result.success) {
        console.log('✅ Tracking sheets setup complete');
      } else {
        console.warn('⚠️ Tracking sheets setup failed:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error setting up tracking:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Post a single listing to Nextdoor
   */
  async postListingToNextdoor(postData, imageUrls) {
    try {
      const result = await postToNextdoor(postData, imageUrls);
      
      if (result.success) {
        this.results.postsPublished.push(result);
        console.log(`✅ Posted successfully: ${result.postUrl}`);
      } else {
        console.error(`❌ Failed to post: ${result.error}`);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error posting to Nextdoor:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Log post results to Google Sheets
   */
  async logPostResults(postResult) {
    try {
      const result = await logPostToSheets(postResult);
      
      if (result.success) {
        this.results.logsCreated.push(result);
        console.log('✅ Post logged to Google Sheets');
      } else {
        console.warn('⚠️ Failed to log post:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error logging post:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate workflow summary
   */
  async generateWorkflowSummary() {
    try {
      const stats = await getPostStatistics();
      
      const summary = {
        totalPostsGenerated: this.results.postsGenerated.length,
        totalImagesUploaded: this.results.imagesUploaded.length,
        totalPostsPublished: this.results.postsPublished.length,
        totalLogsCreated: this.results.logsCreated.length,
        statistics: stats.success ? stats.statistics : null,
        timestamp: new Date().toISOString()
      };

      console.log('\n📊 Workflow Summary:');
      console.log(`- Posts Generated: ${summary.totalPostsGenerated}`);
      console.log(`- Images Uploaded: ${summary.totalImagesUploaded}`);
      console.log(`- Posts Published: ${summary.totalPostsPublished}`);
      console.log(`- Logs Created: ${summary.totalLogsCreated}`);
      
      if (summary.statistics) {
        console.log(`- Total Posts (All Time): ${summary.statistics.totalPosts}`);
        console.log(`- Posts This Month: ${summary.statistics.thisMonth}`);
        console.log(`- Posts This Week: ${summary.statistics.thisWeek}`);
        console.log(`- Avg Images Per Post: ${summary.statistics.averageImagesPerPost}`);
      }

      return summary;
    } catch (error) {
      console.error('❌ Error generating summary:', error);
      return { error: error.message };
    }
  }

  /**
   * Test all connections
   */
  async testConnections() {
    console.log('🔍 Testing all connections...');
    
    const tests = {
      nextdoor: await testNextdoorConnection(),
      sheets: await this.testGoogleSheetsConnection()
    };

    console.log('\n📋 Connection Test Results:');
    console.log(`- Nextdoor: ${tests.nextdoor.success ? '✅' : '❌'} ${tests.nextdoor.message || tests.nextdoor.error}`);
    console.log(`- Google Sheets: ${tests.sheets.success ? '✅' : '❌'} ${tests.sheets.message || tests.sheets.error}`);

    return tests;
  }

  /**
   * Test Google Sheets connection
   */
  async testGoogleSheetsConnection() {
    try {
      const { testGoogleSheetsConnection } = await import('./log_post.mcp.js');
      return await testGoogleSheetsConnection();
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Utility function for delays
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * CLI Interface
 */
async function main() {
  const orchestrator = new RealEstateWorkflowOrchestrator();
  
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'test':
      await orchestrator.testConnections();
      break;
      
    case 'run':
      const csvFile = args[1];
      const imagePaths = args.slice(2);
      
      if (!csvFile) {
        console.error('❌ Please provide a CSV file path');
        console.log('Usage: node workflow-orchestrator.js run <csv-file> [image1] [image2] ...');
        process.exit(1);
      }
      
      await orchestrator.runCompleteWorkflow(csvFile, imagePaths);
      break;
      
    case 'stats':
      const summary = await orchestrator.generateWorkflowSummary();
      console.log(JSON.stringify(summary, null, 2));
      break;
      
    default:
      console.log('🏠 Real Estate Nextdoor Workflow Orchestrator');
      console.log('=' .repeat(50));
      console.log('Commands:');
      console.log('  test                    - Test all connections');
      console.log('  run <csv> [images...]   - Run complete workflow');
      console.log('  stats                   - Show workflow statistics');
      console.log('');
      console.log('Example:');
      console.log('  node workflow-orchestrator.js run listings.csv image1.jpg image2.jpg');
      break;
  }
}

// Export for MCP usage
export default RealEstateWorkflowOrchestrator;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
} 