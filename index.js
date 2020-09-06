const Discord= require('discord.js');
const path = require('path');
const fs = require('fs');
const randomInt = require('random-int');
var glob = require("glob");
require("dotenv").config()

const bot = new Discord.Client();
const imgfolder = "/home/vliaskovitis/Documents/rpg/BPG001_Shab-al-Hiri-Roach/";
//const imgfolder = "/home/vliaskovitis/Documents/rpg/CthulhuConfidential-Test/";
/*
createdeck suspects /home/vliaskovitis/Documents/rpg/ALICE/suspects 1
createdeck suspects /home/vliaskovitis/Documents/rpg/ALICE/suspects 0
createdeck locations /home/vliaskovitis/Documents/rpg/ALICE/locations 1
createdeck locations /home/vliaskovitis/Documents/rpg/ALICE/locations 0
createdeck search /home/vliaskovitis/Documents/rpg/ALICE/search 1
createdeck time /home/vliaskovitis/Documents/rpg/ALICE/time 1
createdeck characters /home/vliaskovitis/Documents/rpg/ALICE/characters 1
createdeck finalsuspects sfsdfds 1
createdeck finallocations sdfsdfsd 1

addcard /home/vliaskovitis/Documents/rpg/ALICE/suspects/teacher.png finalsuspects
*/


var drawn = []
var decks = []
var decksizes = []
var decknames = []
var matches;
var Jimp = require('jimp'); 
const token = '';
globaldeckid = 0;

function findFiles(startPath, filter, deckname, needreset){
        reset = parseInt(needreset);
	matches=0;
        newdeck = 0;

        deckid = findDeck(deckname);
        if (deckid == -1) {
                deckid = globaldeckid;
                decks[deckid] = [];
                deck = decks[deckid];
                decknames[deckid] = deckname;
                decksizes[deckid] = 0;
                newdeck = 1;
        }
        if (deckid != -1 && reset) {
                decks[deckid] = [];
                deck = decks[deckid];
                decksizes[deckid] = 0;
        }

        if (!fs.existsSync(startPath)){
          console.log("no directory ",startPath);
          //return;
        } else {
	files = fs.readdirSync(startPath);
	for (var i=0;i<files.length;i++){
		var filename=path.join(startPath,files[i]);
		if (filename.indexOf(filter)>=0) {
            		console.log('-- found: ',filename);
			drawn[matches]=0;
			deck[matches]=filename;
			matches++;
		}
	}
        }
        decksizes[deckid] += matches;
        if (newdeck)
                globaldeckid++;
        console.log("Deck ", deckname, " has ", decksizes[deckid], " cards");
	return matches;
}

function addCardToDeck(imgfolder, deckname, cardname){
        var startPath = imgfolder;
        var path = startPath.concat(cardname.trim());
        path = path.concat(".png");
        if (!fs.existsSync(path)){
          console.log("File not found: ",path, " for card: ", cardname);
          return;
        } else {
        deckid = findDeck(deckname);
        deck = decks[deckid];
        decksize = decksizes[deckid];
	deck[decksize] = path;
        console.log("before addcardtodeck ", path , " Deck ", deckname, " has ", decksizes[deckid], " cards");
        decksizes[deckid]++;
        console.log("after addcardtodeck ", path, " Deck ", deckname, " has ", decksizes[deckid], " cards");
        }
}

function findDeck(deckname) {
        for (var i=0; i<decknames.length; i++) {
                if (!decknames[i].localeCompare(deckname)) {
                        console.log("Deck found", deckname);
                        return i;
                }
        }
        console.log("Deck not found", deckname);
        return -1;
}

function addRandomFromSet(imgfolder, deckname, string) {
        deckid = findDeck(deckname);
        deck = decks[deckid];
        decksize = decksizes[deckid];
        glob(imgfolder + '*' + string + '*png', {}, (err, files)=>{
	  cardid = randomInt(files.length - 1);
          deck[decksize] = files[cardid];
          console.log("adding ", files[cardid], "to deck: ", deckname);
          decksizes[deckid]++;
        })
}

function drawSpecificCard(msg, imgfolder, deckname, name){
        deckid = findDeck(deckname);
        deck = decks[deckid];
        decksize = decksizes[deckid];
	if(decksize == 0){
		console.log("Deck is empty.");
	}
	else {
		console.log("Card argument:", name);
                var startPath = imgfolder;
                var path = startPath.concat("/");
                path = path.concat(name);
                path = path.concat(".png");
		//console.log("Draw card:", path);
                if (!fs.existsSync(path)){
		        console.log("File not found");
                        return;
                }

		var cardid=-1;
		for(var i=0; i<decksize-1; i++) {
                        if (!path.localeCompare(deck[i]))
                                cardid = i;
                }
                if (cardid == -1) {
		        console.log("Card not found");
                        return;
                }
                     
	        msg.author.send("You draw a card:", {files: [path]});
	        console.log("Draw card:", path, " id ", cardid);

		for(var i=cardid; i<decksize-1; i++) {
			deck[i]=deck[i+1];
		}
                decksizes[deckid]--;
	}
}

function drawMatchingRegexCard(msg, imgfolder, deckname, match){
        var foundmatch = 0;
        deckid = findDeck(deckname);
        deck = decks[deckid];
        decksize = decksizes[deckid];
	if(decksize == 0){
		console.log("Deck is empty.");
	}
	else {
                for (var i=0; i< decksize - 1; i++) {

                        if(deck[i].includes(match)) {

                                console.log("Card found matching pattern:", deck[i]);
                                var path = deck[i];

                                if (!fs.existsSync(path)){
                                        console.log("File not found");
                                        return;
                                }

                                cardid=i;

                                msg.author.send("You draw a card:", {files: [path]});
                                console.log("Draw card:", path, " id ", cardid);

                                for(var j=cardid; j<decksize-1; j++) {
                                        deck[j]=deck[j+1];
                                }
                                decksizes[deckid]--;
                                foundmatch = 1;
                                break;
                        }
                }

	}

        if (foundmatch == 0) {
	        console.log("Cards containing pattern ", match, "not found");
                return;
        }
}

function drawCard(msg, hidden, rotate, deckname){

        deckid = findDeck(deckname);
        deck = decks[deckid];
        decksize = decksizes[deckid];
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
                decksizes[deckid]--;
	}
}

bot.on('ready', () =>{
	console.log('This bot is online!');
});

bot.on('message', msg=>{
	if (msg.content.includes("createdeck")){
                words = msg.content.split(" ");
		findFiles(words[2], '.png', words[1], words[3]);
		console.log("Found: ",matches, " files");
	}
	if (msg.content.includes("drawrotate")){
                words = msg.content.split(" ");
		drawCard(msg, 1, 1, words[1]);
	}
	else if (msg.content.includes("drawspecific")){
                words = msg.content.split(" ");
		drawSpecificCard(msg, words[1], words[2], words[3]);
	}
	else if (msg.content.includes("drawcard")){
                words = msg.content.split(" ");
		drawCard(msg, 1, 0, words[1]);
	}
	else if (msg.content.includes("drawtime")){
                words = msg.content.split(" ");
		//drawSpecificCard(msg, "/home/vliaskovitis/Documents/rpg/ALICE/time", "time", words[1]);
		drawMatchingRegexCard(msg, "/home/vliaskovitis/Documents/rpg/ALICE/time", "time", words[1]);
	}
	if (msg.content.includes("flip")){
                words = msg.content.split(" ");
		drawCard(msg, 0, 0, words[1]);
	}
	if (msg.content.includes("addfinalsuspect")){
                words = msg.content.split(" ");
		addCardToDeck("/home/vliaskovitis/Documents/rpg/ALICE/suspects/", "finalsuspects", words[1]);
	}
	if (msg.content.includes("addfinallocation")){
                words = msg.content.split(" ");
		addCardToDeck("/home/vliaskovitis/Documents/rpg/ALICE/locations/", "finallocations", words[1]);
	}
	if (msg.content.includes("addtimefromset")){
                words = msg.content.split(" ");
		addRandomFromSet("/home/vliaskovitis/Documents/rpg/ALICE/time/", "time", words[1]);
	}

})

bot.login(process.env.BOT_TOKEN);



