import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    return true;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    return false;
  }
};

// Función para inicializar tablas
const initDatabase = async (force = true) => {
    try {
      await sequelize.sync({ force });
      console.log('✅ Base de datos inicializada correctamente.');
      return true;
    } catch (error) {
      console.error('❌ Error al inicializar la base de datos:', error);
      process.exit(1);
    }
  };

export {
  sequelize,
  testConnection,
  initDatabase
};