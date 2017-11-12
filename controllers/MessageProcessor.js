'use strict';

const Config = require('../Config');
const request = require('request');
const PersonalityInsightsV2 = require('watson-developer-cloud/personality-insights/v2');
const personality_insights = new PersonalityInsightsV2({
  username: 'e522c7fd-844f-48e2-8823-73a9c7ca6218',
  password: 'L12frKCDLoyd'
});


module.exports = function () {
	
	module.processMessage = function (sender, text) {
		var quickReply;
	 	var replyText;
	 	var messageData
		if(text == "Help" || text == "hello" || text == "hi" || text == "Hello" || text == "Hi" || text == "HELLO" || text == "HI")
	    {
	     	replyText = "welcome to personality checker.For what purpose do you wanna use it ?"
			quickReply = [
			   {
			     "content_type":"text",
			     "title":"celeb/political",
			     "payload":"celeb/political"
			   },
			   {
			     "content_type":"text",
			     "title":"FB life partner",
			     "payload":"FB life partner"
			   },
			   {
			     "content_type":"text",
			     "title":"general",
			     "payload":"general"
			   }
			]


			messageData = {
				"text":replyText,
				"quick_replies": quickReply, 		
			}
			this.sendRequest(sender,messageData)

	    }
	    else if(text == "celeb/political")
	    {
	     	replyText = "Enter the facebook userId for that person.Follow the below url to get the fb userId: https://programous.com/demo.png"

			messageData = {
				"text":replyText, 		
			}
			this.sendRequest(sender,messageData)
	    }

	    else if(text == "FB life partner")
	    {
			messageData = {
				"attachment":{
      				"type":"template",
      				"payload":{
        				"template_type":"button",
        				"text":"You have to login first",
						"buttons":[
							{
				 				"type": "account_link",
				  				"url": "http://grabyourjob.com/"
							}
						]        
			     	}
			   }
			}   

			this.sendRequest(sender,messageData)
	    }
	    else if(text == "general")
	    {
	    	replyText = "Enter the speech given by personality.Text should have minimum 100 Words."
			quickReply = [
			   {
			     "content_type":"text",
			     "title":"Help",
			     "payload":"Help"
			   }
			]

			messageData = {
				"text":replyText,
				"quick_replies": quickReply, 		
			}
			this.sendRequest(sender,messageData)
	    }

		else
		{

			if(text.length < 100)
			{

				console.log("calling graph api");
				var preThis = this;			
				request({
					url: "https://graph.facebook.com/"+text+"/feed?access_token=EAAbwQeIq1HsBADkYxWtMNtLQZBuJREp86GxJkPRyQcd4ROg3KPiRxuoRUsXan7a7EtfhKY221GBZC0HrVJRZBvXhsp6ZBgN4xG9aQhcwNZAi0W2OF1jTB92zJIZBlBPOoZAcdnyhz5UCS4YeVdMHJETdPsAWNspsk66pp018uuF8GCKMR5ZAJR6pqUhuvXRJQDcSRNjAypgWrQZDZD",
					method: "GET",
				}, function(error, response, body) {
					var graphResponse = JSON.parse(response.body)
					//console.log(graphResponse)
					if(graphResponse.data)
					{	
						var ibmReq
						for (let i = 0; i < graphResponse.data.length; i++) {
							let msg = graphResponse.data[i].message
							ibmReq = ibmReq + "."+ msg;
						}
						console.log("calling IBM watson");
						//console.log(ibmReq)
						personality_insights.profile(
						  {
						    text:ibmReq
						  },
						  function(err, response) {
						    if (err) {
						      console.log('error:', err);
						    } else {
						      console.log(JSON.stringify(response, null, 2));	
						      //console.log(response.tree.children[0].children[0].children[0].children[0].percentage);
						      replyText = "Self-transcendence:" + (response.tree.children[2].children[0].children[4].percentage * 100).toFixed(2) + " %\n";
						      replyText = replyText + "Imagination:" + (response.tree.children[0].children[0].children[0].children[3].percentage * 100).toFixed(2) + " %\n";
						      replyText = replyText + "Openness   :" + (response.tree.children[0].children[0].children[0].percentage * 100).toFixed(2) + " %\n";
						      replyText = replyText + "Energetic  :" + (response.tree.children[0].children[0].children[2].children[0].percentage * 100).toFixed(2) + " %\n";
						      replyText = replyText + "Sociable   :" + (response.tree.children[0].children[0].children[2].children[5].percentage * 100).toFixed(2) + " %\n";
						      replyText = replyText + "Dutifulness:" + (response.tree.children[0].children[0].children[1].children[2].percentage * 100).toFixed(2) + " %\n";

						      quickReply = [
							   	{
							     "content_type":"text",
							     "title":"Help",
							     "payload":"Help"
							   	}
							  ]
						      messageData = {
							  	"text":replyText,
								"quick_replies": quickReply, 		
							  }
						      preThis.sendRequest(sender,messageData)	
						    }
						  }
						);
					}
					else
					{
						replyText = "Sorry,I didn't get you"
						quickReply = [
						   {
						     "content_type":"text",
						     "title":"Help",
						     "payload":"Help"
						   }
						]
						messageData = {
							"text":replyText,
							"quick_replies": quickReply, 		
						}
						preThis.sendRequest(sender,messageData)
					}	
				});

			}
			else
			{
				var preThis = this;
				console.log("calling IBM watson");
				personality_insights.profile(
				  {
				    text:text
				  },
				  function(err, response) {
				    if (err) {
				      console.log('error:', err);
				    } else {
				      
				      replyText = "Self-transcendence:" + (response.tree.children[2].children[0].children[4].percentage * 100).toFixed(2) + " %\n";
				      replyText = replyText + "Imagination:" + (response.tree.children[0].children[0].children[0].children[3].percentage * 100).toFixed(2) + " %\n";
				      replyText = replyText + "Openness   :" + (response.tree.children[0].children[0].children[0].percentage * 100).toFixed(2) + " %\n";
				      replyText = replyText + "Energetic  :" + (response.tree.children[0].children[0].children[2].children[0].percentage * 100).toFixed(2) + " %\n";
				      replyText = replyText + "Sociable   :" + (response.tree.children[0].children[0].children[2].children[5].percentage * 100).toFixed(2) + " %\n";
				      replyText = replyText + "Dutifulness:" + (response.tree.children[0].children[0].children[1].children[2].percentage * 100).toFixed(2) + " %\n";

				      quickReply = [
					   	{
					     "content_type":"text",
					     "title":"Help",
					     "payload":"Help"
					   	}
					  ]
				      messageData = {
					  	"text":replyText,
						"quick_replies": quickReply, 		
					  }
				      preThis.sendRequest(sender,messageData)	
				    }
				  }
				);
			}	
		}
	};


	module.sendRequest = function (sender,messageData)
	{
		request({
			url: "https://graph.facebook.com/v2.6/me/messages",
			qs : {access_token: Config.FB_PAGE_TOKEN},
			method: "POST",
			json: {
				recipient: {id: sender},
				sender_action:"typing_off",
			}
		}, function(error, response, body) {
			
				
		})
		request({
			url: "https://graph.facebook.com/v2.6/me/messages",
			qs : {access_token: Config.FB_PAGE_TOKEN},
			method: "POST",
			json: {
				recipient: {id: sender},
				message : messageData,
			}
		}, function(error, response, body) {
			if (error) {
				console.log("sending error")
			} else if (response.body.error) {
				console.log(response.body.error)
			}
		})


	}

	return module;
};
