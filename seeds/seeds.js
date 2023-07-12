const sequelize = require('../config/dbconnection');
const User = require('../models/users');
const Post = require('../models/posts');
const Comment = require('../models/comments');
const seedData = require('./data.json');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });

        const usernameToId = {};

        // First pass: Create all users and their posts
        for (const userData of seedData) {
            const { username, role, created_at, posts } = userData;

            // Seed users
            let user;
            try {
                user = await User.create({ username, role, created_at });
                usernameToId[username] = user.id;
                console.log(`User ${username} created with ID: ${user.id}`);
            } catch (error) {
                console.error('Failed to seed user:', error);
                continue; // skip to the next user if failed
            }

            // Seed posts
            for (const postData of posts) {
                const { title, body } = postData;

                try {
                    await Post.create({ title, body, user_id: user.id });
                } catch (error) {
                    console.error('Failed to seed post:', error);
                    continue; // skip to the next post if failed
                }
            }
        }

        // Second pass: Create all comments
        for (const userData of seedData) {
            const { username, posts } = userData;

            const user = await User.findOne({ where: { username: username } });

            // Seed comments
            for (const postData of posts) {
                const { comments } = postData;

                const post = await Post.findOne({
                    where: { title: postData.title, user_id: user.id },
                });

                for (const commentData of comments) {
                    const { content, created_at: comment_created_at, username: comment_username } = commentData;

                    const comment_user = await User.findOne({ where: { username: comment_username } });

                    if (!comment_user) {
                        console.error(`No user found with username ${comment_username}`);
                        continue;
                    }

                    try {
                        await Comment.create({
                            content,
                            user_id: comment_user.id,
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



