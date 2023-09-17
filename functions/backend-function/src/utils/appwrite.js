const sdk = require('node-appwrite');

const client = new sdk.Client();
const databases = new sdk.Databases(client);

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('650544da77c938948ffe')
  .setKey(
    'ec429880891c247ec8c247ba7d944f463f73ef5257e93f93f9dd8961941250bc386b94af201bebbd7d77f960d2525281f2c5d66559b27743d1ae116295f2d830cdc54551c76d5a01e4ff577d3bd96e58aaabea5c53b3c6e85ac0b9958e1f6e58f02692ce51c2f45d6e41434bda60706c5cdd49dc30a33edd22763cffd851c6a3'
  );

const collections = {
  users: '65065e03576987abd534',
  products: '65065e08a7838afd7e88',
  userPinnedProducts: '65065e0ed4861e2a2dfd',
};

module.exports = {
  databases,
  collections,
  databaseId: '65065dfda33bfe77ceb5',
  id: sdk.ID.unique,
};
