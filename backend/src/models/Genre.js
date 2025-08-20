import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Genre = sequelize.define('Genre', {
  id_genre: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'Genre',
  timestamps: false
});

export default Genre;
