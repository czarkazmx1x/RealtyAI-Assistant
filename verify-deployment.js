#!/usr/bin/env node

/**
 * Railway Deployment Verification Script
 * 
 * This script checks if your application is properly deployed and running on Railway.
 * It tests the health endpoint and basic API functionality.
 * 
 * Usage:
 *   node verify-deployment.js https://your-railway-app-url.up.railway.app
 */

import fetch from 'node-fetch';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Please provide your Railway application URL');
  console.error('Example: node verify-deployment.js https://your-app-url.up.railway.app');
  process.exit(1);
}

const baseUrl = args[0].endsWith('/') ? args[0].slice(0, -1) : args[0];

async function checkEndpoint(endpoint, name) {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name}: OK (Status: ${response.status})`);
      return { success: true, data };
    } else {
      console.error(`❌ ${name}: Failed (Status: ${response.status})`);
      console.error(data);
      return { success: false, data };
    }
  } catch (error) {
    console.error(`❌ ${name}: Error - ${error.message}`);
    return { success: false, error };
  }
}

async function main() {
  console.log(`\n🚂 RAILWAY DEPLOYMENT VERIFICATION 🚂`);
  console.log(`Testing application at: ${baseUrl}\n`);
  
  // Check root endpoint
  const rootResult = await checkEndpoint('/', 'Root Endpoint');
  
  // Check health endpoint
  const healthResult = await checkEndpoint('/health', 'Health Endpoint');
  
  if (healthResult.success) {
    console.log('\nHealth Check Details:');
    console.log(`  Environment: ${healthResult.data.environment}`);
    console.log(`  Node Version: ${healthResult.data.nodeVersion || 'N/A'}`);
    console.log(`  Timestamp: ${healthResult.data.timestamp}`);
    console.log(`  Uptime: ${healthResult.data.uptime || 'N/A'}`);
  }
  
  // Check API endpoints
  console.log('\nChecking API endpoints...');
  await checkEndpoint('/api/property-description', 'Property Description API');
  
  console.log('\nVerification Complete!');
  
  if (rootResult.success && healthResult.success) {
    console.log('✅ Basic deployment verification passed!');
    console.log('\nNext steps:');
    console.log('1. Test your specific API endpoints');
    console.log('2. Check database connectivity');
    console.log('3. Monitor application logs in Railway dashboard');
  } else {
    console.log('❌ Deployment verification failed.');
    console.log('\nTroubleshooting steps:');
    console.log('1. Check Railway logs for errors');
    console.log('2. Verify environment variables are set correctly');
    console.log('3. Check database connection string');
    console.log('4. Ensure the app is binding to 0.0.0.0 and using the PORT environment variable');
  }
}

main().catch(error => {
  console.error('Verification script error:', error);
  process.exit(1);
});
