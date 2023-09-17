const productController = require('./controllers/product.controller');
const userController = require('./controllers/user.controller');
const { validateUser } = require('./utils/jwt');

module.exports = async (req, res) => {
  console.log(JSON.stringify(req, null, 4));

  let request = {};

  if (req?.payload) request = JSON.parse(req?.payload);

  if (request?.action === 'searchProducts') {
    const data = await productController.searchProduct(request);
    return res.json(data);
  }

  if (request?.action === 'getDatabases') {
    const data = await productController.getDatabases(request);
    return res.json(data);
  }

  if (request?.action === 'login') {
    const data = await userController.login(request);
    return res.json(data);
  }

  if (request?.action === 'getPinnedProducts') {
    const user = await validateUser(request?.userToken);
    if (!user) return { statusCode: 401 };
    request.user = user;
    const data = await productController.getPinnedProducts(request);
    return res.json(data);
  }

  if (request?.action === 'pinProduct') {
    const user = await validateUser(request?.userToken);
    if (!user) return { statusCode: 401 };
    request.user = user;
    const data = await productController.pinProduct(request);
    return res.json(data);
  }

  if (request?.action === 'checkPinned') {
    const user = await validateUser(request?.userToken);
    if (!user) return { statusCode: 401 };
    request.user = user;
    const data = await productController.checkPinned(request);
    return res.json(data);
  }

  if (request?.action === 'getSuggestedProducts') {
    const user = await validateUser(request?.userToken);
    if (!user) return { statusCode: 401 };
    request.user = user;
    const data = await productController.getSuggestedProducts(request);
    return res.json(data);
  }

  if (request?.action === 'getUserDetails') {
    const data = await productController.getDatabases(request);
    return res.json(data);
  }

  if (request?.action === 'getUsers') {
    const data = await userController.getAllUsers(request);
    return res.json(data);
  }

  return res.json({
    message: 'hello world',
  });
};
