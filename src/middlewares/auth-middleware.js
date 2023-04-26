const MyError = require('../utils/my-error')
const tokenService = require('../services/token-service');

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies.refreshToken;

    if (!authHeader) {
      return next(MyError.UnauthorizedError('No access token provided'));
    }

    const accessToken = authHeader.split(' ')[1];

    const decodedRefreshToken = tokenService.validateRefreshToken(refreshToken);

    const decodedAccessToken = tokenService.validateAccessToken(accessToken, refreshToken, decodedRefreshToken.id);

    if (decodedAccessToken?.id !== decodedRefreshToken.id) {
      return next(MyError.UnauthorizedError('Invalid refresh token'));
    }

    if (decodedAccessToken.exp < Date.now() / 1000 && decodedRefreshToken) {
      return next(MyError.UnauthorizedError('Access token has expired'));
    }

    if (decodedAccessToken.exp - (Date.now() / 1000) < 60 && decodedRefreshToken) {
      const newAccessToken = tokenService.generateAccessToken(decodedAccessToken.userId);
      res.set('Authorization', `Bearer ${newAccessToken}`);
    }

    next();
  } catch (e) {
    return next(MyError.UnauthorizedError('Invalid tokens'));
  }
};