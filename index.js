const Discord= require('discord.js');
const path = require('path');
const fs = require('fs');
const randomInt = require('random-int');
const bot = new Discord.Client();
const imgfolder = "/home/vliaskovitis/Documents/rpg/BPG001_Shab-al-Hiri-Roach/";
//const imgfolder = "/home/vliaskovitis/Documents/rpg/CthulhuConfidential-Test/";
var drawn = []
var deck = []
var matches;
var Jimp = require('jimp'); 
const token = '';

function findFiles(startPath, filter){
	matches=0;
        if (!fs.existsSync(startPath)){
          console.log("no directory ",startPath);
          return;
        }
	files = fs.readdirSync(imgfolder);
	for (var i=0;i<files.length;i++){
		var filename=path.join(startPath,files[i]);
		if (filename.indexOf(filter)>=0) {
            		console.log('-- found: ',filename);
			drawn[matches]=0;
			deck[matches]=filename;
			matches++;
		}
	}
	return matches;
}

function drawCard(msg, hidden, rotate){

	if(decksize == 0){
		console.log("Deck is empty.");
	}
	else {
		var cardid=0;
		cardid = randomInt(decksize-1);
		var card = deck[cardid];
		console.log('draws card! ', cardid, " ", card);

		if (rotate) {
		var rotated = "/mnt/devel/discord-deckmaster/tmp.png";
		console.log('draws card! ', cardid, " ", card);
  
		Jimp.read(card, (err, rotatedimage) => {
  			if (err) throw err;
			rotatedimage
		    	    .rotate(180)
			    .write(rotated, () => {
				console.log('written rotated card!');
				rotatedimage_written = 1;
				if (hidden == 1) {
					msg.author.send("Same card rotated:", {files: [rotated]});
				}
				else {
					msg.channel.send("Same card rotated:", {files: [rotated]});
				}
				}
				); // save
		});

                }

		if (hidden == 1) {
			msg.author.send("You draw a card:", {files: [card]});
		} else {
			msg.channel.send("You draw a card:", {files: [card]});
		}
		for(var i=cardid; i<decksize-1; i++) {
			deck[i]=deck[i+1];
		}
		decksize--;
	}
}

bot.on('ready', () =>{
	console.log('This bot is online!');
});

bot.on('message', msg=>{
	if (msg.content === "createdecks"){

		decksize = findFiles(imgfolder, '.png');
		console.log("Found: ",matches, " files");
	}
	if (msg.content === "draw"){
		drawCard(msg, 1, 0);
	}
	if (msg.content === "flip"){
		drawCard(msg, 0, 0);
	}
	if (msg.content === "drawrotate"){
		drawCard(msg, 1, 1);
	}
})

bot.login(token);



