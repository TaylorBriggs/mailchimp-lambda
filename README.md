# MailChimp Lambda

A Lambda function for creating MailChimp subscriptions.

##  Authentication

Set your MailChimp data center, API key, list ID, and username in the `.env` file. Copy the
sample to get started:

```
$ cp .env.sample .env
```

Additional details about authenticating with the MailChimp API is available [here](http://developer.mailchimp.com/documentation/mailchimp/guides/get-started-with-mailchimp-api-3/).

## Deployment

There's a handy script included to create your zip archive:

```
$ npm run zip
```

Integrate with the
[AWS API Gateway](http://docs.aws.amazon.com/lambda/latest/dg/gs-amazon-gateway-integration.html)
to access the function via HTTP POST:

```
$ curl -X POST -H "Content-Type: application/json" \
-d '{ "email": "name@email.com" }' \
YOUR_API_GATEWAY_URL
```
