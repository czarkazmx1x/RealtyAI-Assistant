import express from 'express';
import { Task } from '../models/database.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks
router.get('/', authenticateUser, async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dueDate: 1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get tasks by type
router.get('/type/:type', authenticateUser, async (req, res) => {
  try {
    const tasks = await Task.find({ type: req.params.type }).sort({ dueDate: 1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error('Error fetching tasks by type:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single task
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    res.json({ success: true, data: task });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create new task
router.post('/', authenticateUser, async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update task
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    res.json({ success: true, data: task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Toggle task completion
router.put('/:id/toggle', authenticateUser, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    task.completed = !task.completed;
    task.updatedAt = Date.now();
    await task.save();
    
    res.json({ success: true, data: task });
  } catch (error) {
    console.error('Error toggling task completion:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    res.json({ success: true, message: 'Task removed' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
