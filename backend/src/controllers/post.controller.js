const Post = require('../models/post.model');

exports.createPost = async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id // Este vendrá del middleware de autenticación
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el post', error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los posts', error: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ 
      _id: req.params.id,
      author: req.user.id 
    });

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el post', error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ 
      _id: req.params.id,
      author: req.user.id 
    });

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el post', error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { 
        _id: req.params.id,
        author: req.user.id 
      },
      {
        title: req.body.title,
        content: req.body.content
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el post', error: error.message });
  }
};