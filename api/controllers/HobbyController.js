/**
 * HobbyController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');
const twilio = require('twilio');

const accountSid = 'ACc4df0a10f63f2c7040bf98d244f91a5a';
const authToken = '00f0878293d7ff333ccac2ab7d2c9fd4';

const nodemailer = require('nodemailer')
const sparkPostTransport = require('nodemailer-sparkpost-transport')
const transporter = nodemailer.createTransport(sparkPostTransport({
  'sparkPostApiKey': '77ce7a69f72e91093d109b427a89452cd7afd0f2'
}))

var client = new twilio(accountSid, authToken);

var sendSMS = function(recpNum, hobbyText){
    client.messages.create({
        body: hobbyText,
        to: recpNum, 
        from: '+1 626-325-0829'
    }, function(err, mesage){
            if(err){
                console.log(err);
                return;
            }
    });

    }

var sendEMAIL = function(recpEmail, emailTxt){
  transporter.sendMail({
    from: 'lanrea@lanre.co',
    to: recpEmail,
    subject: 'Hello from chronos app',
    html: emailTxt
    }, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(info);
      }
    })
}

  module.exports = {
    insert: function (req, res) {
  
      var allowedParameters = [
        "hobby", "user_email", "user_phone"
      ]
  
      var data = _.pick(req.body, allowedParameters);
  
      Hobby.create(data).then(function (hob) {
        var responseData = {
          hob: hob
        }
        sails.log(data)
        sendEMAIL(req.body.user_email,'You just created a new Hobby '+ req.body.hobby)
        sendSMS(req.body.user_phone,'You just created a new Hobby '+ req.body.hobby)

        return ResponseService.json(200, res, "Hobby created successfully", {responseData})
      }).catch(function (error) {
          if (error.invalidAttributes){
            sails.log(error)
            return ResponseService.json(400, res, "Hobby could not be created", error.Errors)
          }
        }
      )
  
    }
  };