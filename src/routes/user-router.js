const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const authMiddleware = require('../middlewares/auth-middleware');


router.post('/signin', userController.signin);
router.get('/new_token', userController.newToken);
router.post('/signup', userController.signup);
router.get('/logout', authMiddleware, userController.logout);
router.get('/info', authMiddleware, userController.getInfo);


module.exports = router;