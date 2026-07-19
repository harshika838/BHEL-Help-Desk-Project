// controllers/assetController.js
const {
  getAllAssets,
  getAssetsForUser,
  addAsset,
  updateAsset,
  deleteAsset
} = require('../models/assetModel');

// GET /api/assets
async function listAssets(req, res) {
  try {
    const assets = await getAllAssets();
    return res.status(200).json(assets);
  } catch (error) {
    console.error('List assets error:', error);
    return res.status(500).json({ message: 'Could not fetch assets.' });
  }
}

// GET /api/assets/mine
async function listMyAssets(req, res) {
  try {
    const assets = await getAssetsForUser(req.user.userId);
    return res.status(200).json(assets);
  } catch (error) {
    console.error('List my assets error:', error);
    return res.status(500).json({ message: 'Could not fetch your assets.' });
  }
}

// POST /api/assets
async function createAsset(req, res) {
  try {
    const { assetTag, assetType, brand, model, purchaseDate, warrantyExpiry } = req.body;

    if (!assetTag || !assetType) {
      return res.status(400).json({ message: 'Asset tag and type are required.' });
    }

    const newAssetId = await addAsset({ assetTag, assetType, brand, model, purchaseDate, warrantyExpiry });
    return res.status(201).json({ message: 'Asset added successfully.', assetId: newAssetId });
  } catch (error) {
    console.error('Create asset error:', error);
    return res.status(500).json({ message: 'Could not add asset.' });
  }
}

// PUT /api/assets/:id
async function editAsset(req, res) {
  try {
    const { id } = req.params;
    const { assetType, brand, model, warrantyExpiry, status } = req.body;

    await updateAsset(id, { assetType, brand, model, warrantyExpiry, status });
    return res.status(200).json({ message: 'Asset updated successfully.' });
  } catch (error) {
    console.error('Edit asset error:', error);
    return res.status(500).json({ message: 'Could not update asset.' });
  }
}

// DELETE /api/assets/:id
async function removeAsset(req, res) {
  try {
    const { id } = req.params;
    await deleteAsset(id);
    return res.status(200).json({ message: 'Asset removed successfully.' });
  } catch (error) {
    console.error('Delete asset error:', error);
    return res.status(500).json({ message: 'Could not delete asset.' });
  }
}

module.exports = { listAssets, listMyAssets, createAsset, editAsset, removeAsset };