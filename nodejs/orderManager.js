"use strict";

const uuidv1 = require("uuid/v1");
const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.orderTableName;

module.export.createOrder = (body) => {
  const order = {
    orderId: uuidv1(),
    name: body.name,
    address: body.address,
    productId: body.productId,
    qty: body.qty,
    orderDate: Date.now(),
    eventType: "order_placed",
  };

  return order;
};

module.export.placeNewOrder = (order) => {
  // save order in db
  // put order into stream
  return saveNewOrder(order);
};

function saveNewOrder(order) {
  // the function returns a promise
  const params = {
    TableName: TABLE_NAME,
    Item: order,
  };

  return dynamo.put(param).promise();
}
