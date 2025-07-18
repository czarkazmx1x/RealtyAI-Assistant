
const fetch = require('node-fetch');

async function testApiCall() {
  try {
    const response = await fetch('http://localhost:5000/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: "Test Address",
        price: 100000,
        description: "Test Description",
        property_type: "House",
        bedrooms: 3,
        bathrooms: 2,
        image_urls: ["https://example.com/test.jpg"]
      }),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testApiCall();
