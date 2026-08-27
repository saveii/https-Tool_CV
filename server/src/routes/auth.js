import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbOps, getDB, saveDB } from '../db.js';
import { JWT_SECRET, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// 1. Standard Registration (Name, Email, Phone, Password)
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, avatar } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (!phone) {
      return res.status(400).json({ error: 'លេខទូរស័ព្ទត្រូវបានទាមទារ (Phone number is required).' });
    }

    // Check if Email OR Phone is already registered (1 Account per Phone Number rule)
    const existingUser = await dbOps.findUserByEmailOrPhone(email, phone);
    if (existingUser) {
      if (existingUser.phone && phone && existingUser.phone.replace(/[\s-]/g, '') === phone.replace(/[\s-]/g, '')) {
        return res.status(400).json({
          error: 'លេខទូរស័ព្ទនេះត្រូវបានចុះឈ្មោះរួចហើយ! នៅក្នុងមួយលេខទូរស័ព្ទអាចបង្កើតបានតែ ១ គណនីប៉ុណ្ណោះ។ (Phone number already registered. Only 1 account is allowed per phone number.)'
        });
      }
      return res.status(400).json({ error: 'អ៊ីមែលនេះត្រូវបានចុះឈ្មោះរួចហើយ! (Email already registered.)' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      provider: 'local',
      role: 'user',
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      headline: 'Software Specialist / Professional',
      bio: '',
      location: 'Phnom Penh, Cambodia',
      createdAt: new Date().toISOString()
    };

    await dbOps.createUser(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// 2. Login (Supports Email OR Phone Number)
router.post('/login', async (req, res) => {
  try {
    const { identifier, email, password } = req.body;
    const loginId = identifier || email;

    if (!loginId || !password) {
      return res.status(400).json({ error: 'Email / Phone and password are required.' });
    }

    const user = await dbOps.findUserByEmailOrPhone(loginId, loginId);
    if (!user) {
      return res.status(400).json({ error: 'ព័ត៌មានចូលមិនត្រឹមត្រូវទេ (Invalid Email/Phone or password).' });
    }

    if (!user.password) {
      return res.status(400).json({
        error: `គណនីនេះត្រូវបានភ្ជាប់ជាមួយ ${user.provider || 'Social Account'}។ សូមចុច Sign In ជាមួយ ${user.provider || 'Social'}`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ (Invalid password).' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// 3. Social Login & Account Linking (OAuth Exchange Endpoint)
router.post('/social-login', async (req, res) => {
  try {
    const { provider, name, email, avatar, providerId, phone, accessToken } = req.body;

    if (!provider || !email || !name) {
      return res.status(400).json({ error: 'Provider, name, and email are required for social login.' });
    }

    const providerLower = provider.toLowerCase();
    let user = await dbOps.findUserByEmailOrPhone(email, phone);

    if (!user) {
      // Create new user in users table
      user = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || null,
        password: null,
        provider: providerLower,
        providerId: providerId || `${providerLower}_` + Date.now(),
        role: 'user',
        avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        headline: 'Professional',
        bio: '',
        location: 'Phnom Penh, Cambodia',
        createdAt: new Date().toISOString()
      };

      await dbOps.createUser(user);
    }

    // Link into social_accounts table
    await dbOps.linkSocialAccount(
      user.id,
      providerLower,
      providerId || `${providerLower}_${Date.now()}`,
      accessToken || '',
      { name, email, avatar }
    );

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: `${provider} Login successful`,
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Social Login error:', err);
    res.status(500).json({ error: 'Failed to process social authentication.' });
  }
});

// 4. Meta / Facebook Graph API Exchange Code
router.post('/facebook/exchange-code', async (req, res) => {
  try {
    const { code, redirectUri } = req.body;
    const appId = process.env.FACEBOOK_APP_ID || process.env.VITE_FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;

    if (!appId || !appSecret) {
      // Local dev mode fallback
      return res.json({
        success: true,
        user: {
          id: 'usr_fb_' + Date.now(),
          name: 'Meta User',
          email: `meta_${Date.now().toString().slice(-4)}@facebook.com`,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          provider: 'facebook'
        }
      });
    }

    // Step 5 & 6: Exchange code -> Access Token
    const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      throw new Error(tokenData.error.message || 'Meta token exchange failed');
    }

    const accessToken = tokenData.access_token;

    // Step 7: Request User Data from Meta Graph API
    const userUrl = `https://graph.facebook.com/v19.0/me?fields=id,name,email,picture.width(200)&access_token=${accessToken}`;
    const userRes = await fetch(userUrl);
    const userData = await userRes.json();

    const email = userData.email || `${userData.id}@facebook.com`;
    const name = userData.name || 'Facebook User';
    const avatar = userData.picture?.data?.url || '';

    // Step 8: Save / Link in Database
    let user = await dbOps.findUserByEmailOrPhone(email, null);
    if (!user) {
      user = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        name,
        email,
        phone: null,
        password: null,
        provider: 'facebook',
        providerId: userData.id,
        role: 'user',
        avatar,
        headline: 'Professional',
        location: 'Phnom Penh, Cambodia',
        createdAt: new Date().toISOString()
      };
      await dbOps.createUser(user);
    }

    await dbOps.linkSocialAccount(user.id, 'facebook', userData.id, accessToken, userData);

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Facebook OAuth error:', err);
    res.status(500).json({ error: err.message || 'Failed to authenticate with Meta Facebook' });
  }
});

// 5. Google OAuth Exchange Code
router.post('/google/exchange-code', async (req, res) => {
  try {
    const { code, redirectUri } = req.body;
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      // Local dev mode fallback
      return res.json({
        success: true,
        user: {
          id: 'usr_goog_' + Date.now(),
          name: 'Google User',
          email: `google_${Date.now().toString().slice(-4)}@gmail.com`,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          provider: 'google'
        }
      });
    }

    // Step 5 & 6: Exchange code with Google
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      throw new Error(tokenData.error_description || 'Google token exchange failed');
    }

    // Step 7: Fetch Google User Info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const userData = await userRes.json();

    const email = userData.email;
    const name = userData.name || 'Google User';
    const avatar = userData.picture || '';

    // Step 8: Save in Database
    let user = await dbOps.findUserByEmailOrPhone(email, null);
    if (!user) {
      user = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        name,
        email,
        phone: null,
        password: null,
        provider: 'google',
        providerId: userData.sub,
        role: 'user',
        avatar,
        headline: 'Professional',
        location: 'Phnom Penh, Cambodia',
        createdAt: new Date().toISOString()
      };
      await dbOps.createUser(user);
    }

    await dbOps.linkSocialAccount(user.id, 'google', userData.sub, tokenData.access_token, userData);

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Google OAuth error:', err);
    res.status(500).json({ error: err.message || 'Failed to authenticate with Google' });
  }
});

// 6. Get Linked Social Accounts
router.get('/social-accounts', requireAuth, async (req, res) => {
  try {
    const accounts = await dbOps.getLinkedSocialAccounts(req.user.id);
    res.json({
      success: true,
      accounts
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch linked social accounts' });
  }
});

// 7. Disconnect Social Account
router.post('/social/disconnect', requireAuth, async (req, res) => {
  try {
    const { provider } = req.body;
    await dbOps.unlinkSocialAccount(req.user.id, provider);
    res.json({ success: true, message: `Disconnected ${provider} account` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to disconnect social account' });
  }
});

// 8. Get Current Profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await dbOps.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

// 9. Update Profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name, avatar, headline, bio, phone, location } = req.body;
    const updated = await dbOps.updateUser(req.user.id, {
      name,
      avatar,
      headline,
      bio,
      phone,
      location
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { password: _, ...userWithoutPassword } = updated;
    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// 10. Admin Endpoints: View All Registered Users in MySQL / DB
router.get('/admin/users', async (req, res) => {
  try {
    const users = await dbOps.getAllUsers();
    const stats = await dbOps.getAdminStats();
    res.json({
      success: true,
      stats,
      users
    });
  } catch (err) {
    console.error('Admin users fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch admin users data.' });
  }
});

export default router;
