const Router = require('express').Router;
const router = new Router();
const userRouter = require('./user-router');
const postRouter = require('./post-router');
const fileRouter = require('./file-router')

router.use('/user', userRouter);
router.use('/news', postRouter);
router.use('/file', fileRouter);



module.exports = router