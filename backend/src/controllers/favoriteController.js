import Favorite from '../models/Favorite.js';

export const getFavoritesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const favorites = await Favorite.findAll({ where: { user_id: userId } });

    const grouped = {
      songs: favorites.filter(f => f.content_type === 'song'),
      artists: favorites.filter(f => f.content_type === 'artist'),
      albums: favorites.filter(f => f.content_type === 'album')
    };

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener favoritos', error });
  }
};

export const addFavorite = async (req, res) => {
  const { user_id, spotify_id, content_type } = req.body;

  try {
    const exists = await Favorite.findOne({ where: { user_id, spotify_id, content_type } });
    if (exists) {
      return res.status(409).json({ message: 'Ya está en favoritos' });
    }

    const newFavorite = await Favorite.create({ user_id, spotify_id, content_type });
    res.status(201).json(newFavorite);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar favorito', error });
  }
};

export const deleteFavorite = async (req, res) => {
  const { userId, spotifyId } = req.params;

  try {
    const deleted = await Favorite.destroy({
      where: {
        user_id: userId,
        spotify_id: spotifyId
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ message: 'Favorito no encontrado' });
    }

    res.json({ message: 'Favorito eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar favorito', error });
  }
};