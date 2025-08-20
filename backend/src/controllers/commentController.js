import Comment from '../models/Comment.js';
import User from '../models/user.js';

// Obtener todos los comentarios
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        { model: User, attributes: ['id_user', 'name', 'lastname', 'profilePhoto'] }
      ],
      order: [['createdAt', 'ASC']]
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener comentarios', error });
  }
};

// Obtener comentarios por post
export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { postId },
      include: [
        { model: User, attributes: ['id_user', 'name', 'lastname', 'profilePhoto'] }
      ],
      order: [['createdAt', 'ASC']]
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener comentarios por post', error });
  }
};

// Crear nuevo comentario
export const createComment = async (req, res) => {
  const { postId, userId, content } = req.body;

  if (!postId || !userId || !content) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  try {
    const newComment = await Comment.create({
      postId,
      userId,
      content
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear comentario', error });
  }
};

// Actualizar comentario
export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

    if (content !== undefined) comment.content = content;

    await comment.save();
    res.json({ message: 'Comentario actualizado', comment });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar comentario', error });
  }
};

// Eliminar comentario
export const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Comment.destroy({ where: { id_comment: id } });
    if (!deleted) return res.status(404).json({ message: 'Comentario no encontrado' });

    res.json({ message: 'Comentario eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar comentario', error });
  }
};
