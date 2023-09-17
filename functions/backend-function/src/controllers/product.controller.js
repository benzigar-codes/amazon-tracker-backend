const axios = require('axios');
const { databases, collections, databaseId, id } = require('../utils/appwrite');
const { Query } = require('node-appwrite');

const controller = {};

const rapidAPIKey =
  process?.env?.rapidAPIKey ??
  '4eaa5687e3mshd062b2f8ac473ddp1ce629jsn1716e0cb869a';
const rapidAPIHost =
  process?.env?.rapidAPIHost ?? 'real-time-amazon-data.p.rapidapi.com';

controller.getDatabases = async () => {
  const dbs = await databases.list();
  return dbs;
};

controller.searchProduct = async (req) => {
  const search = req?.searchQuery ?? 'iPhone 14 Pro';

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://real-time-amazon-data.p.rapidapi.com/search?query=${search}&country=IN`,
    headers: {
      'X-RapidAPI-Key': rapidAPIKey,
      'X-RapidAPI-Host': rapidAPIHost,
    },
  };

  const { data } = await axios.request(config);

  for (const each of data?.data?.products) {
    const ifExist = await databases.listDocuments(
      databaseId,
      collections.products,
      [Query.equal('product_id', each.asin)]
    );

    if (ifExist.total === 0) {
      await databases.createDocument(databaseId, collections.products, id(), {
        product_id: each?.asin,
        name: each?.product_title,
        price: parseInt(each?.product_price?.replace(/₹|,/g, '')),
        rating: parseFloat(each?.product_star_rating),
        reviews: each?.product_num_ratings,
        image: each?.product_photo,
        link: each?.product_url,
        status: 'ACTIVE',
      });
    }
  }

  return {
    result: 'OK',
    data:
      data?.data?.products?.map((each) => ({
        product_id: each?.asin,
        name: each?.product_title,
        price: parseInt(each?.product_price?.replace(/₹|,/g, '')),
        rating: parseFloat(each?.product_star_rating),
        reviews: each?.product_num_ratings,
        image: each?.product_photo,
        link: each?.product_url,
        status: 'ACTIVE',
      })) ?? [],
  };
};

controller.getSuggestedProducts = async () => {
  const data = await databases.listDocuments(databaseId, collections.products, [
    Query.orderDesc('$createdAt'),
    Query.limit(40),
  ]);

  return {
    statusCode: 200,
    data: data.documents,
  };
};

controller.getPinnedProducts = async (req) => {
  let products = [];

  const productIds = await databases.listDocuments(
    databaseId,
    collections.userPinnedProducts,
    [Query.equal('user_id', req?.user?.$id)]
  );
  if (productIds.total > 0) {
    const productList = await databases.listDocuments(
      databaseId,
      collections.products,
      [
        Query.equal(
          '$id',
          productIds?.documents?.map((each) => each.product_id)
        ),
      ]
    );
    if (productList.total > 0) products = productList?.documents;
  }

  return {
    statusCode: 200,
    data: products,
  };
};

controller.pinProduct = async (req) => {
  if (!req?.productId)
    return {
      statusCode: 400,
    };
  const userId = req?.user?.$id;

  // IF VALID PRODUCT ID
  const ifValid = await databases.listDocuments(
    databaseId,
    collections.products,
    [Query.equal('$id', req?.productId)]
  );

  if (ifValid.total === 0) {
    return {
      statusCode: 400,
      message: 'Invalid Product Id',
    };
  }

  if (req?.pinStatus === true) {
    const ifPinned = await databases.listDocuments(
      databaseId,
      collections.userPinnedProducts,
      [
        Query.equal('user_id', userId),
        Query.equal('product_id', req?.productId),
      ]
    );
    if (ifPinned.total === 0)
      await databases.createDocument(
        databaseId,
        collections.userPinnedProducts,
        id(),
        {
          user_id: userId,
          product_id: req?.productId,
          pinned_time: new Date(),
        }
      );
  } else {
    const ifData = await databases.listDocuments(
      databaseId,
      collections.userPinnedProducts,
      [
        Query.equal('user_id', userId),
        Query.equal('product_id', req?.productId),
      ]
    );
    if (ifData.total === 1) {
      await databases.deleteDocument(
        databaseId,
        collections.userPinnedProducts,
        ifData?.documents?.[0]?.$id
      );
    }
  }

  return {
    statusCode: 200,
    message: 'OK',
  };
};

controller.checkPinned = async (req) => {
  if (!req?.productId)
    return {
      statusCode: 400,
    };

  const ifPinned = await databases.listDocuments(
    databaseId,
    collections.userPinnedProducts,
    [
      Query.equal('user_id', req?.user?.$id),
      Query.equal('product_id', req?.productId),
    ]
  );

  if (ifPinned.total > 0)
    return {
      statusCode: 200,
      pinStatus: true,
    };
  else
    return {
      statusCode: 200,
      pinStatus: false,
    };
};

module.exports = controller;
