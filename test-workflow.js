import RealEstateWorkflowOrchestrator from './workflow-orchestrator.js';
import { generateSinglePost } from './generate_post.mcp.js';
import { getImageUrlsFromPaths } from './upload_images.mcp.js';
import { testNextdoorConnection } from './post_to_nextdoor.mcp.js';
import { testGoogleSheetsConnection, setupTrackingSheets } from './log_post.mcp.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Comprehensive Test Suite for Real Estate Nextdoor Workflow
 * Tests each component individually before running the full workflow
 */
class WorkflowTester {
  constructor() {
    this.orchestrator = new RealEstateWorkflowOrchestrator();
    this.testResults = {
      environment: false,
      postGeneration: false,
      imageProcessing: false,
      nextdoorConnection: false,
      googleSheetsConnection: false,
      trackingSetup: false
    };
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🧪 Running Real Estate Workflow Tests...');
    console.log('=' .repeat(50));

    try {
      // Test 1: Environment Variables
      await this.testEnvironmentVariables();

      // Test 2: Post Generation
      await this.testPostGeneration();

      // Test 3: Image Processing
      await this.testImageProcessing();

      // Test 4: Nextdoor Connection
      await this.testNextdoorConnection();

      // Test 5: Google Sheets Connection
      await this.testGoogleSheetsConnection();

      // Test 6: Tracking Setup
      await this.testTrackingSetup();

      // Generate Test Report
      this.generateTestReport();

    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  /**
   * Test environment variables
   */
  async testEnvironmentVariables() {
    console.log('\n🔧 Testing Environment Variables...');
    
    const requiredVars = [
      'NEXTDOOR_EMAIL',
      'NEXTDOOR_PASSWORD',
      'OPENAI_API_KEY'
    ];

    const optionalVars = [
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'S3_BUCKET_NAME',
      'GOOGLE_SHEETS_CREDENTIALS_FILE',
      'GOOGLE_SHEETS_SPREADSHEET_ID'
    ];

    let missingRequired = [];
    let missingOptional = [];

    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        missingRequired.push(varName);
      }
    }

    for (const varName of optionalVars) {
      if (!process.env[varName]) {
        missingOptional.push(varName);
      }
    }

    if (missingRequired.length > 0) {
      console.log(`❌ Missing required environment variables: ${missingRequired.join(', ')}`);
      this.testResults.environment = false;
    } else {
      console.log('✅ All required environment variables are set');
      this.testResults.environment = true;
    }

    if (missingOptional.length > 0) {
      console.log(`⚠️ Missing optional environment variables: ${missingOptional.join(', ')}`);
    }

    return this.testResults.environment;
  }

  /**
   * Test post generation
   */
  async testPostGeneration() {
    console.log('\n🤖 Testing Post Generation...');
    
    try {
      const testListing = {
        address: '123 Test Street, Atlanta, GA',
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 1850,
        price: 495000,
        features: 'Modern kitchen, hardwood floors, backyard',
        neighborhood: 'Test Neighborhood'
      };

      const result = await generateSinglePost(testListing);
      
      if (result.success) {
        console.log('✅ Post generation successful');
        console.log(`📝 Generated post: ${result.post.substring(0, 100)}...`);
        this.testResults.postGeneration = true;
      } else {
        console.log(`❌ Post generation failed: ${result.error}`);
        this.testResults.postGeneration = false;
      }
    } catch (error) {
      console.log(`❌ Post generation error: ${error.message}`);
      this.testResults.postGeneration = false;
    }

    return this.testResults.postGeneration;
  }

  /**
   * Test image processing
   */
  async testImageProcessing() {
    console.log('\n📸 Testing Image Processing...');
    
    try {
      // Test with non-existent images (should handle gracefully)
      const testImagePaths = ['test-image-1.jpg', 'test-image-2.jpg'];
      
      const result = await getImageUrlsFromPaths(testImagePaths);
      
      if (result.success) {
        console.log('✅ Image processing successful');
        console.log(`📸 Processed ${result.totalProcessed} images`);
        this.testResults.imageProcessing = true;
      } else {
        console.log(`❌ Image processing failed: ${result.error}`);
        this.testResults.imageProcessing = false;
      }
    } catch (error) {
      console.log(`❌ Image processing error: ${error.message}`);
      this.testResults.imageProcessing = false;
    }

    return this.testResults.imageProcessing;
  }

  /**
   * Test Nextdoor connection
   */
  async testNextdoorConnection() {
    console.log('\n🏠 Testing Nextdoor Connection...');
    
    try {
      const result = await testNextdoorConnection();
      
      if (result.success) {
        console.log('✅ Nextdoor connection successful');
        this.testResults.nextdoorConnection = true;
      } else {
        console.log(`❌ Nextdoor connection failed: ${result.error}`);
        this.testResults.nextdoorConnection = false;
      }
    } catch (error) {
      console.log(`❌ Nextdoor connection error: ${error.message}`);
      this.testResults.nextdoorConnection = false;
    }

    return this.testResults.nextdoorConnection;
  }

  /**
   * Test Google Sheets connection
   */
  async testGoogleSheetsConnection() {
    console.log('\n📊 Testing Google Sheets Connection...');
    
    try {
      const result = await testGoogleSheetsConnection();
      
      if (result.success) {
        console.log('✅ Google Sheets connection successful');
        console.log(`📋 Connected to: ${result.spreadsheetTitle}`);
        this.testResults.googleSheetsConnection = true;
      } else {
        console.log(`❌ Google Sheets connection failed: ${result.error}`);
        this.testResults.googleSheetsConnection = false;
      }
    } catch (error) {
      console.log(`❌ Google Sheets connection error: ${error.message}`);
      this.testResults.googleSheetsConnection = false;
    }

    return this.testResults.googleSheetsConnection;
  }

  /**
   * Test tracking setup
   */
  async testTrackingSetup() {
    console.log('\n📋 Testing Tracking Setup...');
    
    try {
      const result = await setupTrackingSheets();
      
      if (result.success) {
        console.log('✅ Tracking setup successful');
        this.testResults.trackingSetup = true;
      } else {
        console.log(`❌ Tracking setup failed: ${result.error}`);
        this.testResults.trackingSetup = false;
      }
    } catch (error) {
      console.log(`❌ Tracking setup error: ${error.message}`);
      this.testResults.trackingSetup = false;
    }

    return this.testResults.trackingSetup;
  }

  /**
   * Generate test report
   */
  generateTestReport() {
    console.log('\n📊 Test Report');
    console.log('=' .repeat(50));
    
    const totalTests = Object.keys(this.testResults).length;
    const passedTests = Object.values(this.testResults).filter(Boolean).length;
    const failedTests = totalTests - passedTests;

    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    console.log('\nDetailed Results:');
    for (const [test, result] of Object.entries(this.testResults)) {
      const status = result ? '✅ PASS' : '❌ FAIL';
      console.log(`${test.padEnd(25)} ${status}`);
    }

    if (failedTests === 0) {
      console.log('\n🎉 All tests passed! Your workflow is ready to run.');
      console.log('\nNext steps:');
      console.log('1. Prepare your CSV file with listing data');
      console.log('2. Add listing images (optional)');
      console.log('3. Run: node workflow-orchestrator.js run your-listings.csv');
    } else {
      console.log('\n⚠️ Some tests failed. Please fix the issues before running the workflow.');
      console.log('\nCommon fixes:');
      console.log('- Check your .env file configuration');
      console.log('- Verify API keys and credentials');
      console.log('- Ensure Google Sheets API is enabled');
      console.log('- Test Nextdoor login manually');
    }
  }

  /**
   * Test with sample CSV
   */
  async testWithSampleCSV() {
    console.log('\n📊 Testing with Sample CSV...');
    
    try {
      const result = await this.orchestrator.runCompleteWorkflow('./sample_listings.csv');
      
      if (result.success) {
        console.log('✅ Sample workflow completed successfully!');
        console.log(`📈 Summary: ${JSON.stringify(result.summary, null, 2)}`);
      } else {
        console.log(`❌ Sample workflow failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ Sample workflow error: ${error.message}`);
    }
  }
}

/**
 * CLI Interface
 */
async function main() {
  const tester = new WorkflowTester();
  
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'all':
      await tester.runAllTests();
      break;
      
    case 'sample':
      await tester.testWithSampleCSV();
      break;
      
    default:
      console.log('🧪 Real Estate Workflow Test Suite');
      console.log('=' .repeat(50));
      console.log('Commands:');
      console.log('  all     - Run all tests');
      console.log('  sample  - Test with sample CSV');
      console.log('');
      console.log('Example:');
      console.log('  node test-workflow.js all');
      break;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default WorkflowTester; 