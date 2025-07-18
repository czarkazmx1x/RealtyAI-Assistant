import { google } from 'googleapis';
import { readFileSync, existsSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initialize Google Sheets API
 */
let sheets;
let auth;

async function initializeGoogleSheets() {
  try {
    const credentialsPath = process.env.GOOGLE_SHEETS_CREDENTIALS_FILE;
    
    if (!credentialsPath || !existsSync(credentialsPath)) {
      throw new Error('Google Sheets credentials file not found. Please set GOOGLE_SHEETS_CREDENTIALS_FILE in your .env file.');
    }
    
    const credentials = JSON.parse(readFileSync(credentialsPath, 'utf-8'));
    
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    sheets = google.sheets({ version: 'v4', auth });
    
    console.log('✅ Google Sheets API initialized');
    
  } catch (error) {
    console.error('❌ Failed to initialize Google Sheets:', error);
    throw error;
  }
}

/**
 * MCP Function: Log post results to Google Sheets
 * Records post URL, timestamp, images used, and listing details
 */
export async function logPostToSheets(postResult) {
  try {
    if (!sheets) {
      await initializeGoogleSheets();
    }
    
    console.log('📊 Logging post to Google Sheets...');
    
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const tabName = process.env.POSTS_LOG_TAB_NAME || 'Posts_Log';
    
    if (!spreadsheetId) {
      throw new Error('Google Sheets Spreadsheet ID not configured');
    }
    
    // Prepare data for logging
    const logData = [
      new Date().toISOString(), // Timestamp
      postResult.postData.address || 'N/A', // Address
      postResult.postData.post || 'N/A', // Post content
      postResult.postUrl || 'N/A', // Post URL
      postResult.timestamp || new Date().toISOString(), // Post timestamp
      postResult.imagesUsed ? postResult.imagesUsed.length : 0, // Number of images
      postResult.imagesUsed ? postResult.imagesUsed.map(img => img.url || img.cloudinaryUrl || img.s3Url).join('; ') : 'N/A', // Image URLs
      postResult.postData.listingData ? JSON.stringify(postResult.postData.listingData) : 'N/A', // Full listing data
      'Posted', // Status
      'Matt Baker' // Agent name
    ];
    
    // Append data to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${tabName}!A:J`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [logData]
      }
    });
    
    console.log('✅ Post logged to Google Sheets');
    
    return {
      success: true,
      message: 'Post logged successfully',
      rowAdded: response.data.updates?.updatedRows || 1
    };
    
  } catch (error) {
    console.error('❌ Error logging post to sheets:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * MCP Function: Log leads from post comments/DMs
 * Captures potential leads for CRM follow-up
 */
export async function logLeadsToSheets(leadsData) {
  try {
    if (!sheets) {
      await initializeGoogleSheets();
    }
    
    console.log('👥 Logging leads to Google Sheets...');
    
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const tabName = process.env.LEADS_LOG_TAB_NAME || 'Leads_Log';
    
    if (!spreadsheetId) {
      throw new Error('Google Sheets Spreadsheet ID not configured');
    }
    
    const leadsToLog = [];
    
    for (const lead of leadsData) {
      const leadData = [
        new Date().toISOString(), // Timestamp
        lead.name || 'Anonymous', // Lead name
        lead.email || 'N/A', // Email
        lead.phone || 'N/A', // Phone
        lead.message || 'N/A', // Message/comment
        lead.source || 'Nextdoor', // Source
        lead.postUrl || 'N/A', // Related post URL
        lead.address || 'N/A', // Property address
        'New', // Status
        'Matt Baker', // Agent
        lead.urgency || 'Normal', // Urgency
        lead.followUpDate || 'TBD' // Follow-up date
      ];
      
      leadsToLog.push(leadData);
    }
    
    if (leadsToLog.length > 0) {
      // Append leads to the sheet
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${tabName}!A:L`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: leadsToLog
        }
      });
      
      console.log(`✅ ${leadsToLog.length} leads logged to Google Sheets`);
      
      return {
        success: true,
        message: `${leadsToLog.length} leads logged successfully`,
        rowsAdded: response.data.updates?.updatedRows || leadsToLog.length
      };
    } else {
      return {
        success: true,
        message: 'No leads to log',
        rowsAdded: 0
      };
    }
    
  } catch (error) {
    console.error('❌ Error logging leads to sheets:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * MCP Function: Create Google Sheets if they don't exist
 * Sets up the tracking sheets with proper headers
 */
export async function setupTrackingSheets() {
  try {
    if (!sheets) {
      await initializeGoogleSheets();
    }
    
    console.log('📋 Setting up tracking sheets...');
    
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('Google Sheets Spreadsheet ID not configured');
    }
    
    // Posts Log headers
    const postsHeaders = [
      'Timestamp',
      'Address',
      'Post Content',
      'Post URL',
      'Post Timestamp',
      'Images Count',
      'Image URLs',
      'Listing Data',
      'Status',
      'Agent'
    ];
    
    // Leads Log headers
    const leadsHeaders = [
      'Timestamp',
      'Name',
      'Email',
      'Phone',
      'Message',
      'Source',
      'Post URL',
      'Property Address',
      'Status',
      'Agent',
      'Urgency',
      'Follow-up Date'
    ];
    
    // Create or update Posts Log sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Posts_Log!A1:J1',
      valueInputOption: 'RAW',
      resource: {
        values: [postsHeaders]
      }
    });
    
    // Create or update Leads Log sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Leads_Log!A1:L1',
      valueInputOption: 'RAW',
      resource: {
        values: [leadsHeaders]
      }
    });
    
    console.log('✅ Tracking sheets setup complete');
    
    return {
      success: true,
      message: 'Tracking sheets created/updated successfully'
    };
    
  } catch (error) {
    console.error('❌ Error setting up tracking sheets:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * MCP Function: Get post statistics from Google Sheets
 * Retrieves analytics about posted listings
 */
export async function getPostStatistics() {
  try {
    if (!sheets) {
      await initializeGoogleSheets();
    }
    
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const tabName = process.env.POSTS_LOG_TAB_NAME || 'Posts_Log';
    
    if (!spreadsheetId) {
      throw new Error('Google Sheets Spreadsheet ID not configured');
    }
    
    // Get all data from Posts Log
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tabName}!A:J`
    });
    
    const rows = response.data.values || [];
    
    if (rows.length <= 1) {
      return {
        success: true,
        statistics: {
          totalPosts: 0,
          thisMonth: 0,
          thisWeek: 0,
          averageImagesPerPost: 0
        }
      };
    }
    
    // Remove header row
    const dataRows = rows.slice(1);
    
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const thisWeek = getWeekNumber(now);
    
    let thisMonthCount = 0;
    let thisWeekCount = 0;
    let totalImages = 0;
    
    for (const row of dataRows) {
      if (row.length >= 5) {
        const postDate = new Date(row[4]); // Post timestamp column
        
        // Count this month's posts
        if (postDate.getMonth() === thisMonth && postDate.getFullYear() === thisYear) {
          thisMonthCount++;
        }
        
        // Count this week's posts
        if (getWeekNumber(postDate) === thisWeek && postDate.getFullYear() === thisYear) {
          thisWeekCount++;
        }
        
        // Count images
        if (row[5] && !isNaN(row[5])) {
          totalImages += parseInt(row[5]);
        }
      }
    }
    
    const statistics = {
      totalPosts: dataRows.length,
      thisMonth: thisMonthCount,
      thisWeek: thisWeekCount,
      averageImagesPerPost: dataRows.length > 0 ? (totalImages / dataRows.length).toFixed(1) : 0
    };
    
    return {
      success: true,
      statistics
    };
    
  } catch (error) {
    console.error('❌ Error getting post statistics:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Helper function to get week number
 */
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * MCP Function: Test Google Sheets connection
 * Verifies API credentials and spreadsheet access
 */
export async function testGoogleSheetsConnection() {
  try {
    await initializeGoogleSheets();
    
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('Spreadsheet ID not configured');
    }
    
    // Try to read the spreadsheet metadata
    const response = await sheets.spreadsheets.get({
      spreadsheetId
    });
    
    return {
      success: true,
      message: 'Google Sheets connection successful',
      spreadsheetTitle: response.data.properties.title
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Export for MCP usage
export default {
  logPostToSheets,
  logLeadsToSheets,
  setupTrackingSheets,
  getPostStatistics,
  testGoogleSheetsConnection
}; 