// routes/assets.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  listAssets,
  listMyAssets,
  createAsset,
  editAsset,
  removeAsset
} = require('../controllers/assetController');

// IMPORTANT: /mine must come before /:id-style routes in employees/tickets,
// but here we don't have that conflict since assets uses only /, /mine, /:id
router.get('/', verifyToken, listAssets);
router.get('/mine', verifyToken, listMyAssets);
router.post('/', verifyToken, createAsset);
router.put('/:id', verifyToken, editAsset);
router.delete('/:id', verifyToken, removeAsset);

module.exports = router;