import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * MCP Function: Generate SEO-friendly Nextdoor posts from CSV data
 * This function reads listing data and creates warm, engaging posts under 100 words
 */
export async function generatePostFromCSV(csvFilePath) {
  try {
    console.log('📊 Reading CSV data...');
    
    // Read and parse CSV file
    const csvData = readFileSync(csvFilePath, 'utf-8');
    const listings = parse(csvData, {
      columns: true,
      skip_empty_lines: true
    });

    console.log(`Found ${listings.length} listings to process`);

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const generatedPosts = [];

    for (const listing of listings) {
      console.log(`Generating post for: ${listing.Address}`);
      
      // Create prompt for OpenAI
      const prompt = `Generate a warm, engaging Nextdoor real estate post under 100 words for this listing:

Address: ${listing.Address}
Bedrooms: ${listing.Bedrooms}
Bathrooms: ${listing.Bathrooms}
Square Footage: ${listing.Square_Footage}
Lot Size: ${listing['Lot_Size_(acres)']} acres
Features: ${listing.Features}
Price: $${listing.Price}
Neighborhood: ${listing.Neighborhood}
Nearby: ${listing.Nearby}

Requirements:
- Keep under 100 words
- Warm, friendly tone suitable for Nextdoor
- Include key selling points
- Mention neighborhood benefits
- Add a call-to-action
- Use emojis sparingly but effectively
- SEO-friendly for local search

Format the response as a clean post ready for Nextdoor:`;

      // Generate post using OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional real estate agent creating engaging Nextdoor posts. Be warm, authentic, and highlight what makes each property special."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      });

      const generatedPost = completion.choices[0].message.content.trim();
      
      generatedPosts.push({
        address: listing.Address,
        post: generatedPost,
        listingData: listing,
        timestamp: new Date().toISOString()
      });

      console.log(`✅ Generated post for ${listing.Address}`);
    }

    return {
      success: true,
      posts: generatedPosts,
      totalProcessed: listings.length
    };

  } catch (error) {
    console.error('❌ Error generating posts:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * MCP Function: Generate post from single listing data
 * Useful for testing or processing individual listings
 */
export async function generateSinglePost(listingData) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `Generate a warm, engaging Nextdoor real estate post under 100 words for this listing:

Address: ${listingData.address}
Bedrooms: ${listingData.bedrooms}
Bathrooms: ${listingData.bathrooms}
Square Footage: ${listingData.squareFootage}
Price: $${listingData.price}
Features: ${listingData.features}
Neighborhood: ${listingData.neighborhood}

Requirements:
- Keep under 100 words
- Warm, friendly tone suitable for Nextdoor
- Include key selling points
- Mention neighborhood benefits
- Add a call-to-action
- Use emojis sparingly but effectively`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional real estate agent creating engaging Nextdoor posts. Be warm, authentic, and highlight what makes each property special."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    return {
      success: true,
      post: completion.choices[0].message.content.trim(),
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error generating single post:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export for MCP usage
export default {
  generatePostFromCSV,
  generateSinglePost
}; 