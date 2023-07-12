/**
 * Seed database
 */

const sequelize = require('../config/dbconnection');
const User = require('../models/users');
const Post = require('../models/posts');
const Comment = require('../models/comments');
const seedData = require('./data.json');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });

        for (const userData of seedData) {
            const { username, role, created_at, posts } = userData;

            // Seed users
            let user;
            try {
                user = await User.create({ username, role, created_at });
            } catch (error) {
                console.error('Failed to seed user:', error);
                continue; // skip to the next user if failed
            }

            // Seed posts
            for (const postData of posts) {
                const { title, body, comments } = postData;

                let post;
                try {
                    post = await Post.create({ title, body, user_id: user.id });
                } catch (error) {
                    console.error('Failed to seed post:', error);
                    continue; // skip to the next post if failed
                }

                // Seed comments
                for (const commentData of comments) {
                    const { content, created_at: comment_created_at } = commentData;
                    try {
                        await Comment.create({
                            content,
                            user_id: user.id,
                            post_id: post.id,
                            created_at: comment_created_at,
                        });
                    } catch (error) {
                        console.error('Failed to seed comment:', error);
                        // continue to the next comment if failed
                    }
                }
            }
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();

