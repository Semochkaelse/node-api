const postService = require('../services/post-service');

class PostController {
  async createPost(req, res, next) {
    try {
      const { authorId, title, body, publishedAt } = req.body;
      const post = await postService.createPost(authorId, title, body, publishedAt);
      res.json(post);
    } catch (err) {
      next(err);
    }
  }

  async getPosts(req, res, next) {
    try {
      const posts = await postService.getPosts();
      res.json(posts);
    } catch (err) {
      next(err);
    }
  }

  async getPostById(req, res, next) {
    try {
      const { id } = req.params;
      const post = await postService.getPostById(id);
      res.json(post);
    } catch (err) {
      next(err);
    }
  }

  async updatePost(req, res, next) {
    try {
      const { id } = req.params;
      const { title, body, publishedAt } = req.body;
      const post = await postService.updatePost(id, title, body, publishedAt);
      res.json(post);
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await postService.deletePost(id);
      res.json(post);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostController();