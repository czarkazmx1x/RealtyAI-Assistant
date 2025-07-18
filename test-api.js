// test-api.js
const fetch = require('node-fetch');

async function testBackendAPI() {
  console.log('Testing backend API...');
  
  // Test the test endpoint
  try {
    console.log('Testing /api/test endpoint...');
    const testResponse = await fetch('http://real_estate_backend:5000/api/test');
    const testData = await testResponse.json();
    console.log('Test endpoint response:', testData);
  } catch (error) {
    console.error('Error testing test endpoint:', error.message);
  }
  
  // Test getting properties
  try {
    console.log('\nTesting GET /api/properties endpoint...');
    const getResponse = await fetch('http://real_estate_backend:5000/api/properties');
    const properties = await getResponse.json();
    console.log(`Got ${properties.length} properties:`, properties.map(p => p.id));
  } catch (error) {
    console.error('Error getting properties:', error.message);
  }
  
  // Test creating a property
  try {
    console.log('\nTesting POST /api/properties endpoint...');
    const testProperty = {
      address: '123 Test St, Atlanta, GA',
      price: 350000,
      description: 'Test property created from API test script',
      property_type: 'House',
      bedrooms: 3,
      bathrooms: 2,
      image_urls: ['https://example.com/test-image.jpg']
    };
    
    const createResponse = await fetch('http://real_estate_backend:5000/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testProperty)
    });
    
    const newProperty = await createResponse.json();
    console.log('Created property:', newProperty);
  } catch (error) {
    console.error('Error creating property:', error.message);
  }
}

testBackendAPI();
