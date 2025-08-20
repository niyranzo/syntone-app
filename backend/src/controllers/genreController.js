import Genre from '../models/Genre.js';

// Obtener todos los géneros
export const getGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener géneros', error });
  }
};

// Obtener género por ID
export const getGenreById = async (req, res) => {
  const { id } = req.params;
  try {
    const genre = await Genre.findByPk(id);
    if (!genre) return res.status(404).json({ message: 'Género no encontrado' });
    res.json(genre);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener género', error });
  }
};

// Crear nuevo género
export const createGenre = async (req, res) => {
  const { name } = req.body;
  try {
    const existing = await Genre.findOne({ where: { name } });
    if (existing) return res.status(400).json({ message: 'El género ya existe' });

    const newGenre = await Genre.create({ name });
    res.status(201).json(newGenre);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear género', error });
  }
};

// Actualizar género
export const updateGenre = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const genre = await Genre.findByPk(id);
    if (!genre) return res.status(404).json({ message: 'Género no encontrado' });

    genre.name = name || genre.name;
    await genre.save();
    res.json({ message: 'Género actualizado', genre });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar género', error });
  }
};

// Eliminar género
export const deleteGenre = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Genre.destroy({ where: { id_genre: id } });
    if (!deleted) return res.status(404).json({ message: 'Género no encontrado' });

    res.json({ message: 'Género eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar género', error });
  }
};
