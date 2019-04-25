/*Student: Jimmy Toler
  Homework #11 final project
  Class: CSc 337
  Term: Spring 2019
  Assignment description: this is the final project for csc 337,
  this program sells tickets to different locations,
*/
"use strict";
const express = require("express");
const app = express();

const fs = require("fs");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.post('/', jsonParser, function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	let name = req.body.name;
	fs.writeFile("graph.txt", name, function(err) {
    	if(err) {
			res.send("failed to append");
    	}
      console.log("Success! written");
    	res.send("Success! written");
	});


})
//this method gets the messages from the message.txt file
function getMessages(){
  let messages = [];
  let line = [];
  try {
     line = fs.readFileSync("messages.txt", 'utf8').split("\n");
   }catch(e) {
     console.log(e);
     }
  let i = 0;
  for (i = 0; i <line.length; i++){
    let messageString = line[i].split(":::");
    if (messageString.length != 2){
      continue;
    }else{
    messages.push({"name": messageString[0], "message":messageString[1]});
  }
  }
 let messageJSON = {"messages":messages};
 return messageJSON;
}
app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
  return res.send(JSON.stringify(getMessages()));
})

app.listen(process.env.PORT);
