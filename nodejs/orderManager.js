"use strict";

const uuidv1 = require("uuid/v1");
const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();
const kinesis = new AWS.Kinesis();

const TABLE_NAME = process.env.orderTableName;
const STREAM_NAME = process.env.orderStreamName;

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
  return saveNewOrder(order).then(() => {
    return placeOrderStream(order);
  });
};

function saveNewOrder(order) {
  // the function returns a promise
  const params = {
    TableName: TABLE_NAME,
    Item: order,
  };

  return dynamo.put(param).promise();
}

function placeOrderStream(order) {
  // the function returns a promise
  const params = {
    Data: JSON.stringify(order),
    PartitionKey: order.orderId,
    StreamName: STREAM_NAME,
  };

  return kinesis.putRecord(params).promise();
}
