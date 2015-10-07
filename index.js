require('dotenv').load();

var Promise = require('es6-promise').Promise,
    request = require('superagent'),
    md5     = require('md5');

var API_URL  = 'https://us9.api.mailchimp.com/3.0/lists/',
    API_KEY  = process.env.API_KEY,
    LIST_ID  = process.env.LIST_ID,
    USERNAME = process.env.USERNAME,
    STATUS   = 'pending';

function urlForList() {
  return API_URL + LIST_ID + '/members/';
}

function urlForUser(emailAddress) {
  return urlForList() + md5(emailAddress);
}

function updateSubscription(emailAddress) {
  return new Promise(function(resolve, reject) {
    request.patch(urlForUser(emailAddress))
      .auth(USERNAME, API_KEY)
      .send({ status: STATUS })
      .end(function(err, res) {
        if (err) {
          reject({ status: err.status, message: err.response.text });
        } else {
          resolve(res.body);
        }
      });
  });
}

function createSubscription(emailAddress) {
  return new Promise(function(resolve, reject) {
    request.post(urlForList())
      .auth(USERNAME, API_KEY)
      .send({ email_address: emailAddress, status: STATUS })
      .end(function(err, res) {
        if (err) {
          reject({ status: err.status, message: err.response.text });
        } else {
          resolve(res.body);
        }
      });
  });
}

exports.handler = function(event, context) {
  var emailAddress = event.email;

  function create() {
    createSubscription(emailAddress)
      .then(function(responseBody) {
        context.succeed(responseBody);
      })
      .catch(function(err) {
        context.fail(new Error(err));
      });
  }

  updateSubscription(emailAddress)
    .then(function(responseBody) {
      context.succeed(responseBody);
    })
    .catch(function(err) {
      if (err.status === 404) {
        create();
      }
    });
};
