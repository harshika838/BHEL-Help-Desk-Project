// models/assetModel.js
const { pool } = require('../config/db');

// Get all assets, with current assignment info if assigned
async function getAllAssets() {
  const [rows] = await pool.query(`
    SELECT a.*,
           aa.employee_id AS assigned_to_employee_id,
           u.full_name AS assigned_to_name
    FROM Assets a
    LEFT JOIN Asset_Assignments aa
      ON a.asset_id = aa.asset_id AND aa.returned_date IS NULL
    LEFT JOIN Employees e ON aa.employee_id = e.employee_id
    LEFT JOIN Users u ON e.user_id = u.user_id
    ORDER BY a.asset_id DESC
  `);
  return rows;
}

// Get assets assigned to a specific user (by their Users.user_id from the JWT)
async function getAssetsForUser(userId) {
  const [rows] = await pool.query(`
    SELECT a.*, aa.assigned_date
    FROM Assets a
    JOIN Asset_Assignments aa ON a.asset_id = aa.asset_id
    JOIN Employees e ON aa.employee_id = e.employee_id
    WHERE e.user_id = ? AND aa.returned_date IS NULL
  `, [userId]);
  return rows;
}

// Add a new asset
async function addAsset({ assetTag, assetType, brand, model, purchaseDate, warrantyExpiry }) {
  const [result] = await pool.query(
    `INSERT INTO Assets (asset_tag, asset_type, brand, model, purchase_date, warranty_expiry, status)
     VALUES (?, ?, ?, ?, ?, ?, 'Available')`,
    [assetTag, assetType, brand, model, purchaseDate, warrantyExpiry]
  );
  return result.insertId;
}

// Update an asset (edit details or status)
async function updateAsset(assetId, { assetType, brand, model, warrantyExpiry, status }) {
  await pool.query(
    `UPDATE Assets SET asset_type = ?, brand = ?, model = ?, warranty_expiry = ?, status = ?
     WHERE asset_id = ?`,
    [assetType, brand, model, warrantyExpiry, status, assetId]
  );
}

// Delete an asset
async function deleteAsset(assetId) {
  await pool.query('DELETE FROM Assets WHERE asset_id = ?', [assetId]);
}

module.exports = { getAllAssets, getAssetsForUser, addAsset, updateAsset, deleteAsset };