# ModMail - Discord Bot

Simple ModMail Discord bot designed for a small server and people that want to maintain their own ModMail bot in discord. 
ModMail is a bot that create a private space between support staff and user to address an issue by creating a new channel. 

## Disclaimer
This bot only support one pair of server per bot. One main server(where users gather and chatting) and one thread server(where all the threads channel made). I'm debugging the bot alone so some bugs might passed when i upload it on GitHub feel free to report those bugs [here](https://github.com/AkimotoRyou/ModMail/issues).

## Installation

1. Set up bot application in [Discord](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token).
2. Create [Glitch](https://glitch.com/) account.
3. Create new `Hello-Express` project.
4. Import files from this repository. [`Tools` -> `Import and Export` -> `Import from GitHub` -> Type `AkimotoRyou/ModMail` -> click `ok`]*
5. At `.env.txt` file, add your bot [token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token) right after `TOKEN=` and then rename the file to `.env`.
6. At `config.json.txt` file, add your [DiscordID](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) between `""` character at `botOwnerID` section and rename the file to `config.json`.
7. If you have glitch [subscription](https://glitch.com/pricing), your bot will run 24/7 and you don't need follow the instructions below.
8. Create [UptimeRobot](https://uptimerobot.com/) account and login.
9. On Dashboard, click `+ Add New Monitor`.
10. Change `Monitor Type *` to `HTTP(s)`.
11. Fill the name to your own liking.
12. On your Glitch project, click `show` -> `In a New Window` copy the link to UptimeRobot `URL (or IP)*` part.
13. Keep the `Monitoring Interval *` to 5 minutes or lower (if you have [pro plan](https://uptimerobot.com/pricing)) and click `Create Monitor`.

That's it! The bot should be online 24/7 as long as Glitch and UptimeRobot didn't have any problem.

`* Only use import for the first time the project created cause import from github will rewrite all your data in Glitch project. You need to manually change the files if you want to sync it with this repository.`

## Requirements

To operate functionally the bot need the following :
* Administrator Permission : Somehow `Manage Roles` permission isn't enough to create a new channel that inherit a category channel permissions.
* Dedicated Category Channel : Instead of setting a new permission everytime the bot create new channel, it used the same permission from this category channel. You can read [here](https://support.discordapp.com/hc/en-us/articles/115001580171-Channel-Categories-101) if you don't know what category channel is. 
* Dedicated Text Channel : To log a new thread and closed thread.

## Commands

#### ~ Owner Level ~
* **leave** : Leave a guild (server).
* **reload** : Reload a command.
#### ~ Admin Level ~
* **bind** : Bind user thread to a channel.
* **configinfo** : Show a configuration information.
* **configuration** : Bot configuration.
* **guilds** : List of guilds (servers) that have this bot.
* **reset** : Reset all configuration values.
* **restart** : Restart the bot.
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
* **taglist** : Show a all tag names.
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

I made Discord server to test the bot, feel free to join at https://discord.gg/GGRWNgJ.
