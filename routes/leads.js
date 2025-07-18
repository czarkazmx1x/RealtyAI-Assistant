
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { logActivity } from '../utils/activityLogger.js';
import { protect } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(protect);

// GET /api/leads
router.get('/', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leads', error: error.message });
  }
});

// POST /api/leads
router.post('/', async (req, res) => {
  const { name, email, phone, source, status } = req.body;
  let score = 0;

  // Basic lead scoring logic
  if (source === 'website') {
    score = 50;
  } else if (source === 'referral') {
    score = 70;
  } else {
    score = 30;
  }

  try {
    const newLead = await prisma.lead.create({
      data: { name, email, phone, source, status, score },
    });
    await logActivity('Lead Created', `New lead ${newLead.name} (${newLead.email}) created.`);
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ message: 'Error creating lead', error: error.message });
  }
});

// GET /api/leads/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await prisma.lead.findUnique({ where: { id: parseInt(id) } });
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lead', error: error.message });
  }
});

// PUT /api/leads/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, source, status, score } = req.body;
  try {
    const updatedLead = await prisma.lead.update({
      where: { id: parseInt(id) },
      data: { name, email, phone, source, status, score },
    });
    await logActivity('Lead Updated', `Lead ${updatedLead.name} (ID: ${id}) updated.`);
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: 'Error updating lead', error: error.message });
  }
});

// DELETE /api/leads/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedLead = await prisma.lead.delete({ where: { id: parseInt(id) } });
    await logActivity('Lead Deleted', `Lead ${deletedLead.name} (ID: ${id}) deleted.`);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lead', error: error.message });
  }
});

export default router;
