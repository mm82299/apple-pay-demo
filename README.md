# Apple Pay Example Project

This is a basic application that we used to test the Apple Pay production environment.

After studying documentations and seeing some github projects, we discovered that it was not so easy, so we choose to share this repository and thus help other developers.

We use [CIELO](https://developercielo.github.io/manual/cielo-ecommerce#apple-pay) as payment provider, a brazilian payment company.

## Creat a Merchant ID in your Apple Developer area

Go to the [Identifier](https://developer.apple.com/account/resources/identifiers/list/merchant) and creat your Merchant ID. Afther this, you will have an Identifier name like: `com.domainname.appname`.


## The Apple Pay Payment Processing Certificate

You need to send your Merchant ID to your payment provider and then you will receive from then a `.CSR` or a `.certSigningRequest` file.

If you receive a `.PEM` file, rename the extension to `.CSR` and upload the certificate in the Payment Processing Certificate area.

Click twice at the certificate file to install then in your Keychain locally.

## The Apple Pay Merchant Certificate

DON'T USE THE APPLE DOCS to create this certificate. In ther documentation, they create a basic certificate without a private key. WE NEED a private key for the production environment.

Apple docs: https://help.apple.com/developer-account/#/devbfa00fef7

The correct way is creating the certificate by the _Keys_ section of your Keychain Access. 

![RSA Certificate](https://dzwonsemrish7.cloudfront.net/items/2j1O2C0i1Q1x2e1v2w3T/rsa_keychain.png)

![RCA Certificate](https://cl.ly/59c92e83b136/rsa_keychain2.png)

Name the certificate as `merchant_id.cer`. Click twice to install the certificate to your Keychain and then export this certificate as a `.p12` file, like: `merchant_id.p12`. If it asks you to pick a passphrase, you can just leave it blank since we'll be removing it in a second anyway.

![p12 file](https://dzwonsemrish7.cloudfront.net/items/0O2W463L1h212l2l1x1m/p12.png)

Now we'll convert from a .p12 file into a .pem file. Run this command in your terminal:

```
openssl pkcs12 -in merchant_id.p12 -out merchant_id.pem -nodes -clcerts
```

You only'll need the `.PEM` certificate in your server.

## The Merchant Domain

To test locally, you need a HTTPS host, so the best way is using the [ngrok](https://ngrok.com/) app. Install _ngrok_ app and run in a new terminal tab:

```
./ngrok http 3000
```

In another terminal tab, install and run this project:

```
npm install
npm start
```

And access the generated ngrok HTTPS url.

We use Node `v8.9.1` to run this example.


## Thanks

A special thanks to [Tom Dale](https://github.com/tomdale) that help us a lot with their [Apple Pay Merchant Session Server](https://github.com/tomdale/apple-pay-merchant-session-server).

## References

https://github.com/tomdale/apple-pay-merchant-session-server

https://gist.github.com/jagdeepsingh/c538e21f3839f65732a5932e35809d60

https://github.com/norfolkmustard/ApplePayJS

https://developer.apple.com/videos/play/wwdc2016/703/

https://applepaydemo.apple.com/

