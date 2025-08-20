import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const UserGenre = sequelize.define('UserGenre', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  genre_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'UserGenre',
  timestamps: false
});

export default UserGenre;
