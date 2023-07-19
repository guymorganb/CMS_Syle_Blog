-- DROP DATABASE IF EXISTS tech_blog;
-- CREATE DATABASE tech_blog;
-- USE tech_blog;

-- CREATE Table users (
--    id INTEGER AUTO_INCREMENT PRIMARY KEY,
--    username VARCHAR(255) NOT NULL,
--    email VARCHAR(255) UNIQUE NOT NULL,
--    password_hash VARCHAR(255) NOT NULL,
--    role VARCHAR(255),
--    created_at TIMESTAMP,
--    updated_at TIMESTAMP
-- );

-- CREATE TABLE sessions (
--    id INTEGER AUTO_INCREMENT PRIMARY KEY,
--    user_id INTEGER,
--    session_token VARCHAR(255) UNIQUE NOT NULL,
--    expires_at TIMESTAMP,
--    created_at TIMESTAMP,
--    active BOOLEAN DEFAULT true,
--    FOREIGN KEY (user_id) REFERENCES users(id)
-- );

-- CREATE Table posts (
--    id INTEGER AUTO_INCREMENT PRIMARY KEY,
--    title VARCHAR(255),
--    body TEXT,
--    user_id INTEGER,
--    created_at TIMESTAMP,
--    updated_at TIMESTAMP,
--    deleted_at TIMESTAMP,
--    FOREIGN KEY (user_id) REFERENCES users(id)
-- );

-- CREATE TABLE comments (
--    id INTEGER AUTO_INCREMENT PRIMARY KEY,
--    content TEXT,
--    user_id INTEGER,
--    post_id INTEGER,
--    created_at TIMESTAMP,
--    updated_at TIMESTAMP,
--    deleted_at TIMESTAMP,
--    FOREIGN KEY (user_id) REFERENCES users(id),
--    FOREIGN KEY (post_id) REFERENCES posts(id)
-- );

