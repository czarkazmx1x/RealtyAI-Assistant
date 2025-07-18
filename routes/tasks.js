
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(protect);

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({ where: { assigneeId: req.user.userId } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  const { description, dueDate } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: { description, dueDate, assigneeId: req.user.userId },
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findFirst({
      where: { id: parseInt(id), assigneeId: req.user.userId },
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { description, dueDate, completed } = req.body;
  try {
    const updatedTask = await prisma.task.updateMany({
      where: { id: parseInt(id), assigneeId: req.user.userId },
      data: { description, dueDate, completed },
    });

    if (updatedTask.count === 0) {
        return res.status(404).json({ message: "Task not found or you don't have permission to update it" });
    }

    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await prisma.task.deleteMany({
        where: { id: parseInt(id), assigneeId: req.user.userId },
    });

    if (deletedTask.count === 0) {
        return res.status(404).json({ message: "Task not found or you don't have permission to delete it" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

export default router;
