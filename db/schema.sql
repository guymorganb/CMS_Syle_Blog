DROP DATABASE IF EXISTS tech_blog;
CREATE DATABASE tech_blog;
USE tech_blog;

-- CREATE Table users (
--    id INTEGER AUTO_INCREMENT PRIMARY KEY,
--    username VARCHAR(255),
--    role VARCHAR(255),
--    created_at TIMESTAMP
-- );

-- CREATE Table posts (
--    id INTEGER AUTO_INCREMENT PRIMARY KEY,
--    title VARCHAR(255),
--    body TEXT,
--    user_id INTEGER,
--    created_at TIMESTAMP,
--    FOREIGN KEY (user_id) REFERENCES users(id)
-- );

-- CREATE TABLE comments (
--    id INTEGER AUTO_INCREMENT PRIMARY KEY,
--    content TEXT,
--    user_id INTEGER,
--    post_id INTEGER,
--    created_at TIMESTAMP,
--    FOREIGN KEY (user_id) REFERENCES users(id),
--    FOREIGN KEY (post_id) REFERENCES posts(id)
-- );
