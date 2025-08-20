import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Favorite = sequelize.define('Favorite', {
  id_favorite: {
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
  }
}, {
  tableName: 'Favorite',
  timestamps: false
});

export default Favorite;
