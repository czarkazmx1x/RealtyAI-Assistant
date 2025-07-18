import dotenv from 'dotenv';
import { existsSync } from 'fs';

dotenv.config();

console.log('🔍 Quick Error Check...\n');

// Check 1: Environment variables
console.log('1. Checking environment variables...');
const requiredVars = ['NEXTDOOR_EMAIL', 'NEXTDOOR_PASSWORD', 'OPENAI_API_KEY'];
const optionalVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
let missingVars = [];
let missingOptional = [];

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
}

for (const varName of optionalVars) {
  if (!process.env[varName]) {
    missingOptional.push(varName);
  }
}

if (missingVars.length > 0) {
  console.log(`❌ Missing required: ${missingVars.join(', ')}`);
  console.log('💡 Create a .env file with your credentials');
} else {
  console.log('✅ Required environment variables found');
}

if (missingOptional.length > 0) {
  console.log(`⚠️ Missing optional (Cloudinary): ${missingOptional.join(', ')}`);
  console.log('💡 Add Cloudinary credentials for image uploads');
} else {
  console.log('✅ Cloudinary credentials found');
}

// Check 2: Required files
console.log('\n2. Checking required files...');
const requiredFiles = [
  'workflow-orchestrator.js',
  'generate_post.mcp.js',
  'post_to_nextdoor.mcp.js',
  'log_post.mcp.js',
  'upload_images.mcp.js',
  'sample_listings.csv'
];

for (const file of requiredFiles) {
  if (existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
  }
}

// Check 3: Dependencies
console.log('\n3. Checking dependencies...');
try {
  const { parse } = await import('csv-parse/sync');
  console.log('✅ csv-parse');
} catch (e) {
  console.log('❌ csv-parse not installed');
}

try {
  const OpenAI = await import('openai');
  console.log('✅ openai');
} catch (e) {
  console.log('❌ openai not installed');
}

try {
  const { chromium } = await import('playwright');
  console.log('✅ playwright');
} catch (e) {
  console.log('❌ playwright not installed');
}

try {
  const cloudinary = await import('cloudinary');
  console.log('✅ cloudinary');
} catch (e) {
  console.log('❌ cloudinary not installed');
}

console.log('\n🎯 Next Steps:');
if (missingVars.length > 0) {
  console.log('1. Create .env file: copy env.example .env');
  console.log('2. Add your credentials to .env');
}
console.log('3. Run: npm test');
console.log('4. Run: npm start'); 