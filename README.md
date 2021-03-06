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
9. Drag and drop all the `(downloaded or cloned from github)` files to the box below `Files` on left side of the repl.it project page. `*(make sure to replace the index.js file)`
10. At `.env` file, add your bot [token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token) right after `TOKEN=`.
11. At `config.json` file, add your [DiscordID](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) between `""` character at `botOwnerID` section.
12. Click `Run` button on top center of the page.
13. If you have repl.it [Hacker subscription](https://repl.it/site/pricing) **when** the `Always-on repls` feature added, you can skip the instructions below.
14. Create [UptimeRobot](https://uptimerobot.com/) account and login.
15. On Dashboard, click `+ Add New Monitor`.
16. Change `Monitor Type *` to `HTTP(s)`.
17. Fill the name to your own liking.
18. On your Repl.it project, there should be a window showing a page that says `Bot is running.` copy the url on that window to UptimeRobot `URL (or IP)*` part. `*(The url should be something like: "https://projectName.replUsername.repl.co")`
19. Set the `Monitoring Interval *` to anything between 5 minutes and 45 minutes `(Recomended: 30 minutes)`.
20. Finally, click `Create Monitor`.


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
* **configinfo** : Show a configuration information.
* **configuration** : Bot configuration.
* **guilds** : List of guilds (servers) that have this bot.
* **reset** : Reset all configuration values.
* **set** : Set specific configuration value.
#### ~ Moderator Level ~
* **aclose** : Anonymously close a user thread.
* **areply** : Anonymously reply to a user thread.
* **block** : Block a user from creating new thread and replying to a thread.
* **blockinfo** : Information about a user's block.
* **blocklist** : List of blocked users.
* **close** : Close a user thread.
* **queues** : Show information about queued threads and create threads if ModMail category have less than 50 channels.
* **reply** : Reply to a user thread.
* **tag** : Send a saved response.
* **tagadd** : Add a saved response.
* **tagdelete** : Delete a saved response.
* **tagedit** : Edit a saved response.
* **taginfo** : Show a saved response information.
* **taglist** : Show all tag names.
* **threadinfo** : Show a user thread information.
* **threadlist** : Show all open threads.
* **unblock** : Unblock user from creating new thread.
#### ~ User level ~
* **commands** : List of all available commands according to your permission level.
* **help** : Short instruction on how to create a new thread or info on a specific command.
* **helpchs** : 显示如何使用操作这个系统的说明.
* **helpcht** : 顯示如何使用操作這個系統的說明.
* **helpde** : Anleitung zur Verwendung des Bots anzeigen.
* **helpes** : Mostrar instrucciones sobre cómo usar el bot.
* **helpfr** : Afficher les instructions sur l'utilisation du bot.
* **helpkr** : 봇 사용 방법에 대한 지시 사항 표시.
* **helppt** : Mostrar instruções sobre como usar o bot.
* **helpru** : Показать инструкцию о том, как использовать бот.
* **helptr** : Bot kullanımı hakkında talimat göster.
* **new** : Create new thread.
* **ping** : Calculate bot latency.

## Testing

I made Discord server to test the bot, feel free to join at https://discord.gg/bzG7AqcRyC.

## Change Log

1. Turning `restart` command to `turnoff` command. `(Need to manually run the bot from repl.it after turned off.)`
2. Changing how cycling bot activities works to not abuse Discord API. 
- Before : Changed every 7 seconds.
- Now : Changed when there's a new message every 7 seconds `(Anywhere from any users except bots)`.
