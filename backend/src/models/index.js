import { sequelize } from '../config/db.js';

import Post from './Post.js';
import Comment from './Comment.js';
import Genre from './Genre.js';
import UserGenre from './UserGenre.js';
import Favorite from './Favorite.js';
import Follow from './Follow.js';
import User from './user.js';

// Asociaciones

// 🔹 User - Post
User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });

// 🔹 Post - Comment
Post.hasMany(Comment, { foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

// 🔹 User - Comment
User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

// 🔹 User - Favorite (uno a muchos por tipo)
User.hasMany(Favorite, { foreignKey: 'user_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });

// 🔹 User - Genre (relación N:M a través de UserGenre)
User.belongsToMany(Genre, {
  through: UserGenre,
  foreignKey: 'user_id',
  otherKey: 'genre_id'
});
Genre.belongsToMany(User, {
  through: UserGenre,
  foreignKey: 'genre_id',
  otherKey: 'user_id'
});

// 🔹 Follow (self-join User)
User.belongsToMany(User, {
  as: 'Followers',
  through: Follow,
  foreignKey: 'followed_id',
  otherKey: 'follower_id'
});

User.belongsToMany(User, {
  as: 'Following',
  through: Follow,
  foreignKey: 'follower_id',
  otherKey: 'followed_id'
});

// Exportar modelos y conexión
const models = {
  User,
  Post,
  Comment,
  Genre,
  UserGenre,
  Favorite,
  Follow
};

export { sequelize, models };
