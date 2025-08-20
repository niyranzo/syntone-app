import app from './src/app.js';
import { sequelize, models } from './src/models/index.js';
import { testConnection } from './src/config/db.js';
import { createAdminUser } from './src/helpers/admin.js';
import { loadDefaultGenres } from './src/helpers/loadDefaultGenres.js';

const startServer = async () => {
  try {
    const connected = await testConnection();

    if (connected) {
      console.log("✅ Conexión a la base de datos exitosa.");
      
      await sequelize.sync()
        .then(() => {
          console.log('✅ Tablas sincronizadas correctamente.');
          console.log('Modelos registrados:', Object.keys(models));
        })
        .catch((err) => {
          console.error('❌ Error al sincronizar las tablas:', err);
        });
      
      const tables = await sequelize.getQueryInterface().showAllTables();
      console.log('Tablas en la base de datos:', tables);
    } else {
      console.log("⚠️ No se pudo conectar a la base de datos.");
      return;
    }
    await loadDefaultGenres();
     
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });

  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();
