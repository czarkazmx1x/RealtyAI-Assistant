
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

let authToken = '';

const testAuth = async () => {
  console.log('\n--- Testing Authentication ---');
  const email = `test${Date.now()}@example.com`;
  const password = 'password123';

  // Register a new user
  console.log('Registering user...');
  let res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name: 'Test User' }),
  });
  let data = await res.json();
  console.log('Register response:', data);

  // Login with the new user
  console.log('Logging in user...');
  res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  data = await res.json();
  console.log('Login response:', data);
  if (data.token) {
    authToken = data.token;
    console.log('Auth Token received.');
  } else {
    console.error('Failed to get auth token. Exiting.');
    return;
  }
};

const testListings = async () => {
  if (!authToken) {
    console.error('No auth token available. Cannot test listings.');
    return;
  }
  console.log('\n--- Testing Listings ---');

  // Create a new listing
  console.log('Creating listing...');
  let res = await fetch(`${BASE_URL}/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      address: '123 Test St',
      price: 500000,
      description: 'A lovely test home',
      status: 'AVAILABLE',
      imageUrls: 'http://example.com/image.jpg',
    }),
  });
  let data = await res.json();
  console.log('Create listing response:', data);
  const newListingId = data.id;

  // Get all listings
  console.log('Getting all listings...');
  res = await fetch(`${BASE_URL}/listings`, {
    headers: { 'Authorization': `Bearer ${authToken}` },
  });
  data = await res.json();
  console.log('Get all listings response:', data);

  // Get single listing
  if (newListingId) {
    console.log(`Getting listing ${newListingId}...`);
    res = await fetch(`${BASE_URL}/listings/${newListingId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    data = await res.json();
    console.log(`Get listing ${newListingId} response:`, data);

    // Update listing
    console.log(`Updating listing ${newListingId}...`);
    res = await fetch(`${BASE_URL}/listings/${newListingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        address: '123 Test St Updated',
        price: 550000,
        description: 'An updated lovely test home',
        status: 'SOLD',
      }),
    });
    data = await res.json();
    console.log(`Update listing ${newListingId} response:`, data);

    // Delete listing
    console.log(`Deleting listing ${newListingId}...`);
    res = await fetch(`${BASE_URL}/listings/${newListingId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    console.log(`Delete listing ${newListingId} status:`, res.status);
  }
};

const runTests = async () => {
  await testAuth();
  if (authToken) {
    await testListings();
  }
  console.log('\n--- All tests complete ---');
};

runTests();
