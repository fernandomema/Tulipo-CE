// init require
const Discord = require('discord.js');


// export module
module.exports = {
	name : "prefix",
	description : "Change/check bot prefix",
	aliases : ["prefix", "setprefix"],
	ussage : null,
	hidden : false,
	admin : true,
	nsfw : false,
	async execute(client,message,args){
		let prefix = localStorage.getItem('prefix.'+message.guild.id) == null ? process.env.Prefix : localStorage.getItem('prefix.'+message.guild.id);
		if (args.length == 0) {
			return message.channel.send(`The current prefix is `+ prefix);
		} else {
			localStorage.setItem('prefix.'+message.guild.id, args[0])
			return message.channel.send(`Prefix changed to `+args[0]);
		}
		
	}
}