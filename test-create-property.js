
const fetch = require('node-fetch');

async function testCreateProperty() {
  try {
    const testProperty = {
      address: "123 Test Direct St, Atlanta, GA",
      price: 250000,
      description: "Test property created directly with fetch",
      property_type: "House",
      bedrooms: 3,
      bathrooms: 2,
      image_urls: ["https://example.com/test-direct.jpg"]
    };

    console.log('Attempting to create property with data:', testProperty);
    
    const response = await fetch('http://localhost:5000/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProperty),
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const newProperty = await response.json();
      console.log('Created property:', newProperty);
    } else {
      const errorText = await response.text();
      console.error('Error response:', errorText);
    }
  } catch (error) {
    console.error('Error creating property:', error);
  }
}

testCreateProperty();
