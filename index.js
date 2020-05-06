const Discord= require('discord.js');
const path = require('path');
const fs = require('fs');
const bot = new Discord.Client();
const imgfolder = "/home/vliaskovitis/Documents/rpg/BPG001_Shab-al-Hiri-Roach/";

const token = '';

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
	fs.readdir(imgfolder, function (err, files) {
			//handling error
			if (err) {
			return console.log('Unable to scan directory: ' + err);
			} 
			//listing all files using forEach
			files.forEach(function (file) {
					// Do whatever you want to do with the file
					console.log(file); 
					});
			});
	}
	if (msg.content === "drawcard"){
		msg.reply('draws a card!');
	}
})

bot.login(token);



