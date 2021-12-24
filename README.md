# ModMail - Discord Bot
Simple ModMail Discord bot designed for a small server and people that want to maintain their own ModMail bot in discord.
ModMail is a bot that create a private space between support staff and user to address an issue by creating a new channel.

## Disclaimer
This bot only support one pair of server per bot, one main server and one thread server.
I'm debugging the bot alone so expect some bugs passed to GitHub, and if you encounter bugs report [here](https://github.com/AkimotoRyou/ModMail/issues).

## Note
This is a complete rewrite of previous version. This version of the bot use replit nix to meet node version requirement for Discord.Js v13 to host it in Replit and it's still in beta version. This bot use slash command and currently can't receive file attachment as an input due Discord API limitation. It's still a planned feature for slash command option as stated in this [link](https://github.com/discord/discord-api-docs/discussions/3581). Slash global commands need up to an hour to register properly.

## Installation
#### I. Setting up a bot application
1. Follow the guide to create your bot. [guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
2. After you click that `Add Bot` button, scroll down to `Privileged Gateway Intents` section and turn on `Server Members Intent`.
#### II. Adding your bot to servers
1. Follow the guide to add your bot to your server. [guide](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#adding-your-bot-to-servers)
   * Required scopes: `bot`, `application.commands`.
   * Required permissions: `Manage Roles`, `Manage Channels`, `Read Messages/View Channels`, `Send Messages`, `Embed Links`, `Attach Files`, `Read Message History`, `Mention Everyone`
   * If you don't understand Discord permissions rules, either give the bot `Administrator` permission or read the guide. [guide](https://discordjs.guide/popular-topics/permissions-extended.html#permissions-extended)
#### III. Setting up the source code
1. Download the codes in this repository by clicking `Code🔻` button and then click `Download ZIP` button. [Outdated graphical instruction](https://www.wikihow.com/Download-a-GitHub-Folder)
   * Alternatively, you can clone the repository. [guide](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository)
2. Extract the downloaded zip file and go to the extracted folder.
3. Copy your bot [Token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token), and paste it after `TOKEN=` inside .env file and save it. e.g. `TOKEN=YourBotTokenHere`
4. Copy your discord [User ID](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-), and paste it inside double quotes `""` character after `"ownerID":` inside `defaultConfig.json` file and save it. e.g. `"ownerID": "YourUserIdHere"`
#### IV.A Setting up Replit
1. Create [Replit](https://replit.com/signup) account and login.
2. Click `+ Create Repl` button.
3. Choose `Nix (beta)` as template, and then click `+ Create Repl`.
4. Upload all the files to replit, the easy way is to select the files then drag and drop them to Files pane inside replit.
5. Go to replit shell (`ctrl`+`shift`+`s`) and type the following command `npm install` and click enter.
6. After the npm installation complete without error, click `Run` button at the top of replit page and check if your bot goes online.
#### IV.B Sequelize
> For non replit user, you can change Database from replDB to any DB that Sequelize can use. The provided code are using sqlite3.
> Please note that the dependencies version in sequelize json probably wont be checked by dependabot so compare with `package.json`.

1. Go to `functions/DB.js` file, comment the replDB part by removing second `/` character at top part `/* */` => `/* *`.
2. Uncomment the Sequelize part by adding `/` character at top part `/* *` => `/* */`.
3. Delete or rename current `package.json` file.
4. Rename `sequelize-package.json` file to `package.json`.
5. Go to the folder directory from terminal and type the following command `npm install` and click enter.
6. After the npm installation complete without error, run `node index.js` command from the terminal.
#### V. Setting up the bot
1. Prepare the following stuff before proceed:
   - **Main Server** : Server that are moderated by moderator. The bot need to be inside the server too.
   - **Thread Server** : Server where thread channels will be created. The bot need to be inside the server too.
   - **Category Channel** : Category channel that will hold thread channels. Need to be inside Thread Server.
   - **Log Channel** : Channel where thread logs will be sent. Need to be inside Thread Server.
   - **Admin Role** : Role that will have administrator permission level. Need to be inside Thread Server.
   - **Moderator Role** : Role that will have moderator permission level. Need to be inside Thread Server.
   - **Mentioned Role** : The role that will be mentioned on new thread. Need to be inside Thread Server.
2. Mention the bot followed by `setup` message to start bot setup and reply to the bot message to proceed. e.g. `@ModMail setup`
#### VI. Setting up UptimeRobot
> If you have replit [Hacker](https://replit.com/site/pricing), just make your replit project to [always on](https://docs.replit.com/hosting/enabling-always-on) and ignore this part of instruction.
> You can also skip this part if you host it on your own device or any place that doesn't need monitoring.

1. Create [UptimeRobot](https://app.uptimerobot.com/signUp) account and login.
2. Go to Dashboard and click `+ Add New Monitor` button.
3. Select `HTTP(s)` for Monitor Type and fill the name section.
4. Fill the URL section with your replit project link, not the one on your browser address bar but the one with `Bot is running.` message. e.g. `https://projectName.replUsername.repl.co`
5. Set the Monitoring Interval to 30 minutes and then click `Create Monitor` button at the bottom.

## Adding another Language
1. Go to locale folder.
2. Copy `template.txt` and rename it to designated language name and change the file type to javascript `.js`.
3. Fill the empty quotes `""` with the translation using `en.js` as reference.
* Notes :
  - I recommend to only have up to two language per bot to make cleaner user experience.
  - User experience would be better if you have different bot for different language.
  - Some of the setup command response are hard coded so it won't be affected.
  - Make sure the name property is same as the filename without the filetype. e.g. `en.js` `name: "en"`
  - Make sure there's no same command name within and between language as it will throw an error when deploying the command.
  - Make sure to not leave any property value empty since it might trigger an error.

## Command List
***\*Optional***

| Name | Operation | Description | Usage |
| ------- | --------- | ----------- | ----- |
| **/block** | info | Show specified user information | /block `operation:info` `target:userID` |
|  | list | Show blocked users list | /block `operation:info` *`page:number` |
|  | add | Block specified user | /block `operation:add` `target:userID` `reason:blockReason` |
|  | set | Edit specified user blocking reason | /block `operation:set` `target:userID` `reason:newReason` |
|  | remove | Remove specified user from blocked list | /block `operation:remove` `target:userID` |
| **/close** | - | Close an active thread | /close `reason:closeReason` *`note:threadNote` *`anon:true` |
| **/config** | view | Show current bot configuration | /config `operation:view` |
|  | info | Show specified config information | /config `operation:info` `target:configName` |
|  | set | Edit specified config value | /config `operation:set` `target:configName` `value:newValue` |
|  | reset | Reset specified or all config value | /config `operation:reset` `target:configName` |
| **/create** | - | Create new thread | /create `title:threadTitle` |
| **/help** | - | Show specified command information | /help `target:commandName` |
| **/ping** | - | Calculate bot latency | /ping |
| **/reply** | - | Reply an active thread | /reply `content:message` *`anon:true` |
| **/tag** | view | Show a saved response | /tag `operation:view` `target:tagName` *`show:true` |
|  | sent | Sent a saved response to an active thread | /tag `operation:sent` `target:tagName` |
|  | info | Show tag information | /tag `operation:info` `target:tagName` |
|  | list | Show tag list | /tag `operation:list` `page:number` |
|  | add | Create new saved response | /tag `operation:add` `target:tagName` `content:tagContent` |
|  | set | Edit a saved response content | /tag `operation:set` `target:tagName` `content:newContent` |
|  | remove | Remove specified tag | /tag `operation:remove` `target:tagName` |
| **/thread** | info | Show specified thread information | /thread `operation:info` `user:targetUser` |
|  |  |  | /thread `operation:info` `channel:targetChannel` |
|  | list | Show thread list | /thread `operation:list` *`page:number` |
|  | bind | Bind a user thread to a channel | /thread `operation:bind` `user:targetUser` `channel:targetChannel` *`title:threadTitle` |

## Testing

I made Discord server to test the bot, feel free to join at https://discord.gg/bzG7AqcRyC.
