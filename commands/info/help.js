// init require
const Discord = require('discord.js');
const fs = require("fs");
var read = require('fs-readdir-recursive')
const commandFiles = read('./commands');//fs.readdirSync('./commands');//.filter(file => file.endsWith('.js'));
const owner = process.env.Owner;
const prefix = process.env.Prefix;
const { t } = require('localizify');

// export module
module.exports = {
	name: "help",
	description: "BOT help commands",
	aliases: ["?", "h"],
	ussage: "[command]",
	hidden: false,
	admin: false,
    nsfw: false,
    DM: true,
	async execute(client, message, args) {
		const { description, color } = client.setting;
		const own = client.users.resolve(owner);
		var desc = t('tulipo.description');//description.replace(/{{owner}}/g, `\`\`${own.tag}\`\``);
		let user = message.mentions.users.size ? message.mentions.users.first() : message.author;
		var util = client.util;
		const embed = new Discord.MessageEmbed();

		if (!args[0]) {
			var folder = '';
			var cm = commandFiles.map((e, i) => {
				if (fs.existsSync(`../commands/${e}`) || fs.existsSync(`../commands/${folder}/${e}`)) {
					
				}
				const cmd = require(`../../commands/${e}`)
				if (!cmd.hidden) {
					return `#${util.tn(util.addZero(i + 1, 2), 1)} | ${util.tn(cmd.name, 2)} | ${util.tn(cmd.aliases.join(", "), 4)}`
				}
				return null;
			});

			var batas = "+--------+------------+----------------------+",
				header = `\`\`\`\n#${util.tn("No", 1)} | ${util.tn("commands", 2)} | ${util.tn("aliases", 4)}\n\`\`\``,
				footer = `ℹ️ `+ t('use {command} for more info!', {command: `\`\`${prefix}help [command]\`\``})+`* <:Tulipo:753281123655614635>\n\n**Link:**\n${util.usefulLnk(client).join("\n")}`;

			embed
				.setColor("RED")
				.setAuthor(`${client.user.username} | ` + t('Help & About'), client.user.avatarURL())
				.setDescription(
					`${desc}\n\n**` + t('List of command') + `:**\n${header}\`\`\`css\n${cm.filter(e => { return e !== null }).join("\n")}\`\`\`\n${footer}`
				)
				.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/8/88/Radar2.gif");
			embed.setFooter(
				t('Requested by') + ": " + user.tag + " |Tulipo V1.0",
				user.avatarURL({ dynamic: true })
            );
            if (message.channel.type != 'dm') {
                message.channel.send('<a:My_best_verified:752944773014356141> ' + t('Help sended to DM')).then(async function(sendedMessage) {
                    emoji = ['9️⃣','8️⃣','7️⃣','6️⃣','5️⃣','4️⃣','3️⃣','2️⃣','1️⃣','0️⃣']
                    for (var i = 4; i < 10; i++) {
                        await sendedMessage.react(emoji[i]);
                        await sleep(1000);
                        await sendedMessage.reactions.removeAll();
                    }
                    sendedMessage.delete();
                });
            }
            
			return message.author.send(embed);

		} else {
			var comid = client.commands.get(args[0]);
			if (!comid) return message.author.send(`there is no command like **'${args[0]}'**`)
			var ussage = comid.ussage == null ? "" : `**🔸${util.tn("Ussage", 3)} :**\n\`\`\` ${prefix + comid.name} ${comid.ussage}\`\`\``;
			embed
				.setColor(color.warning)
				//.setTitle(`**${comid.name}**`)
				.setAuthor(`${client.user.username} | Help Command`)
				.setDescription(
					`**🔸${util.tn("Command", 3)} :**\n\`\`\` ${comid.name}\`\`\`\n` +
					`**🔸${util.tn("Description", 3)} :**\n\`\`\`${t(comid.description)}\`\`\`\n` +
					(comid.aliases.length > 0 ? `**🔸${util.tn("Aliase(s)", 3)} :**\n\`\`\` ${comid.aliases.join(", ")}\`\`\`\n` : '') +
					`${ussage}`
				)
				.setThumbnail("https://www.pinclipart.com/picdir/big/44-448449_information-symbol-icon-driverlayer-search-engine-information-icon.png")
				.setImage("https://cdn.glitch.com/5f7d51b1-406e-43aa-9be8-293ff08f0543%2Fgiff.gif?v=1579915986916");

            if (message.channel.type != 'dm') {
                message.channel.send('<a:My_best_verified:752944773014356141> ' + t('Help sended to DM')).then(async function(sendedMessage) {
                    emoji = ['9️⃣','8️⃣','7️⃣','6️⃣','5️⃣','4️⃣','3️⃣','2️⃣','1️⃣','0️⃣']
                    for (var i = 4; i < 10; i++) {
                        await sendedMessage.react(emoji[i]);
                        await sleep(1000);
                        await sendedMessage.reactions.removeAll();
                    }
                    sendedMessage.delete();
                });
            }

			return message.author.send(embed);
		}

	}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
			console.log(`Loading: ${file} as ${command.name}`)
			// set if there aliase !== null
			// // with the key as the each of command aliases and the value as the exported module
			command.aliases.map(e => {
				// console.log(e);
				client.commands.set(e, command);
				console.log(`Loading: ${file} as ${e}`)
			})
		}
	});
}