import UserGenre from '../models/UserGenre.js';

// Asignar géneros a un usuario
export const assignGenres = async (req, res) => {
  const { user_id, genre_ids } = req.body;

  try {
    // Borrar géneros anteriores
    await UserGenre.destroy({ where: { user_id } });

    // Agregar nuevos
    const records = genre_ids.map(genre_id => ({ user_id, genre_id }));
    const created = await UserGenre.bulkCreate(records);

    res.status(201).json({ message: 'Géneros actualizados.', genres: created });
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar géneros.', error });
  }
};

// Obtener géneros de un usuario
export const getGenresByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const userGenres = await UserGenre.findAll({ where: { user_id: userId } });
    res.json(userGenres);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener géneros del usuario.', error });
  }
};
