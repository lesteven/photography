const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const Locked = require('../models/locked');
const config = require('../../../config.js');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(config.sendgrid.API_KEY);

module.exports = function (passport, res) {
  passport.use('login', new LocalStrategy(
    {
      passReqToCallback: true,
    },

    ((req, username, password, done) => {
      User.findOne({ username }, (err, user) => {
        if (err) {
          return res.json({ err: 'there was an error' });
        }

        if (!user || !user.validPassword(password)) {
          if (user && user.locked) {
            // console.log('account has been locked');
            return res.json({ err: 'an error occured' });
          }
          if (user) {
            preventBrute(user, req);
          }
          return res.json({ err: 'Invalid ID or password' });
        }
        if (user.locked) {
          // console.log('account has been locked');
          return res.json({ err: 'an error occured' });
        }
        req.login(user, (err) => {
          if (err) {
            return res.json({ err: 'there was an error' });
          }
          user.attempts = 0;
          user.save((err, user) => {
            if (err) return console.error(err);
          });

//          console.log(user);

          return res.json({
            user: user.username,
            redirect: true,
          });
        });
      });
    }),

  ));
};
// prevent brute force attack on accounts
function preventBrute(user, req) {
  if (user.attempts < 10) {
    user.attempts += 1;
  } else {
    user.attempts = 0;
    user.locked = true;

    const url = generateUnlock();
    addLockedToDB(user.username, url);
    const host = req.get('host');
    const fullUrl = `${host}/api/locked/${url}`;
    sendEmail(fullUrl);
  }
//  console.log(user);
//  console.log(user.attempts);
  user.save((err, user) => {
    if (err) return console.error(err);
  });
}

// send email to user to warn of locked account
function sendEmail(url) {
  const email = {
	  to: config.email,
	  from: 'blog.imstevenle@support.com',
	  subject: 'Account Locked',
	  text: `Your account has been locked, go to link to unlock it\n${
      url}`,
  };
  // console.log(email);
  sgMail.send(email);
}

// generate random alphanumeric string for pw unlock url
function generateUnlock() {
  const alphaNum = '1234567890abcdefghijklmnopqrstuvwxyz';
  let string = '';
  const len = alphaNum.length;

  for (let i = 0; i < 62; i++) {
    const place = Math.floor(Math.random() * len);
    string += alphaNum[place];
  }
  return string;
}

// add locked user to db
function addLockedToDB(username, url) {
  const account = new Locked({
    username,
    url,
  });
  account.save((err, locked) => {
    if (err) return console.log(err);
  });
//  console.log(account);
}

