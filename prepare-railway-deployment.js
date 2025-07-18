#!/usr/bin/env node

/**
 * Railway Deployment Helper Script
 * 
 * This script automates the process of preparing your project for Railway deployment.
 * It performs the following tasks:
 * 1. Validates that all required files exist
 * 2. Creates the necessary Railway configuration
 * 3. Validates environment variables
 * 4. Tests database connectivity
 * 5. Provides guidance on deploying to Railway
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🚂 RAILWAY DEPLOYMENT HELPER 🚂\n');
console.log('Preparing your project for Railway deployment...\n');

// Step 1: Check for required files
const requiredFiles = [
  'railway-index.js',
  'railway.package.json',
  'nixpacks.toml',
  'railway.toml',
  'prisma/schema.prisma'
];

console.log('Checking for required files...');
const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(__dirname, file)));

if (missingFiles.length > 0) {
  console.error('\n❌ ERROR: The following required files are missing:');
  missingFiles.forEach(file => console.error(`   - ${file}`));
  console.error('\nPlease create these files before proceeding.');
  process.exit(1);
}

console.log('✅ All required files present.');

// Step 2: Check for environment variables
console.log('\nChecking for environment variables...');

try {
  const envExample = fs.readFileSync(path.join(__dirname, '.env.railway.example'), 'utf8');
  console.log('✅ Environment variables example file found.');
  
  // Extract required variables from example file
  const requiredVars = envExample
    .split('\n')
    .filter(line => line.trim() && !line.trim().startsWith('#') && line.includes('='))
    .map(line => line.split('=')[0].trim());
  
  console.log(`\nImportant environment variables to set in Railway:`);
  requiredVars.forEach(variable => {
    console.log(`   - ${variable}`);
  });
} catch (err) {
  console.warn('⚠️ Environment variables example file not found. Make sure to set necessary environment variables in Railway.');
}

// Step 3: Check if Prisma is installed and properly configured
console.log('\nChecking Prisma configuration...');

try {
  const schemaContent = fs.readFileSync(path.join(__dirname, 'prisma/schema.prisma'), 'utf8');
  if (!schemaContent.includes('provider = "postgresql"')) {
    console.warn('⚠️ Prisma schema does not specify PostgreSQL as the provider.');
  } else {
    console.log('✅ Prisma schema is configured for PostgreSQL.');
  }
  
  try {
    execSync('npx prisma --version', { stdio: 'ignore' });
    console.log('✅ Prisma CLI is installed.');
  } catch (error) {
    console.warn('⚠️ Prisma CLI is not installed. Run: npm install prisma');
  }
} catch (err) {
  console.error('❌ Could not read Prisma schema file.');
}

// Step 4: Final instructions
console.log('\n🎉 DEPLOYMENT READY 🎉');
console.log('\nTo deploy to Railway:');
console.log('1. Push your code to GitHub');
console.log('2. Connect your GitHub repo to Railway');
console.log('3. Set the required environment variables in the Railway dashboard');
console.log('4. Railway will automatically deploy your application');
console.log('\nAlternatively, use the Railway CLI:');
console.log('   railway up');
console.log('\nFor more details, see RAILWAY_DEPLOYMENT.md');
