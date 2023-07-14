const sequelize = require('../config/dbconnection');
const User = require('../models/users');
const Session = require('../models/sessions');
const Post = require('../models/posts');
const Comment = require('../models/comments');
const seedData = require('./data.json');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        const usersMap = new Map();
        // First pass: Create all users and their sessions
        for (const userData of seedData) {
            const { first_name, last_name, dob, zip, username, email, password_hash, role, createdAt, updatedAt, sessions } = userData;

            // Seed users
            let user;
            try {
                user = await User.create({ first_name, last_name, dob, zip, username, email, password_hash, role, createdAt, updatedAt });
                usersMap.set(username, user); // Map usernames to User instances for easy lookup in second pass
                console.log(`User ${username} created with ID: ${user.id}`);
            } catch (error) {
                console.error('Failed to seed user:', error);
            }
            // Seed sessions
            for (const sessionData of sessions) {
                const { session_token, expires_at, createdAt: session_createdAt, updatedAt: session_updatedAt } = sessionData;
                try {
                    await Session.create({ user_id: user.id, session_token, expires_at, createdAt: session_createdAt, updatedAt: session_updatedAt });
                } catch (error) {
                    console.error('Failed to seed session:', error);
                }
            }
        }
        // Second pass: Create all posts and their comments
        for (const userData of seedData) {
            const { username, posts } = userData;
            const user = usersMap.get(username); // Retrieve User instance from the map
            if (!user) {
                continue; // skip if user does not exist (although it shouldn't happen in normal circumstances)
            }
            // Seed posts
            for (const postData of posts) {
                const { title, body, comments } = postData;

                try {
                    const post = await Post.create({ title, body, user_id: user.id });

                    // Seed comments
                    for (const commentData of comments) {
                        const { username: comment_username, content, createdAt: comment_createdAt, updatedAt: comment_updatedAt } = commentData;
                        const comment_user = usersMap.get(comment_username);

                        if (!comment_user) {
                            console.error(`No user found with username ${comment_username}`);
                        }
                        try {
                            await Comment.create({
                                content,
                                user_id: comment_user.id,
                                post_id: post.id,
                                createdAt: comment_createdAt,
                                updatedAt: comment_updatedAt
                            });
                        } catch (error) {
                            console.error('Failed to seed comment:', error);
                            
                        }
                    }
                } catch (error) {
                    console.error('Failed to seed post:', error);
                     
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
