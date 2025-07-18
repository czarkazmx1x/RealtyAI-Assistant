import express from 'express';
import { Lead } from '../models/database.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get all leads
router.get('/', authenticateUser, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single lead
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    
    res.json({ success: true, data: lead });
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create new lead
router.post('/', authenticateUser, async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update lead
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    
    res.json({ success: true, data: lead });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete lead
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    
    res.json({ success: true, message: 'Lead removed' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Import leads from CSV
router.post('/import', authenticateUser, async (req, res) => {
  try {
    // This will be implemented later, using your existing CSV import functionality
    res.json({ success: true, message: 'Import functionality will be implemented' });
  } catch (error) {
    console.error('Error importing leads:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
