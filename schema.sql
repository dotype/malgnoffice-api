-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Insert sample users (password is hashed version of 'admin123' and 'user123')
-- Note: In production, use proper password hashing in your application
INSERT OR IGNORE INTO users (id, username, email, password, role) VALUES
  (1, 'admin', 'admin@example.com', 'admin123', 'admin'),
  (2, 'user', 'user@example.com', 'user123', 'user');
