const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const fileController = require('../controllers/file-controller');
const upload = require('../middlewares/multer-middleware');


router.get('/:id', fileController.showOne);
router.post('/upload', upload.any(), fileController.upload);
router.delete('/:id', fileController.delete);
router.get('/downloads/:id', fileController.download);


module.exports = router;