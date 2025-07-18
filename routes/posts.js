
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

router.use(protect);

// GET /api/posts
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.socialPost.findMany({ where: { authorId: req.user.userId } });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

// POST /api/posts
router.post('/', async (req, res) => {
  const { content, platform } = req.body;
  try {
    const newPost = await prisma.socialPost.create({
      data: { content, platform, authorId: req.user.userId },
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.socialPost.findFirst({
      where: { id: parseInt(id), authorId: req.user.userId },
    });
    if (!post) {
      return res.status(404).json({ message: 'Social post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching social post', error: error.message });
  }
});

// PUT /api/posts/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content, platform } = req.body;
  try {
    const updatedPost = await prisma.socialPost.updateMany({
      where: { id: parseInt(id), authorId: req.user.userId },
      data: { content, platform },
    });

    if (updatedPost.count === 0) {
        return res.status(404).json({ message: "Social post not found or you don't have permission to update it" });
    }

    res.json({ message: 'Social post updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating social post', error: error.message });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await prisma.socialPost.deleteMany({
        where: { id: parseInt(id), authorId: req.user.userId },
    });

    if (deletedPost.count === 0) {
        return res.status(404).json({ message: "Social post not found or you don't have permission to delete it" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting social post', error: error.message });
  }
});

export default router;
