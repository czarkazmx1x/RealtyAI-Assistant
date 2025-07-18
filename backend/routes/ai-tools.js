const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming db.js is in the parent directory

// Function to store workflow results
async function storeWorkflowResult(workflow_type, input_data, output_data, user_id) {
    try {
        const query = `
            INSERT INTO ai_workflow_results (workflow_type, input_data, output_data, user_id, created_at)
            VALUES ($1, $2, $3, $4, NOW())
        `;
        const values = [workflow_type, input_data, output_data, user_id];
        await pool.query(query, values);
        console.log('Workflow result stored successfully');
    } catch (error) {
        console.error('Error storing workflow result:', error);
        throw error; // Re-throw the error to be handled by the calling route
    }
}

// Example route that might use storeWorkflowResult
router.post('/property-description', async (req, res) => {
    const { input_data, user_id } = req.body; // Assuming these are passed in the request body
    const workflow_type = 'property_description';
    const output_data = { /* result of AI processing */ }; // Placeholder for actual AI output

    try {
        // Simulate AI processing
        // In a real scenario, you would call your AI model here
        output_data.description = `Generated description for: ${input_data.address || 'a property'}`;

        await storeWorkflowResult(workflow_type, input_data, output_data, user_id);
        res.json({ success: true, description: output_data.description });
    } catch (error) {
        console.error('Error in property description endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
