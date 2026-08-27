import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultState = {
  users: [
    {
      id: 'usr_admin_default',
      name: 'Admin Manager',
      email: 'admin@cvforge.com',
      phone: '+855 12 888 999',
      password: '$2a$10$wN9Q7K0R7k2I4y1Z9aX.Iec2S8nL4T5v6w7x8y9z0a1b2c3d4e5f6',
      provider: 'local',
      role: 'admin',
      headline: 'System Administrator',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
      location: 'Phnom Penh, Cambodia',
      createdAt: new Date().toISOString()
    }
  ],
  social_accounts: [],
  cvs: []
};

// Initialize JSON store if missing
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(defaultState, null, 2), 'utf8');
}

// MySQL Connection Pool
let pool = null;
let isMySqlConnected = false;

const initMySQL = async () => {
  try {
    const config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cvforge_db',
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

    pool = mysql.createPool(config);
    const conn = await pool.getConnection();
    console.log('✅ Connected to MySQL Database:', config.database);
    conn.release();
    isMySqlConnected = true;
  } catch (err) {
    console.log('ℹ️ MySQL not connected (will use persistent JSON DB store):', err.message);
    isMySqlConnected = false;
  }
};

initMySQL();

// JSON Store Helpers
export const getDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(data || '{}');
    if (!parsed.social_accounts) parsed.social_accounts = [];
    return parsed;
  } catch (err) {
    console.error('Error reading JSON DB:', err);
    return defaultState;
  }
};

export const saveDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving JSON DB:', err);
    return false;
  }
};

// Database Operations Layer (Supports both MySQL & Persistent JSON fallback)
export const dbOps = {
  // Find user by email or phone
  findUserByEmailOrPhone: async (email, phone) => {
    const cleanEmail = email ? email.toLowerCase().trim() : null;
    const cleanPhone = phone ? phone.replace(/[\s-]/g, '') : null;

    if (isMySqlConnected && pool) {
      try {
        const [rows] = await pool.execute(
          'SELECT * FROM users WHERE email = ? OR (phone IS NOT NULL AND phone = ?) LIMIT 1',
          [cleanEmail, cleanPhone]
        );
        return rows[0] || null;
      } catch (err) {
        console.error('MySQL findUser error:', err);
      }
    }

    const db = getDB();
    return db.users.find(u => {
      const emailMatches = cleanEmail && u.email && u.email.toLowerCase() === cleanEmail;
      const phoneMatches = cleanPhone && u.phone && u.phone.replace(/[\s-]/g, '') === cleanPhone;
      return emailMatches || phoneMatches;
    }) || null;
  },

  // Find user by Provider & Provider User ID (from Facebook or Google)
  findUserByProviderId: async (provider, providerUserId) => {
    if (isMySqlConnected && pool) {
      try {
        const [rows] = await pool.execute(
          `SELECT u.* FROM users u
           JOIN social_accounts s ON u.id = s.user_id
           WHERE s.provider = ? AND s.provider_user_id = ? LIMIT 1`,
          [provider.toLowerCase(), providerUserId]
        );
        if (rows.length > 0) return rows[0];
      } catch (err) {
        console.error('MySQL findUserByProviderId error:', err);
      }
    }

    const db = getDB();
    const social = db.social_accounts.find(
      s => s.provider === provider.toLowerCase() && s.provider_user_id === providerUserId
    );
    if (social) {
      return db.users.find(u => u.id === social.user_id) || null;
    }
    return null;
  },

  // Find user by ID
  findUserById: async (id) => {
    if (isMySqlConnected && pool) {
      try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
        return rows[0] || null;
      } catch (err) {
        console.error('MySQL findUserById error:', err);
      }
    }

    const db = getDB();
    return db.users.find(u => u.id === id) || null;
  },

  // Create new user (Enforcing 1 Account per Phone Number)
  createUser: async (userData) => {
    if (isMySqlConnected && pool) {
      try {
        const sql = `
          INSERT INTO users (id, name, email, phone, password, provider, provider_id, avatar, role, headline, bio, location)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.execute(sql, [
          userData.id,
          userData.name,
          userData.email,
          userData.phone || null,
          userData.password || null,
          userData.provider || 'local',
          userData.providerId || null,
          userData.avatar || null,
          userData.role || 'user',
          userData.headline || 'Professional',
          userData.bio || '',
          userData.location || 'Phnom Penh, Cambodia'
        ]);
        return userData;
      } catch (err) {
        console.error('MySQL createUser error:', err);
      }
    }

    const db = getDB();
    db.users.push(userData);
    saveDB(db);
    return userData;
  },

  // Link Social Account to User (Facebook / Google)
  linkSocialAccount: async (userId, provider, providerUserId, accessToken = '', profileData = {}) => {
    const recordId = 'soc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const providerLower = provider.toLowerCase();

    if (isMySqlConnected && pool) {
      try {
        const sql = `
          INSERT INTO social_accounts (id, user_id, provider, provider_user_id, access_token, profile_data)
          VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE access_token = VALUES(access_token), profile_data = VALUES(profile_data), updated_at = CURRENT_TIMESTAMP
        `;
        await pool.execute(sql, [
          recordId,
          userId,
          providerLower,
          providerUserId,
          accessToken,
          JSON.stringify(profileData)
        ]);
        return { success: true };
      } catch (err) {
        console.error('MySQL linkSocialAccount error:', err);
      }
    }

    const db = getDB();
    const existingIndex = db.social_accounts.findIndex(
      s => s.user_id === userId && s.provider === providerLower
    );

    const record = {
      id: recordId,
      user_id: userId,
      provider: providerLower,
      provider_user_id: providerUserId,
      access_token: accessToken,
      profile_data: profileData,
      updated_at: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      db.social_accounts[existingIndex] = { ...db.social_accounts[existingIndex], ...record };
    } else {
      record.created_at = new Date().toISOString();
      db.social_accounts.push(record);
    }
    saveDB(db);
    return { success: true };
  },

  // Unlink Social Account
  unlinkSocialAccount: async (userId, provider) => {
    const providerLower = provider.toLowerCase();
    if (isMySqlConnected && pool) {
      try {
        await pool.execute(
          'DELETE FROM social_accounts WHERE user_id = ? AND provider = ?',
          [userId, providerLower]
        );
        return { success: true };
      } catch (err) {
        console.error('MySQL unlinkSocialAccount error:', err);
      }
    }

    const db = getDB();
    db.social_accounts = db.social_accounts.filter(
      s => !(s.user_id === userId && s.provider === providerLower)
    );
    saveDB(db);
    return { success: true };
  },

  // Get Linked Social Accounts for User
  getLinkedSocialAccounts: async (userId) => {
    if (isMySqlConnected && pool) {
      try {
        const [rows] = await pool.execute(
          'SELECT provider, provider_user_id, created_at FROM social_accounts WHERE user_id = ?',
          [userId]
        );
        return rows;
      } catch (err) {
        console.error('MySQL getLinkedSocialAccounts error:', err);
      }
    }

    const db = getDB();
    return (db.social_accounts || []).filter(s => s.user_id === userId);
  },

  // Update User Profile
  updateUser: async (id, updateFields) => {
    const db = getDB();
    const idx = db.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...updateFields, updatedAt: new Date().toISOString() };
      saveDB(db);
      return db.users[idx];
    }
    return null;
  },

  // Get all users for Admin
  getAllUsers: async () => {
    if (isMySqlConnected && pool) {
      try {
        const [rows] = await pool.execute(
          'SELECT id, name, email, phone, provider, role, avatar, headline, created_at FROM users ORDER BY created_at DESC'
        );
        return rows;
      } catch (err) {
        console.error('MySQL getAllUsers error:', err);
      }
    }

    const db = getDB();
    return db.users.map(({ password, ...u }) => u);
  },

  // Get Admin stats
  getAdminStats: async () => {
    const db = getDB();
    return {
      totalUsers: db.users.length,
      totalCVs: db.cvs.length,
      socialAccounts: db.social_accounts ? db.social_accounts.length : db.users.filter(u => u.provider !== 'local').length,
      phoneAccounts: db.users.filter(u => u.phone).length,
      isMySqlConnected
    };
  }
};
