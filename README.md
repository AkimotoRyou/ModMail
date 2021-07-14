# ModMail - Discord Bot

Simple ModMail Discord bot designed for a small server and people that want to maintain their own ModMail bot in discord. 
ModMail is a bot that create a private space between support staff and user to address an issue by creating a new channel. 

## Disclaimer
This bot only support one pair of server per bot. One main server(where users gather and chatting) and one thread server(where all the threads channel made). I'm debugging the bot alone so some bugs might passed when i upload it on GitHub feel free to report those bugs [here](https://github.com/AkimotoRyou/ModMail/issues).

## Installation

1. Set up bot application in [Discord](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token).
2. Don't forget to turn on `Server Members Intent` on Discord Developer Portal.
3. [Download](https://www.wikihow.com/Download-a-GitHub-Folder) or [clone](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository) files in this repository.
4. Create [Repl.it](https://repl.it/) account.
5. Click on `+ New repl`.
6. Choose `Node.js` as the language.
7. Rename your project. `*(Optional)`
8. Click `Create Repl`.
9. Delete Replit prebuilt index.js file.
10. At `.env` file, add your bot [token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token) right after `TOKEN=`.
11. Drag and drop all the `(downloaded or cloned from github)` files to the box below `Files` on left side of the repl.it project page.
12. Run `npm i @replit/database` from shell `(ctrl+shift+s)`.
13. At `config.json` file, add your [DiscordID](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) between `""` character at `botOwnerID` section.
14. Click `Run` button on top center of the page.
15. If you have repl.it [Hacker subscription](https://repl.it/site/pricing) **when** the `Always-on repls` feature added, you can skip the instructions below.
16. Create [UptimeRobot](https://uptimerobot.com/) account and login.
17. On Dashboard, click `+ Add New Monitor`.
18. Change `Monitor Type *` to `HTTP(s)`.
19. Fill the name to your own liking.
20. On your Repl.it project, there should be a window showing a page that says `Bot is running.` copy the url on that window to UptimeRobot `URL (or IP)*` part. `*(The url should be something like: "https://projectName.replUsername.repl.co")`
21. Set the `Monitoring Interval *` to anything between 5 minutes and 45 minutes `(Recomended: 30 minutes)`.
22. Finally, click `Create Monitor`.


## Requirements

To operate functionally the bot need the following :
* Administrator Permission : Somehow `Manage Roles` permission isn't enough to create a new channel that inherit a category channel permissions.
* Dedicated Category Channel : Instead of setting a new permission everytime the bot create new channel, it used the same permission from this category channel. You can read [here](https://support.discordapp.com/hc/en-us/articles/115001580171-Channel-Categories-101) if you don't know what category channel is. 
* Dedicated Text Channel : To log a new thread and closed thread.

## Commands

#### ~ Owner Level ~
* **leave** : Leave a guild (server).
* **reload** : Reload a command.
* **turnoff** : Turn off the bot.
#### ~ Admin Level ~
* **bind** : Bind user thread to a channel.
* **config** : Show current bot config or info about each config.
* **guilds** : List of guilds (servers) that have this bot.
* **reset** : Reset specific or all configuration values.
* **set** : Set specific configuration value.
#### ~ Moderator Level ~
* **aclose** : Anonymously close a user thread.
* **areply** : Anonymously reply to a user thread.
* **block** : Block a user, show an info, or show list of blocked user(s).
* **close** : Close a user thread.
* **reply** : Reply to a user thread.
* **tag** : Send, add, delete, edit, show an info or show list of saved response(s).
* **thread** : Show a user thread information or list of open thread(s).
* **unblock** : Unblock user from creating new thread.
#### ~ User level ~
* **commands** : List of all available commands according to your permission level.
* **help** : Short instruction on how to create a new thread or info on a specific command.
* **new** : Create new thread.
* **ping** : Calculate bot latency.

## Testing

I made Discord server to test the bot, feel free to join at https://discord.gg/bzG7AqcRyC.

## Change Log

1. Events separated from index file make it easier for me to maintain or add stuff.
2. Permission check are now sentralized in commandHandler.js instead of in individual command file.
3. Config value are now checked before executing the command and will notify if it's invalid.
4. Several commands are now merged, use `<prefix>help <command name>` for more info.
5. More bot action logged in console for easier debugging.