import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Post = sequelize.define('Post', {
  id_post: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  spotify_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content_type: {
    type: DataTypes.ENUM('song', 'artist', 'album'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  rating: {
    type: DataTypes.INTEGER // 1-5 estrellas
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Post',
  timestamps: false
});

export default Post;
