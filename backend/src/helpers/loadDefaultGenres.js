import Genre from './models/Genre.js';

const defaultGenres = [
  'Pop',
  'Rock',
  'Hip Hop',
  'Jazz',
  'Reggaeton',
  'Classical',
  'Electronic',
  'Indie',
  'Country',
  'Blues'
];

export async function loadDefaultGenres() {
  try {
    const count = await Genre.count();
    if (count === 0) {
      const genreObjects = defaultGenres.map(name => ({ name }));
      await Genre.bulkCreate(genreObjects);
      console.log('Géneros por defecto cargados.');
    } else {
      console.log('Ya hay géneros registrados, no se añadieron.');
    }
  } catch (error) {
    console.error('Error cargando géneros por defecto:', error);
  }
}
