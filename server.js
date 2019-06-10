/* Referente:
  https://github.com/tomdale/apple-pay-merchant-session-server
  https://github.com/norfolkmustard/ApplePayJS
  https://developer.apple.com/videos/play/wwdc2016/703/
  https://applepaydemo.apple.com/

  README:

  To run local: npm start
  Node version: 8.9.1

*/

var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var CERT_PATH = './merchant_id.pem';

var cert = fs.readFileSync(CERT_PATH, 'utf8');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/.well-known/apple-developer-merchantid-domain-association.txt', function(req, res) {
  res.sendFile(__dirname + '/.well-known/apple-developer-merchantid-domain-association.txt');
});

app.get('/merchant-session/new', function(req, res) {
  var url = req.query.validationURL || 'https://apple-pay-gateway-cert.apple.com/paymentservices/startSession';
  var options = {
    method: 'POST',
    url: url,
    cert: cert,
    key: cert,
    body: {
      merchantIdentifier: 'merchant.com.CIELO.storedecommerce',
      displayName: 'Stored Appple Pay test',
      initiative: 'web',
      initiativeContext: '1e83338f.ngrok.io'
    },
    json: true
  };

  request.post(options, function(error, response, body) {
    if (error) throw new Error(error)
    res.send(body);
  });
});

app.post('/call-payment-provider', function(req, res) {
  console.log('request:', req.body)

  let paymentData = req.body.paymentData;
  var options = {
    method: 'POST',
    url: 'https://api.cieloecommerce.cielo.com.br/1/sales',
    headers: { 
      merchantkey: 'uFqxlaPBMdP79vd1ljt4HK8Fi9bb9ddmWTPrK8RF',
      merchantid: '261c4632-69d9-4bff-a4ac-f5fc0155c925',
      'content-type': 'application/json'
    },
    body: { 
      MerchantOrderId: paymentData.header.transactionId,
      Payment: { 
        CreditCard: {
          SaveCard: true
        },
        Type: 'CreditCard',
        Amount: 100,
        Provider: 'Cielo',
        Installments: 1,
        Currency: 'BRL',
        Wallet: { 
          Type: 'ApplePay',
          WalletKey: paymentData.data,
          AdditionalData: {
            EphemeralPublicKey: paymentData.header.ephemeralPublicKey
          }
        } 
      } 
    },
    json: true 
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log('req2 ####################: ', body);
    res.send(body);
  });
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Apple Pay server running on ' + server.address().port);
  console.log('GET /merchant-session/new to retrieve a merchant session');
});

