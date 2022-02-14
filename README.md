# ModMail - Discord Bot

Simple ModMail Discord bot designed for a small server and people that want to maintain their own ModMail bot in discord.
ModMail is a bot that create a private space between moderator and user to address an issue by acting as a bridge between user DM channel and new temporary channel inside a thread server.

## Disclaimer

This bot only support one pair of server per bot, one main server and one thread server.
I'm debugging the bot alone so expect some bugs passed to GitHub, and if you encounter bugs report *[here](https://github.com/AkimotoRyou/ModMail/issues)*.

## Notes

This is a complete rewrite of previous version. This version of the bot use Replit nix to meet node version requirement for Discord.Js v13 to host it in Replit and it's still in beta version. This bot use slash command and currently can't receive file attachment as an input due Discord API limitation. It's still a planned feature for slash command option as stated in this *[link](https://github.com/discord/discord-api-docs/discussions/3581)*. Global slash commands need up to an hour to register properly.

## Requirements

* Node.js `v16.6.0` or higher
* Npm `v7.0.0` or higher

## Installation

#### I. Setting up the bot

1. *[Create](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)* a discord bot.
2. While still in discord developer page, scroll down to `Privileged Gateway Intents` section and turn on `Server Members Intent`.
3. *[Invite](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#adding-your-bot-to-servers)* the bot to your server with following scopes and permissions.
   * Required scopes: `bot`, `application.commands`.
   * Required permissions: `Manage Roles`, `Manage Channels`, `Read Messages/View Channels`, `Send Messages`, `Embed Links`, `Attach Files`, `Read Message History`, `Mention Everyone`

> If you don't understand Discord permissions rules, either give the bot `Administrator` permission or read this *[guide](https://discordjs.guide/popular-topics/permissions-extended.html#permissions-extended)*.
>
> You'll need to re-invite the bot with correct scopes if you get "Missing Access" error.

#### II. Preparing the source code

1. Download latest source code [here](https://github.com/AkimotoRyou/ModMail/releases) and extract it.
2. Copy your *[bot token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token)* from discord developer page.
3. Open `.env` file and paste your bot token right after the equal sign on `TOKEN=` and save the file. e.g. `TOKEN=YourBotTokenHere`
4. Copy your discord *[User ID](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)*.
5. Open `defaultConfig.json` file and paste your discord user id inside double quotes `""` character that are after `"ownerID":` and save the file. e.g. `"ownerID": "YourUserIdHere"`

> Setting ownerID is recommend since it'll limit who can use critical *[commands](https://github.com/AkimotoRyou/ModMail#message-commands)*.

#### III. A. Replit

1. Create *[Replit](https://replit.com/signup)* account and login.
2. Click `+ Create Repl` button.
3. Choose `Nix (beta)` as template, and then click `+ Create Repl`.
4. Go to your source code folder and select all the files.
5. Drag and drop them to `Files` pane on Replit and click `replace`.
6. Go to Replit shell (`ctrl`+`shift`+`s`) and run `npm install` command.
7. If the installation finished without any error, click `Run` button at the top of Replit page and your bot should be online.

#### III. B. Non Replit User

> ReplDB show an error when used outside Replit. Follow this instruction to change the database.

1. Open `DB.js` file from `functions` folder, comment ReplDB section and uncomment Sequelize section.
2. Delete or rename current `package.json` file.
3. Rename `sequelize-package.json` file to `package.json`.
4. Open terminal from the main folder and run `npm install` command.
5. If the installation finished without any error, run `npm start` command from the terminal.

#### IV. Setting up the bot

1. Prepare the following stuff before proceed:
   - **Main Server** : Server that are moderated by moderator. The bot need to be inside the server too.
   - **Thread Server** : Server where thread channels will be created. The bot need to be inside the server too.
   - **Category Channel** : Category channel that will hold thread channels. Need to be inside Thread Server.
   - **Log Channel** : Channel where thread logs will be sent. Need to be inside Thread Server.
   - **Admin Role** : Role that will have administrator permission level. Need to be inside Thread Server.
   - **Moderator Role** : Role that will have moderator permission level. Need to be inside Thread Server.
   - **Mentioned Role** : The role that will be mentioned on new thread. Need to be inside Thread Server. _*Optional_
2. Mention the bot followed by `setup` message to start bot setup and reply to the bot message to proceed. e.g. `@ModMail setup`

#### V. Setting up UptimeRobot

> If you have Replit *[Hacker Plan](https://replit.com/site/pricing)*, turn your Replit project to *[always on](https://docs.replit.com/hosting/enabling-always-on)* and ignore this part of instruction.
>
> You can also skip this part if you aren't hosting it on Replit.

1. Create *[UptimeRobot](https://app.uptimerobot.com/signUp)* account and login.
2. Go to Dashboard and click `+ Add New Monitor` button.
3. Select `HTTP(s)` for Monitor Type and fill the name section.
4. Copy your Replit project webserver link and paste it to `URL` section. e.g. `https://projectName.replUsername.repl.co`
5. Set the Monitoring Interval to 30 minutes and then click `Create Monitor` button at the bottom.

## Adding another Language

1. Go to locale folder.
2. Copy `template.txt` and rename it to designated language name and change the file type to javascript `.js`.
3. Fill the empty quotes `""` with the translation while using `en.js` as reference.
* Notes :
  - I recommend to only have up to two language per bot to make cleaner user experience.
  - User experience would be better if you have different bot for different language.
  - Most of message command response are hard coded so it won't be affected.
  - Make sure the name property is same as the filename. e.g. `en.js` `name: "en"`
  - Make sure there's no same command name within and between language as it will throw an error when deploying the command.
  - Make sure to not leave any property value empty since it might trigger an error.

## Command List

#### Slash Commands

`*Global Command` `**Optional`

| Name | Operation | Description | Usage |
| ------- | --------- | ----------- | ----- |
| **/block** | info | Show specified user information | /block `operation:info` `target:userID` |
|  | list | Show blocked users list | /block `operation:list` `page:number`\*\* |
|  | add | Block specified user | /block `operation:add` `target:userID` `reason:blockReason` |
|  | set | Edit specified user blocking reason | /block `operation:set` `target:userID` `reason:newReason` |
|  | remove | Remove specified user from blocked list | /block `operation:remove` `target:userID` |
| **/close** | - | Close an active thread | /close `reason:closeReason` `note:threadNote`\*\* `anon:true`\*\* |
| **/config** | view | Show current bot configuration | /config `operation:view` |
|  | info | Show specified config information | /config `operation:info` `target:configName` |
|  | set | Edit specified config value | /config `operation:set` `target:configName` `value:newValue` |
|  | reset | Reset specified or all config value | /config `operation:reset` `target:configName` |
| **/create**\* | - | Create new thread | /create `title:threadTitle` |
| **/help**\* | - | Show specified command information | /help `target:commandName` |
| **/ping** | - | Calculate bot latency | /ping |
| **/reply**\* | - | Reply an active thread | /reply `content:message` `anon:true` |
| **/tag** | view | Show a saved response | /tag `operation:view` `target:tagName` `show:true`\*\* |
|  | sent | Sent a saved response to an active thread | /tag `operation:sent` `target:tagName` |
|  | info | Show tag information | /tag `operation:info` `target:tagName` |
|  | list | Show tag list | /tag `operation:list` `page:number` |
|  | add | Create new saved response | /tag `operation:add` `target:tagName` `content:tagContent` |
|  | set | Edit a saved response content | /tag `operation:set` `target:tagName` `content:newContent` |
|  | remove | Remove specified tag | /tag `operation:remove` `target:tagName` |
| **/thread** | info | Show specified thread information | /thread `operation:info` `user:targetUser` |
|  |  |  | /thread `operation:info` `channel:targetChannel` |
|  | list | Show thread list | /thread `operation:list` `page:number`\*\* |
|  | bind | Bind a user thread to a channel | /thread `operation:bind` `user:targetUser` `channel:targetChannel` `title:threadTitle`\*\* |

#### Message Commands

> If `ownerID` are set, only owner can use these commands.
>
>⚠️ If `ownerID` are empty but `mainServerID` or `threadServerID` are set, only admin from those servers can use these commands.
>
>⚠️ If `ownerID`, `mainServerID`, and `threadServerID` are empty, any admin from any server can use these commands.

| Name | Description | Usage |
| ---- | ----------- | ----- |
| config | Show current bot config | @ModMail config |
| deploy | Deploy slash commands | @ModMail deploy |
| guilds | Show list of guilds(servers) the bot in | @ModMail guilds |
| leave | Leave specified guild(server) | @ModMail leave guildID |
| reload | Reload specified command, function, or locale file | @ModMail reload targetName |
| reset | Reset all or specified config value | @ModMail reset all |
|  |  | @ModMail reset configName |
| set | Edit specified config value | @ModMail set configName configValue |
| setup | Set required bot config and deploy slash command| @ModMail setup |

## Testing

I made Discord server to test the bot, feel free to join at https://discord.gg/bzG7AqcRyC.
