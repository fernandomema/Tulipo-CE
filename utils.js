const Discord = require('discord.js');
const {t} = require('localizify');
var utils = {
    getConfig(guild) {
        if (guild == null) return;
        var settings = JSON.parse(localStorage.getItem(guild.id+'.settings'));
        if (settings == null) settings = {};
        var count = 0;
        while (settings === undefined && count < 100) {
            settings = JSON.parse(localStorage.getItem(guild.id+'.settings'));
            count++;
        }
        if (settings == null || settings === undefined) {
            localStorage.setItem(guild.id+'.settings', JSON.stringify({}));
        }
        if (settings == null || settings === undefined) {
            console.log('error reading settings from ' + guild.id);
            return null;
        }
        if (settings.prefix === undefined) {
            settings.prefix = 'tl-';
        }
        if (settings.lang === undefined) {
            settings.lang = 'en';
        }
        if (settings.mutedUsers === undefined || settings.mutedUsers.length == 0) {
            settings.mutedUsers = {};
        }
        if (settings.welcome === undefined) {
            settings.welcome = {};
        }
        if (settings.welcome.randomMessage === undefined) {
            settings.welcome.randomMessage = {
                enabled: false,
                channel: '',
                messages: []
            };
        }
        if (settings.welcome.image === undefined) {
            settings.welcome.image = {
                enabled: false,
                channel: '',
                theme: ''
            };
        }
        if (settings.welcome.privateDM === undefined) {
            settings.welcome.privateDM = {
                enabled: false,
                channel: '',
                message: ''
            };
        }
        if (settings.welcome.joinRole === undefined) {
            settings.welcome.joinRole = {
                enabled: false,
                role: null
            };
        }
        if (settings.filterInvites === undefined) {
            settings.filterInvites = {
                enabled: false,
                warn: false,
                bypassOwner: true,
                bypassRoles: []
            }
        }
        if (settings.filterInvites.delete === undefined) {
            settings.filterInvites.delete = true;
        }
        if (settings.userData === undefined || settings.mutedUsers.length == 0) {
            settings.userData = {};
        }
        if (settings.virtualCoin === undefined) {
            settings.virtualCoin = {
                enabled: true,
                nameSingular: 'coin',
                namePlural: 'coins'
            }
        }
        return settings;
    },

    getGuildUserData(guild, userid) {
        var settings = module.exports.getConfig(guild);
        if (settings.userData[userid] === undefined) {
            settings.userData[userid] = {
                coins: 0
            }
        }
        if (settings.userData[userid].xp === undefined) {
            settings.userData[userid].xp = 0;
        }
        return settings.userData[userid]
    },

    saveConfig(guild, settings) {
        localStorage.setItem(guild.id+'.settings', JSON.stringify(settings));
    },

    /**
     * Warn a user
     * @constructor
     * @param {Discord.Client} client - Discord bot client.
     * @param {Discord.Message} message - Discord message.
     * @param {Discord.User} user - Discord user.
     * @param {string} reason - reson of the warn (optional).
    */
    warn(client, message, user, reason) {
        var config = module.exports.getConfig(message.guild);
        config.mutedUsers[user.id.toString()] = {
            muted: true,
            'reason': reason || t('without reason')
        };
        module.exports.saveConfig(message.guild, config);
        client.users.cache.get(user.id).send(t('you have been warned in {servername} with reason: {reason}', {
            servername: message.guild.name,
            'reason': reason || t('without reason')
        }));
        return message.channel.send(t('User {user} warned with reason {reason} by {muter}', {
            user: user.username,
            'reason': (reason || t('without reason')),
            muter: message.author.username
        }));
    },

    isOwner(member, guild) {
        return member(guild.owner);
    },

    isAdmin(member) {
        return member.hasPermission(['ADMINISTRATOR'])
    },

    isOwnerOrAdmin(member, guild) {
        return ( module.exports.isOwner(member, guild) || module.exports.isAdmin(member) )
    },

    long2ip(ip) {
        //  discuss at: https://locutus.io/php/long2ip/
        // original by: Waldo Malqui Silva (https://fayr.us/waldo/)
        //   example 1: long2ip( 3221234342 )
        //   returns 1: '192.0.34.166'

        if (!isFinite(ip)) {
            return false
        }

        return [ip >>> 24 & 0xFF, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF].join('.')
    },

    splitCommandLine( commandLine ) {

        //log( 'commandLine', commandLine ) ;
    
        //  Find a unique marker for the space character.
        //  Start with '<SP>' and repeatedly append '@' if necessary to make it unique.
        var spaceMarker = '<SP>' ;
        while( commandLine.indexOf( spaceMarker ) > -1 ) spaceMarker += '@' ;
    
        //  Protect double-quoted strings.
        //   o  Find strings of non-double-quotes, wrapped in double-quotes.
        //   o  The final double-quote is optional to allow for an unterminated string.
        //   o  Replace each double-quoted-string with what's inside the qouble-quotes,
        //      after each space character has been replaced with the space-marker above.
        //   o  The outer double-quotes will not be present.
        var noSpacesInQuotes = commandLine.replace( /"([^"]*)"?/g, ( fullMatch, capture ) => {
            return capture.replace( / /g, spaceMarker ) ;
        }) ;
    
    
        //  Now that it is safe to do so, split the command-line at one-or-more spaces.
        var mangledParamArray = noSpacesInQuotes.split( / +/ ) ;
    
    
        //  Create a new array by restoring spaces from any space-markers.
        var paramArray = mangledParamArray.map( ( mangledParam ) => {
            return mangledParam.replace( RegExp( spaceMarker, 'g' ), ' ' ) ;
        });
    
    
        return paramArray ;
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
module.exports = utils;