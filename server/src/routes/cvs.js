import express from 'express';
import { getDB, saveDB } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all CVs for the authenticated user
router.get('/', requireAuth, (req, res) => {
  try {
    const db = getDB();
    const userCVs = (db.cvs || []).filter(cv => cv.userId === req.user.id);
    res.json({ cvs: userCVs });
  } catch (err) {
    console.error('Fetch CVs error:', err);
    res.status(500).json({ error: 'Failed to fetch CVs.' });
  }
});

// Get a specific CV by ID
router.get('/:id', (req, res) => {
  try {
    const db = getDB();
    const cv = (db.cvs || []).find(c => c.id === req.params.id);
    if (!cv) {
      return res.status(404).json({ error: 'CV not found.' });
    }
    res.json({ cv });
  } catch (err) {
    console.error('Fetch single CV error:', err);
    res.status(500).json({ error: 'Failed to fetch CV.' });
  }
});

// Create or Save new CV
router.post('/', requireAuth, (req, res) => {
  try {
    const { title, template, themeColor, fontFamily, fontSize, data } = req.body;

    const db = getDB();
    const newCV = {
      id: 'cv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      userId: req.user.id,
      title: title || 'My Professional CV',
      template: template || 'modern',
      themeColor: themeColor || '#2563eb',
      fontFamily: fontFamily || 'Inter',
      fontSize: fontSize || 'medium',
      data: data || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!db.cvs) db.cvs = [];
    db.cvs.push(newCV);
    saveDB(db);

    res.status(201).json({
      message: 'CV saved successfully',
      cv: newCV
    });
  } catch (err) {
    console.error('Create CV error:', err);
    res.status(500).json({ error: 'Failed to save CV.' });
  }
});

// Update existing CV
router.put('/:id', requireAuth, (req, res) => {
  try {
    const { title, template, themeColor, fontFamily, fontSize, data } = req.body;
    const db = getDB();

    const cvIndex = (db.cvs || []).findIndex(
      c => c.id === req.params.id && c.userId === req.user.id
    );

    if (cvIndex === -1) {
      return res.status(404).json({ error: 'CV not found or unauthorized.' });
    }

    const currentCV = db.cvs[cvIndex];
    const updatedCV = {
      ...currentCV,
      title: title !== undefined ? title : currentCV.title,
      template: template !== undefined ? template : currentCV.template,
      themeColor: themeColor !== undefined ? themeColor : currentCV.themeColor,
      fontFamily: fontFamily !== undefined ? fontFamily : currentCV.fontFamily,
      fontSize: fontSize !== undefined ? fontSize : currentCV.fontSize,
      data: data !== undefined ? data : currentCV.data,
      updatedAt: new Date().toISOString()
    };

    db.cvs[cvIndex] = updatedCV;
    saveDB(db);

    res.json({
      message: 'CV updated successfully',
      cv: updatedCV
    });
  } catch (err) {
    console.error('Update CV error:', err);
    res.status(500).json({ error: 'Failed to update CV.' });
  }
});

// Delete CV
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const db = getDB();
    const initialLen = (db.cvs || []).length;
    db.cvs = (db.cvs || []).filter(
      c => !(c.id === req.params.id && c.userId === req.user.id)
    );

    if (db.cvs.length === initialLen) {
      return res.status(404).json({ error: 'CV not found or unauthorized.' });
    }

    saveDB(db);
    res.json({ message: 'CV deleted successfully.' });
  } catch (err) {
    console.error('Delete CV error:', err);
    res.status(500).json({ error: 'Failed to delete CV.' });
  }
});

export default router;
