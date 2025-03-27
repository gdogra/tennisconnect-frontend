-- Drop existing tables if they exist
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  street VARCHAR(100),
  city VARCHAR(50),
  zip VARCHAR(10),
  skill_level NUMERIC(2,1),
  password TEXT NOT NULL
);

-- Matches table
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  player1_id INTEGER REFERENCES users(id),
  player2_id INTEGER REFERENCES users(id),
  match_date DATE NOT NULL,
  location VARCHAR(100),
  player1_score INTEGER,
  player2_score INTEGER,
  cancelled BOOLEAN DEFAULT FALSE,
  sender_id INTEGER REFERENCES users(id),
  receiver_id INTEGER REFERENCES users(id)
);

-- Challenges table
CREATE TABLE challenges (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id),
  receiver_id INTEGER REFERENCES users(id),
  match_date DATE NOT NULL,
  location VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending'
);

