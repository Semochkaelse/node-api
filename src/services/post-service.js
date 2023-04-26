const Post = require('../models/post-model');
const MyError = require('../utils/my-error');

class PostService {
  async createPost(authorId, title, body, publishedAt) {
    const post = new Post({ author: authorId, title, body, publishedAt: publishedAt || new Date() });
    await post.save();
    return post;
  }

  async getPosts() {
    const currentDate = new Date();
    const posts = await Post.find({ publishedAt: { $lte: currentDate } }).populate({ path: 'author', select: '_id email' });
    return posts;
  }

  async getPostById(id) {
    const post = await Post.findById(id).populate({ path: 'author', select: '_id email' });
    if (!post || post.publishedAt > new Date()) {
      throw MyError.NotFoundError('Post not found');
    }
    return post;
  }

  async updatePost(id, title, body, publishedAt) {
    const post = await this.getPostById(id);
    post.title = title || post.title;
    post.body = body || post.body;
    post.publishedAt = publishedAt || post.publishedAt;
    await post.save();
    return post;
  }
  async deletePost(id) {
    const post = await this.getPostById(id);
    await post.deleteOne();
    return post;
  }
}

module.exports = new PostService();