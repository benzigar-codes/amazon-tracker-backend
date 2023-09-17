const jwt = require('jsonwebtoken');
const {
  database,
  collections,
  databaseId,
  databases,
} = require('../utils/appwrite');

const utils = {};

const secretKey = '-d7i_h)-fS45PXtwQ;!V_F!N1D&RtL';
const maxExpiration = 3 * 365 * 24 * 60 * 60;

utils.generateJWT = (userId, email) =>
  jwt.sign({ userId, email }, secretKey, { expiresIn: maxExpiration });

utils.verifyJWT = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        resolve(false);
      } else {
        resolve(decoded);
      }
    });
  });

utils.validateUser = async (token) => {
  const decoded = await utils.verifyJWT(token);
  if (!decoded) return false;
  const user = await databases.getDocument(
    databaseId,
    collections.users,
    decoded?.userId
  );

  if (!user.jwt_token === token) return false;
  return user;
};

module.exports = utils;
