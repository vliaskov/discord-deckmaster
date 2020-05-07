const Discord= require('discord.js');
const path = require('path');
const fs = require('fs');
const randomInt = require('random-int');
const bot = new Discord.Client();
//const imgfolder = "/home/vliaskovitis/Documents/rpg/BPG001_Shab-al-Hiri-Roach/";
const imgfolder = "/home/vliaskovitis/Documents/rpg/CthulhuConfidential-Test/";
var drawn = []
var deck = []
var matches;
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

function drawCard(msg, hidden){

	if(decksize == 0){
		console.log("Deck is empty.");
	}
	else {
		var cardid=0;
		cardid = randomInt(decksize-1);

		console.log('draws card! ', cardid, " ", deck[cardid]);

		if (hidden == 1) {
			msg.author.send("You draw a card:", {files: [deck[cardid]]});
		} else {
			msg.channel.send("You draw a card:", {files: [deck[cardid]]});
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
	if (msg.content === "HELLO"){
		msg.reply('HELLO FRIEND!');
		msg.channel.send("My Bot's message", {files: ["/home/vliaskovitis/Pictures/puppet.jpg"]});
		msg.author.send("My Bot's message", {files: ["/home/vliaskovitis/Pictures/puppet.jpg"]});
		msg.author.send("But really.. keep it quiet. Friend.")
	}
	if (msg.content === "createdecks"){

		decksize = findFiles(imgfolder, '.png');
		console.log("Found: ",matches, " files");
	}
	if (msg.content === "draw"){
		drawCard(msg, 1);
	}
	if (msg.content === "flip"){
		drawCard(msg, 0);
	}
})

bot.login(token);



