# ModMail - Discord Bot

Simple ModMail Discord bot designed for a small server and people that want to maintain their own ModMail bot in discord. 
ModMail is a bot that create a private space between support staff and user to address an issue. 
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

## Testing

I made Discord server to test the bot feel free to join at https://discord.gg/GGRWNgJ.
