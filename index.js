'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const Config = require('./Config');
const MessageProcessor = require('./controllers/MessageProcessor')();
const PostbackHandler = require('./controllers/PostbackHandler')();

const app = express()

app.set('port', (process.env.PORT || 4000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.get('/', function(req, res) {
	if (req.query['hub.verify_token'] === "dbcorpFirstBot") {
		console.log("sdfs");
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
});

app.post('/', (req, res) => {
  const data = req.body;
  if (data.object === 'page') {
    data.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        const sender = event.sender.id;
	    if (event.message && !event.message.is_echo) {
	        if (event.message.text){	          
	        	request({
					url: "https://graph.facebook.com/v2.6/me/messages",
					qs : {access_token: Config.FB_PAGE_TOKEN},
					method: "POST",
					json: {
						recipient: {id: sender},
						sender_action:"typing_on",
					}
				}, function(error, response, body) {
						//console.log("before calling" + event.message.text)	
				});
	        	MessageProcessor.processMessage(sender, event.message.text);	          
	        } 
	    }else if (event.postback) {
	       
	       	request({
				url: "https://graph.facebook.com/v2.6/me/messages",
				qs : {access_token: Config.FB_PAGE_TOKEN},
				method: "POST",
				json: {
					recipient: {id: sender},
					sender_action:"typing_on",
				}
			}, function(error, response, body) {
				if (error) {
					console.log("sending error")
				} else if (response.body.error) {
					console.log("response body error")
				}
			});	
	        PostbackHandler.handlePostback(
	            sender,
	            event.postback.payload,
	            event.postback.referral
	          );
	    }
        
      });
    });
    res.status(200).json({
      status: 'success',
      code: 200,
    });
  } else {
    res.status(400).json({
      status: 'error',
      code: 400,
    });
  }
});

app.get('/authorize',function(resq,res){

	console.log("request got");
});


app.listen(app.get('port'), function() {
	console.log("Server running on port 4000 : ")
})
