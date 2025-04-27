const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, postController.createPost);
router.get('/', auth, postController.getPosts);
router.get('/:id', auth, postController.getPost);
router.delete('/:id', auth, postController.deletePost);

module.exports = router;