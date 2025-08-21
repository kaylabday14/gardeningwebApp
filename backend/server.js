const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite Database connection
const dbPath = path.join(__dirname, 'gardening.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database at:', dbPath);
    
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
  }
});

// Test endpoint to verify database connection
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'SQLite backend is running!', 
    timestamp: new Date().toISOString(),
    database: 'Connected to gardening.db'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  db.get('SELECT 1 as test', (err, row) => {
    if (err) {
      res.status(500).json({ 
        status: 'error', 
        message: 'Database connection failed',
        error: err.message 
      });
    } else {
      res.json({ 
        status: 'healthy', 
        message: 'Database connection successful',
        timestamp: new Date().toISOString()
      });
    }
  });
});

// Signup endpoint
app.post('/api/signup', (req, res) => {
  const { username, password, first_name, last_name, email } = req.body;
  
  // Basic validation
  if (!username || !password || !first_name || !last_name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Username, password, first name, last name, and email are required'
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }
  
  // Check if username already exists (since it's the primary key)
  db.get('SELECT username FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error occurred'
      });
    }
    
    if (row) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }
    
    // Check if email already exists
    db.get('SELECT email FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error occurred'
        });
      }
      
      if (row) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      
      // Insert new user
      db.run(
        'INSERT INTO users (username, password, first_name, last_name, email) VALUES (?, ?, ?, ?, ?)',
        [username, password, first_name, last_name, email],
        function(err) {
          if (err) {
            console.error('Insert error:', err);
            return res.status(500).json({
              success: false,
              message: 'Failed to create user account'
            });
          }
          
          res.json({
            success: true,
            message: 'User account created successfully',
            username: username
          });
        }
      );
    });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }
  
  // Check user credentials
  db.get(
    'SELECT username, first_name, last_name, email FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error occurred'
        });
      }
      
      if (!row) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      }
      
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          username: row.username,
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email
        }
      });
    }
  );
});

// Update profile endpoint
app.put('/api/update-profile', (req, res) => {
  const { username, first_name, last_name, email } = req.body;
  
  // Basic validation
  if (!username || !first_name || !last_name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Username, first name, last name, and email are required'
    });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }
  
  // Check if email already exists for a different user
  db.get(
    'SELECT username FROM users WHERE email = ? AND username != ?',
    [email, username],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error occurred'
        });
      }
      
      if (row) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists for another user'
        });
      }
      
      // Update user profile
      db.run(
        'UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE username = ?',
        [first_name, last_name, email, username],
        function(err) {
          if (err) {
            console.error('Update error:', err);
            return res.status(500).json({
              success: false,
              message: 'Failed to update profile'
            });
          }
          
          if (this.changes === 0) {
            return res.status(404).json({
              success: false,
              message: 'User not found'
            });
          }
          
          res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
              username,
              first_name,
              last_name,
              email
            }
          });
        }
      );
    }
  );
});

// Delete account endpoint
app.delete('/api/delete-account', (req, res) => {
  const { username, password } = req.body;
  
  // Basic validation
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required for account deletion'
    });
  }
  
  // First, verify the user's password to ensure they can delete their account
  db.get(
    'SELECT username FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error occurred'
        });
      }
      
      if (!row) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      }
      
      // Password verified, now delete the account
      db.run(
        'DELETE FROM users WHERE username = ?',
        [username],
        function(err) {
          if (err) {
            console.error('Delete error:', err);
            return res.status(500).json({
              success: false,
              message: 'Failed to delete account'
            });
          }
          
          if (this.changes === 0) {
            return res.status(404).json({
              success: false,
              message: 'User not found'
            });
          }
          
          console.log(`Account deleted: ${username}`);
          
          res.json({
            success: true,
            message: 'Account deleted successfully'
          });
        }
      );
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Gardening app backend running on http://localhost:3001`);
  console.log(`📊 Database: ${dbPath}`);
  console.log(`🔗 Test endpoint: http://localhost:3001/api/test`);
  console.log(`💚 Health check: http://localhost:3001/api/health`);
  console.log(`👤 Signup endpoint: http://localhost:3001/api/signup`);
  console.log(`🔐 Login endpoint: http://localhost:3001/api/update-profile`);
  console.log(`✏️ Profile update endpoint: http://localhost:3001/api/update-profile`);
  console.log(`🗑️ Delete account endpoint: http://localhost:3001/api/delete-account`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('✅ Database connection closed.');
    }
    process.exit(0);
  });
});
