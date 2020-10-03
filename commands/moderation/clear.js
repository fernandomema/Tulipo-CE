// init require
const Discord = require('discord.js');
const { t } = require('localizify');
const { sleep } = require("../../utils.js");


// export module
module.exports = {
	name : "clear",
	description : "Clear chat",
	aliases : ["clear", "chatclear"],
	ussage : null,
	hidden : false,
	admin : true,
	nsfw : false,
	async execute(client,message,args){
        if (args[0] === undefined) {
            args[0] = 100;
        }
		const fetched = await message.channel.messages.fetch({
            limit: Math.min( args[0], 100)
        });
        
        message.channel.send(t('{count} messages deleted.', {count: Math.min( parseInt(args[0]), 100)})).then(async function(sendedMessage) {
            emoji = ['9️⃣','8️⃣','7️⃣','6️⃣','5️⃣','4️⃣','3️⃣','2️⃣','1️⃣','0️⃣']
            for (var i = 4; i < 10; i++) {
                await sendedMessage.react(emoji[i]);
                await sleep(1000);
                await sendedMessage.reactions.removeAll();
            }
            sendedMessage.delete();
        });

        return message.channel.bulkDelete(fetched);
	}
}