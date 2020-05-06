const Discord= require('discord.js');
const path = require('path');
const fs = require('fs');
const randomInt = require('random-int');
const bot = new Discord.Client();
const imgfolder = "/home/vliaskovitis/Documents/rpg/BPG001_Shab-al-Hiri-Roach/";
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
		cardsleft = decksize;
		console.log("Found: ",matches, " files");
	}
	if (msg.content === "draw"){
		var found=0
		if(cardsleft == 0){
			console.log("Deck is empty.");
		}
		else {
		var found=0;
		var cardid=0;
		while(found == 0){
			cardid = randomInt(decksize-1);
			if (drawn[cardid] == 0) {
				found = 1;
				drawn[cardid] = 1;
				cardsleft--;
			}
		}
		
		msg.author.send("You draw a card:", {files: [deck[cardid]]});
		msg.channel.send('draws a card! ', cardid);
		}
	}
})

bot.login(token);



