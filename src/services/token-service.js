const jwt = require('jsonwebtoken');
const Token = require('../models/token-model');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken
    };
  }

  generateAccessToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });
    return accessToken;
  }

  validateAccessToken(accessToken, refreshToken, id) {
    try {
      const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError && this.validateRefreshToken(refreshToken)) {
        const newAccessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });
        const userNewData = jwt.verify(newAccessToken, process.env.JWT_ACCESS_SECRET);
        return userNewData;
      }
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(user_id, refreshToken) {
    try {
      const tokenData = await Token.findOne({ user_id });
      if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
      }
      const token = new Token({ user_id, refreshToken });
      await token.save();
      return token;
    } catch (error) {
      return null;
    }
  }

  async removeToken(refreshToken) {
    try {
      const tokenData = await Token.deleteOne({ refreshToken });
      return tokenData;
    } catch (error) {
      return null;
    }
  }

  async findToken(refreshToken) {
    try {
      const tokenData = await Token.findOne({ refreshToken });
      return tokenData;
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();