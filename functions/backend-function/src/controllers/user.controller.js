const { Query } = require('node-appwrite');
const { databases, collections, databaseId } = require('../utils/appwrite');
const jwt = require('../utils/jwt');

const controller = {};

controller.getAllUsers = async () => {
  const data = await databases.listDocuments(databaseId, collections.users);

  return data;
};

controller.login = async (req) => {
  const user = await databases.listDocuments(databaseId, collections.users, [
    Query.equal('email', req?.email),
    Query.equal('password', req?.password),
  ]);

  if (user.total === 1) {
    const token = jwt.generateJWT(
      user.documents?.[0].$id,
      user.documents?.[0].email
    );
    await databases.updateDocument(
      databaseId,
      collections.users,
      user?.documents?.[0]?.$id,
      {
        jwt_token: token,
      }
    );
    return {
      statusCode: 200,
      user: {
        ...user?.documents?.[0],
        jwt_token: token,
      },
    };
  } else
    return {
      statusCode: 400,
      user: {},
    };
};

module.exports = controller;
