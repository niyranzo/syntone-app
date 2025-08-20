import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initDatabase } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import genreRoutes from './routes/genreRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import followRoutes from './routes/followRoutes.js';
import userGenreRoutes from './routes/userGenreRoutes.js';

// // Inicializar DB
// await initDatabase(false); // true para forzar recreación

const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename); 
// const rootPath = path.resolve(__dirname, '../');

// // 🔧 Crear carpetas necesarias si no existen
// const imagesPath = path.join(rootPath, 'public/images');
// const pdfsPath = path.join(rootPath, 'public/pdfs');

// Middlewares
app.use(cors({
  origin: [
    // 'https://qivetproyectofinal-frontend-production.up.railway.app',
    'http://localhost:5173' 
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
// app.use('/api/images', express.static(path.join(rootPath, 'public/images')));
// app.use('/api/pdfs', express.static(path.join(rootPath, 'public/pdfs')));

// console.log("📂 Archivos servidos desde /api/images y /api/pdfs");

// Rutas API
app.use('/api/users', userRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/user-genres', userGenreRoutes);


// app.use(express.static(path.join(rootPath, 'dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(rootPath, 'dist', 'index.html'));
// });

// Ruta base
app.get('/', (req, res) => {
  res.send('API Syntone funcionando');
});

export default app;
