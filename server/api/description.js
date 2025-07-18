const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');

router.post('/', authenticateUser, async (req, res) => {
    const { propertyFeatures, tone } = req.body;

    if (!propertyFeatures || !tone) {
        return res.status(400).json({ message: 'Property features and tone are required.' });
    }

    // Placeholder for AI model integration
    const generatedDescription = `This is a ${tone} description for a property with ${propertyFeatures}.`;

    res.json({ description: generatedDescription });
});

module.exports = router;
