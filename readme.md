[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/fernandomema/Tulipo)
[![gitlocalized ](https://gitlocalize.com/repo/5403/whole_project/badge.svg)](https://gitlocalize.com/repo/5403/?utm_source=badge)

# Index
- [Tulipo](#tulipo)
  * [Set up a project](#set-up-a-project)
    + [Using gitpod](#using-gitpod)
  * [Command List](#command-list)

# Tulipo

## Set up a project
### Using gitpod
For use gitpod IDE, you just need to click on  the [![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/fernandomema/Tulipo) badge.

 Go to: `https://discordapp.com/developers/applications/me`. After this, create a new application. Fill in all the credentials (bot name, bot avatar, bot description), then find and click "Create Bot". Find where it says `token` (*NOT* `secret`!), and copy that. Then, create a file named `.env` in the root folder of Gitpod editor. 
 Go to the end of all the lines, and add this line `Token=<yourToken>`. Replace `'<yourToken>'` with the token, you copied before and save the file.  Now, in the gitpod terminal press control + c to stop the auto started process and run "npm run dev" to start the bot with the new token.
The bot is now online. Invite it to a server, and run commands! 
## Translate
For translate bot messages just click on the [![gitlocalized ](https://gitlocalize.com/repo/5403/whole_project/badge.svg)](https://gitlocalize.com/repo/5403/?utm_source=badge) badge, then you will need to login with your github and open `messages -> en.json` file to start translating

## Command List  
This is the command list of the bot. This may be updated from time to time.   
Prefix: `tl-`   Current commands:  
```
| #No | \| commands | \| aliases           |
|-----|-------------|----------------------|
| #01 | \| prefix   | \| prefix, setprefix |
| #02 | \| help     | \| ?, h              |
| #03 | \| clear    | \| clear, chatclear  |
```
