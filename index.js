const Discord = require('discord.js');
const botClient = require("./structures/botClient");
const cleverbot = require("cleverbot-free");
const client = new botClient();
var i18n = require( "i18n-abide" );
const isDiscordInvitation = require("is-discord-invitation");
const fs = require("fs"); // Or `import fs from "fs";` with ESM
var Dashboard;
if (fs.existsSync("./dashboard/dashboard")) {
    Dashboard = require("./dashboard/dashboard");
}

require('better-logging')(console);
console.logLevel = process.env.logLevel || 3;
const owner = process.env.Owner;
const prefix = process.env.Prefix;
const Token = process.env.Token; 



const { splitCommandLine } = require("./utils.js");

const {default: localizify, t} = require('localizify');
const en = require('./messages/en.json');
const es = require('./messages/es.json');
localizify
  .add('en', en)
  .add('es', es)
  .setLocale('en');

const path = require('path');
const cmdir = './commands';
client.commands = new Discord.Collection();

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./data');

// commands init
/*const commandFiles = fs.readdirSync(cmdir).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`${cmdir}/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
	console.log(`Loading: ${file} as ${command.name}`)
	// set if there aliase !== null
	// // with the key as the each of command aliases and the value as the exported module
	command.aliases.map(e=>{
		// console.log(e);
		client.commands.set(e, command);
		console.log(`Loading: ${file} as ${e}`)
	})
}

*/

function traverseDir(dir) {
	fs.readdirSync(dir).forEach(file => {
		let fullPath = path.join(dir, file);
		if (fs.lstatSync(fullPath).isDirectory()) {
			//console.log(fullPath);
			traverseDir(fullPath);
		} else {
			//console.log(fullPath);
			const command = require(`./${fullPath}`);
	
			// set a new item in the Collection
			// with the key as the command name and the value as the exported module
			client.commands.set(command.name, command);
			console.debug(`Loading: ${file}`)
			// set if there aliase !== null
			// // with the key as the each of command aliases and the value as the exported module
			command.aliases.map(e=>{
				// console.log(e);
				client.commands.set(e, command);
			})
		}  
	});
}
traverseDir(cmdir);


// event Handler
client.on('message', message => {   

	localStorage.setItem('lastOnline.'+message.author.id, Date.now());
	
	//localStorage.removeItem(message.guild.id+'.settings');
    const { getConfig, warn } = require("./utils.js");
    var settings = {};
	if (message.guild != null) {
        settings = getConfig(message.guild);
        if (settings.mutedUsers[message.author.id.toString()] != undefined && settings.mutedUsers[message.author.id.toString()].muted == true) {
            client.users.cache.get(message.author.id).send(t('you can\'t chat on {servername} because you\'re muted', {
                servername: message.guild.name, 
            }));
            message.delete();
            return;
        } 
	
    
        if (isDiscordInvitation(message.content)) {
            if (settings.filterInvites.enabled) {
                if (settings.filterInvites.warn) {
                    warn(client, message, message.author, t('Send discord server invite link'));
                }
                if (settings.filterInvites.delete) {
                    message.delete();
                    return;
                }
            }
        }
    }
	let prefix = settings.prefix || process.env.Prefix;
	
	//const args = message.content.slice(prefix.length).split(/ +/);
	const args = splitCommandLine(message.content.slice(prefix.length));
    const command = args.shift().toLowerCase();
    
	// if people mention us, tell them about our prefix
	if(message.mentions.users.size){
		if(message.mentions.users.first().id == client.user.id && message.content.startsWith('<')){
			if (args.length == 0) {
				return message.reply(`my prefix is \`\`${prefix}\`\``)
			} else {
				message.channel.startTyping();
				var text = args.join(' ');
				
				cleverbot(text).then(response => {
					message.channel.send(response + ' <@'+message.author.id+'>')
					message.channel.stopTyping();
				});
				//cleverbot(text).then(response => message.channel.send('<@'+message.author.id+'> ' + response));
				
			}
		}
    }
    
	// check message with prefix
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	

	// if no command like this do nothing
	if (!client.commands.has(command)) return;
	var comid = client.commands.get(command);

    // if user message by DM
	if(message.guild == null && (comid.DM === undefined || comid.DM == false)){
		// doing nothing
		return;
	}

	//  only owner
	// !message.member.roles.cache.has(localStorage.getItem('adminRole.'+message.guild.id))
	if (comid.admin && (message.author.id !== owner && !message.channel.permissionsFor(message.member).has("ADMINISTRATOR") && message.member.id != message.guild.owner.user.id) )return message.reply("only owner can access this command!");
	// only on nsfw channel
	if (comid.nsfw && !message.channel.nsfw) return message.reply("require NSFW channel! so can't run command!")

	try {
		localizify.setLocale(settings.lang || 'en');
		comid.execute(client,message, args);
		message.delete();
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}

});

client.on('voiceStateUpdate', (oldMember, newMember) => {
	let newUserChannel = newMember.voiceChannel
	let oldUserChannel = oldMember.voiceChannel
  
  
	if(oldUserChannel === undefined && newUserChannel !== undefined) {
  
	   // User Joins a voice channel
	   localStorage.setItem('lastOnline.'+newMember.id, Date.now());
  
	} else if(newUserChannel === undefined){
  
	  // User leaves a voice channel
	  localStorage.setItem('lastOnline.'+oldMember.id, Date.now());
  
	}
})

//Cuando lo invitan a un servidor
client.on('guildCreate', (guild) => {
    const embed = new Discord.MessageEmbed()
    
    .setAuthor(client.user.username , client.user.avatarURL())
    .setThumbnail(client.user.avatarURL())
    .setTitle("Registro de servidores nuevos")
    .setDescription("Nuevo servidor:")
    .setColor("RED")
    .addField("Nombre:", `${guild.name}`)
    .addField("ID:",`${guild.id}`)
    .addField("Esto en:", `${client.guilds.cache.size}`+ " servidores")
    .addField("Numero de usuarios:",`${guild.memberCount}`)
    
	client.channels.cache.get('754100810861772801').send(embed);

})

//Cuando lo expulsan del servidor
client.on('guildDelete', (guild) => {
    const embed = new Discord.MessageEmbed()
    
    .setAuthor(client.user.username , client.user.avatarURL())
    .setThumbnail(client.user.avatarURL())
    .setTitle("Registro de cuando lo expulsan")
    .setDescription("Deje el servidor:")
    .setColor("RED")
    .addField("Nombre:", `${guild.name}`)
    .addField("ID:",`${guild.id}`)
    .addField("Esto en:", `${client.guilds.cache.size}`+ " servidores")
    	
	client.channels.cache.get('754100810861772801').send(embed);
})

client.on('guildMemberAdd', member => {
    //member.guild.channels.get('channelID').send("Welcome"); 
});

client.once('ready', () => {
	console.info(client.user.username + ' is Ready!');
	if (typeof Dashboard != 'undefined') {
		Dashboard(client);
	}
	

	// Activities 
	setInterval(async () => {
		const actividades = [
			"Vigilando a: " + client.users.cache.size + " Usuarios",
			"Usa tl-help para mas informacion",
			"Estoy en " + client.guilds.cache.size + " Servidores",
			"Gracias por invitarme",
			"Moderando"
		];
		const index = Math.floor(Math.random() * (actividades.length - 1) + 1);
		client.user.setPresence({
			status: "dnd",
			activity: {
				name: actividades[index],
				type: "PLAYING" // https://discord.js.org/#/docs/main/stable/typedef/ActivityType
			}
		});
	}, 5000);
});

client.login(Token)
	/*.then(e=>{
		require("./webserver.js").execute(client);
	})
	.catch(err=>console.log(err));*/
