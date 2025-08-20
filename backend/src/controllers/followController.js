import Follow from '../models/Follow.js';

// Seguir a un usuario
export const followUser = async (req, res) => {
  const { follower_id, followed_id } = req.body;

  if (follower_id === followed_id) {
    return res.status(400).json({ message: 'No puedes seguirte a ti mismo.' });
  }

  try {
    const [follow, created] = await Follow.findOrCreate({
      where: { follower_id, followed_id }
    });

    if (!created) {
      return res.status(409).json({ message: 'Ya estás siguiendo a este usuario.' });
    }

    res.status(201).json({ message: 'Seguiste al usuario correctamente.', follow });
  } catch (error) {
    res.status(500).json({ message: 'Error al seguir al usuario.', error });
  }
};

// Dejar de seguir a un usuario
export const unfollowUser = async (req, res) => {
  const { follower_id, followed_id } = req.body;

  try {
    const deleted = await Follow.destroy({ where: { follower_id, followed_id } });

    if (!deleted) {
      return res.status(404).json({ message: 'No estabas siguiendo a este usuario.' });
    }

    res.json({ message: 'Dejaste de seguir al usuario.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al dejar de seguir al usuario.', error });
  }
};

// Obtener seguidores de un usuario
export const getFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const followers = await Follow.findAll({ where: { followed_id: userId } });
    res.json(followers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener seguidores.', error });
  }
};

// Obtener seguidos por un usuario
export const getFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const following = await Follow.findAll({ where: { follower_id: userId } });
    res.json(following);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener seguidos.', error });
  }
};
