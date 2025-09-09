import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await pool.query(`
      SELECT b.*, u.username as author_name 
      FROM blogs b 
      JOIN users u ON b.author_id = u.id 
      ORDER BY b.created_at DESC
    `);
    
    res.json(blogs.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await pool.query(`
      SELECT b.*, u.username as author_name 
      FROM blogs b 
      JOIN users u ON b.author_id = u.id 
      WHERE b.id = $1
    `, [id]);

    if (blog.rows.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create blog (protected)
router.post('/', authMiddleware, [
  body('title').isLength({ min: 1 }).withMessage('Title is required'),
  body('content').isLength({ min: 1 }).withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const authorId = req.user.userId;

    const newBlog = await pool.query(
      'INSERT INTO blogs (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, authorId]
    );

    // Get the blog with author name
    const blogWithAuthor = await pool.query(`
      SELECT b.*, u.username as author_name 
      FROM blogs b 
      JOIN users u ON b.author_id = u.id 
      WHERE b.id = $1
    `, [newBlog.rows[0].id]);

    res.status(201).json(blogWithAuthor.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog (protected)
router.put('/:id', authMiddleware, [
  body('title').isLength({ min: 1 }).withMessage('Title is required'),
  body('content').isLength({ min: 1 }).withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.userId;

    // Check if blog exists and user owns it
    const blog = await pool.query('SELECT * FROM blogs WHERE id = $1 AND author_id = $2', [id, userId]);

    if (blog.rows.length === 0) {
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    }

    const updatedBlog = await pool.query(
      'UPDATE blogs SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title, content, id]
    );

    // Get the blog with author name
    const blogWithAuthor = await pool.query(`
      SELECT b.*, u.username as author_name 
      FROM blogs b 
      JOIN users u ON b.author_id = u.id 
      WHERE b.id = $1
    `, [id]);

    res.json(blogWithAuthor.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if blog exists and user owns it
    const blog = await pool.query('SELECT * FROM blogs WHERE id = $1 AND author_id = $2', [id, userId]);

    if (blog.rows.length === 0) {
      return res.status(404).json({ message: 'Blog not found or unauthorized' });
    }

    await pool.query('DELETE FROM blogs WHERE id = $1', [id]);

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;