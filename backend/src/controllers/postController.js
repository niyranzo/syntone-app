import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/user.js';

// Obtener todos los posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: User, attributes: ['id_user', 'name', 'lastname', 'profilePhoto'] },
        { model: Comment, attributes: ['id_comment', 'content', 'createdAt'], include: [{ model: User, attributes: ['id_user', 'name'] }] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener publicaciones', error });
  }
};

// Obtener post por ID
export const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id, {
      include: [
        { model: User, attributes: ['id_user', 'name', 'lastname', 'profilePhoto'] },
        { model: Comment, attributes: ['id_comment', 'content', 'createdAt'], include: [{ model: User, attributes: ['id_user', 'name'] }] }
      ]
    });
    if (!post) return res.status(404).json({ message: 'Publicación no encontrada' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener publicación', error });
  }
};

// Obtener posts de un usuario específico
export const getPostsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await Post.findAll({
      where: { userId },
      include: [
        { model: User, attributes: ['id_user', 'name', 'lastname', 'profilePhoto'] },
        { model: Comment, attributes: ['id_comment', 'content', 'createdAt'], include: [{ model: User, attributes: ['id_user', 'name'] }] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener publicaciones del usuario', error });
  }
};

// Crear nuevo post
export const createPost = async (req, res) => {
  const { userId, type, musicId, description, rating } = req.body;

  try {
    if (!userId || !type || !musicId) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const newPost = await Post.create({
      userId,
      type,
      musicId,
      description,
      rating
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear publicación', error });
  }
};

// Actualizar post
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { description, rating } = req.body;

  try {
    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ message: 'Publicación no encontrada' });

    if (description !== undefined) post.description = description;
    if (rating !== undefined) post.rating = rating;

    await post.save();
    res.json({ message: 'Publicación actualizada', post });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar publicación', error });
  }
};

// Eliminar post
export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Post.destroy({ where: { id_post: id } });
    if (!deleted) return res.status(404).json({ message: 'Publicación no encontrada' });

    res.json({ message: 'Publicación eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar publicación', error });
  }
};
