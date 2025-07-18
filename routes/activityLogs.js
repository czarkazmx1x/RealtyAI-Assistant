
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(protect);

// GET /api/activitylogs
router.get('/', async (req, res) => {
  try {
    const activityLogs = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(activityLogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity logs', error: error.message });
  }
});

export default router;
