const fs = require('fs').promises;
const path = require('path');
const fileService = require('../services/file-service');
const MyError = require('../utils/my-error');

class FileController {

  async showOne(req, res, next) {
    try {
      const { id } = req.params
      const fileData = await fileService.showOne(id)
      res.json(fileData)
    } catch (e) {
      next(e);
    }
  }

  async upload(req, res, next) {
    try {
      const { originalname, mimetype, size } = req.files[0];
      if (!originalname || !mimetype || !size) {
        throw MyError.BadRequest(`Invalid upload`)
      }
      const file = await fileService.upload(originalname, mimetype, size)
      const oldPath = path.join('./uploads', originalname);
      const newPath = path.join('./uploads', `${file.name}.${file.extension}`);
      await fs.rename(oldPath, newPath);
      res.json(file)
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params
      if (!id) {
        throw MyError.BadRequest(`File not found`);
      }
      const fileData = await fileService.delete(id)
      if (!fileData) {
        throw MyError.BadRequest(`Something went wrong`);
      }
      const filePath = path.join('./uploads', `${fileData.name}.${fileData.extension}`);
      await fs.unlink(filePath);
      res.json({ msg: 'File was deleted' })
    } catch (e) {
      next(e);
    }
  }

  async download(req, res, next) {
    try {
      const { id } = req.params
      if (!id) {
        throw MyError.BadRequest(`File not found`);
      }
      const file = await fileService.download(id)
      if (!file) {
        throw MyError.BadRequest(`File not found`);
      }
      const filePath = path.join('./uploads', `${file.name}.${file.extension}`);
      console.log(filePath);
      const fileStream = await fs.createReadStream(filePath);
      res.setHeader('Content-Type', file.mime_type);
      res.setHeader('Content-Disposition', `attachment; filename="${file.name}.${file.extension}"`);
      res.setHeader('Content-Length', file.size);
      fileStream.pipe(res);
    } catch (e) {
      next(e);
    }
  }

}


module.exports = new FileController();