import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Follow = sequelize.define('Follow', {
  follower_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  followed_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Follow',
  timestamps: false
});

export default Follow;
