# ModMail - Discord Bot

Simple ModMail Discord bot designed for a small server and people that want to maintain their own ModMail bot in discord. 
ModMail is a bot that create a private space between support staff and user to address an issue by creating a new channel. 
This bot only support one server per bot and the ticket will be made in the same server.
Please note that i'm not an expert programmer therefore there might be some issues on resources efficiency.

## Installation

Graphical guide is still in progress.
1. Set up bot application in [Discord](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token).
2. Create [Glitch](https://glitch.com/) account.
3. Create new `Hello-Express` project.
4. Import files from this repository. (Tools -> Git, Import, and Export -> Import from GitHub -> Copy AkimotoRyou/ModMail -> click ok)
5. Edit `.env` file (the one with key icon) replace all text with the one on `[Example].env.txt` and copy your bot code right after the `=` character.
6. (Optional) edit the botOwnerID value with your [DiscordID](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).
7. Create [UptimeRobot](https://uptimerobot.com/) account and login.
8. On Dashboard, click `+ Add New Monitor`.
9. Change `Monitor Type *` to `HTTP(s)`.
10. Fill the name to your own liking.
11. On your Glitch project, click `show` -> `In a New Window` copy the link to UptimeRobot `URL (or IP)*` part.
12. Keep the `Monitoring Interval *` to 5 minutes or lower (if you have premium plan) and click `Create Monitor`.

That's it! The bot should be online 24/7 as long as Glitch and UptimeRobot didn't have any problem.

## Requirements

To operate functionally the bot need the following :
* Administrator Permission : Somehow `Manage Roles` permission isn't enough to create a new channel that inherit a category channel permissions.
* Dedicated Category Channel : Instead of setting a new permission everytime the bot create new channel, it used the same permission from this category channel. You can read [here](https://support.discordapp.com/hc/en-us/articles/115001580171-Channel-Categories-101) if you don't know what category channel is. 
* Dedicated Text Channel : To log a new ticket and closed ticket, please add this below (inside) the dedicated category for modmail that was created before.

## Commands

#### Owner Level 
  * **leave** : Make the bot leave a specified server.
#### Admin Level
  * **restart** : Restart the bot.
  * **reset** : Reset config values to default.
  * **setup** : Setup config values.
  * **configlist** : Show current config setting.
  * **serverlist** : Show a list of servers that have this bot.
#### Mod Level
  * **reply** : Reply to a user thread.
  * **close** : Close a thread.
  * **block** : Block a user.
  * **blocklist** : Show list of blocked user.
  * **unblock** : Remove a user from blocked list.
#### User Level
  * **new** : Create a new thread.
  * **help** : Show instruction about how to use the bot.
  * **helpde** : Anleitung zur Verwendung des Bots anzeigen.
  * **helptr** : Bot kullanımı hakkında talimat göster.
  * **helpko** : 봇 사용 방법에 대한 지시 사항 표시.
  * **helppt** : Mostrar instruções sobre como usar o bot.
  * **helpfr** : Afficher les instructions sur l'utilisation du bot.
  * **helpru** : Показать инструкцию о том, как использовать бот.
  * **helpchs** : 显示如何使用操作这个系统的说明.
  * **helpcht** : 顯示如何使用操作這個系統的說明.
  * **helpes** : Mostrar instrucciones sobre cómo usar el bot.

## Testing

I made Discord server to test the bot feel free to join at https://discord.gg/GGRWNgJ.
