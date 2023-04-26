const MyError = require('../utils/my-error');
const File = require('../models/file-model')

class FileService {

  async showOne(id) {
    try {
      const file = await File.findById(id);
      if (!file) {
        throw new MyError.BadRequest(`Файл не найден`);
      }
      return file;
    } catch (error) {
      return error;
    }
  }

  async upload(originalname, mimetype, size) {
    const name = originalname.split('.').slice(0, -1).join('.');
    const extension = originalname.split('.').at(-1);
    const date = new Date();
    const file = new File({
      name: `${Date.now()}-${name}`,
      extension,
      mime_type: mimetype,
      size,
      upload_date: date
    });
    await file.save();
    return file;
  }

  async delete(id) {
    const file = await File.findById(id);
    if (!file) {
      throw new MyError.BadRequest(`Файл не найден`);
    }
    await file.remove();
    return file;
  }

  async download(id) {
    const file = await File.findById(id);
    console.log(file);
    return file;
  }


}

module.exports = new FileService();