//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~DEPENDENCIES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//#dependencies
console.log("[Loading Dependencies]");
const Discord = require("discord.js");
const { Util, Attachment } = require("discord.js");
const client = new Discord.Client();
const server = require("./server.js");
const Sequelize = require("sequelize");
const fs = require("fs");
const moment = require("moment");
const defConfig = require("./config.json");
require("dotenv").config();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VARIABLES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

console.log("[Loading Variables]");

//#config (synced with database)
var config = {
  prefix: "",
  botOwnerID: "",
  mainServerID: "",
  threadServerID: "",
  categoryID: "",
  logChannelID: "",
  botChannelID: "",
  adminRoleID: "",
  modRoleID: "",
  mentionedRoleID: "",
  maintenance: "",
  info_color: "",
  warning_color: "",
  error_color: "",
  received_color: "",
  sent_color: ""
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~DATABASE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//#configDB
const configDB = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "config.sqlite"
});
const ConfigDB = configDB.define("config", {
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  input: Sequelize.STRING
});

//#blockedDB
const blockedDB = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "blocked.sqlite"
});
const BlockedDB = blockedDB.define("blocked", {
  userID: {
    type: Sequelize.STRING,
    unique: true
  },
  modID: Sequelize.STRING,
  reason: Sequelize.STRING
});

//#threadDB
const threadDB = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "thread.sqlite"
});
const ThreadDB = configDB.define("thread", {
  userID: {
    type: Sequelize.STRING,
    unique: true
  },
  channelID: {
    type: Sequelize.STRING,
    unique: true
  },
  threadTitle: Sequelize.STRING
});

//#commandsCollection
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const cmd = require(`./commands/${file}`);
	client.commands.set(cmd.name, cmd);
}

//#functionsCollection
client.functions = new Discord.Collection();
const functionFiles = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
for (const file of functionFiles) {
	const func = require(`./functions/${file}`);
	client.functions.set(func.name, func);
}

//#parameter
const param = {
  Discord,
  Attachment,
  moment,
  client,
  ConfigDB,
  ThreadDB,
  BlockedDB,
  config,
  defConfig,
  configSync: client.functions.get("configSync"),
  getEmbed: client.functions.get("getEmbed"),
  roleCheck: client.functions.get("roleCheck"),
  isBlocked: client.functions.get("isBlocked"),
  isMember: client.functions.get("isMember"),
  reset: client.functions.get("reset"),
  configuration: client.functions.get("configuration"),
  configInfo: client.functions.get("configInfo"),
  set: client.functions.get("set"),
  bind: client.functions.get("bind"),
  newThread: client.functions.get("newThread"),
  threadInfo: client.functions.get("threadInfo"),
  reply: client.functions.get("reply"),
  areply: client.functions.get("areply"),
  userReply: client.functions.get("userReply"),
  close: client.functions.get("close"),
  aclose: client.functions.get("aclose"),
  block: client.functions.get("block"),
  unblock: client.functions.get("unblock"),
  blockinfo: client.functions.get("blockinfo"),
  blocklist: client.functions.get("blocklist")
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~READY~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

client.on('ready', async () => {
  console.log("[Syncing Database]");
  await BlockedDB.sync();
  await ConfigDB.sync();
  await ThreadDB.sync();
  await param.configSync.execute(param); //cant make the bot waiting this guy to finish pfft

  console.log(`Logged in as ${client.user.tag}!`);
  //when i use local variable (config.maintenance), the configSync() is still in process that's why i use database value for this.
  const getMaintenance = await ConfigDB.findOne({ where: { name: "maintenance" } }).catch(
    error => {console.log(error)}
  );
  const getPrefix = await ConfigDB.findOne({ where: { name: "prefix" } }).catch(
    error => {console.log(error)}
  );

  let isMaintenance
  if(!getMaintenance){
    isMaintenance = "0";
  } else {
    isMaintenance = await getMaintenance.input;
  }

  //#activities
  let activities = []
  if(getPrefix){
    activities.push(`Glitch.com | ${getPrefix.input}commands`);
    activities.push(`DM to contact Staff | ${getPrefix.input }help`);
    activities.push(`DM, um Mitarbeiter zu kontaktieren | ${getPrefix.input}helpDE`);
    activities.push(`Personel ile irtibata geçmek için DM | ${getPrefix.input}helpTR`);
    activities.push(`직원에게 연락하는 DM | ${getPrefix.input}helpKR`);
    activities.push(`DM para entrar em contato com a equipe | ${getPrefix.input}helpPT`);
    activities.push(`DM contacte le personnel | ${getPrefix.input}helpFR`);
    activities.push(`DM связаться с персоналом | ${getPrefix.input}helpRU`);
    activities.push(`DM 与官方人员联系 | ${getPrefix.input}helpCHS`);
    activities.push(`DM 與官方人員聯繫 | ${getPrefix.input}helpCHT`);
    activities.push(`DM para contactar al personal | ${getPrefix.input}helpES`);
  } else {
    activities.push(`- Restart Me -`);
  }

  if (isMaintenance == "0") {
    let index = 0;
    setInterval(() => {
      client.user.setActivity(activities[index], { type: "WATCHING" });
      index++;
      if (index == activities.length) index = 0;
    }, 7000);
  } else {
    //using timeout since i can't make the bot wait for configSync() function to finish :(
    setTimeout(()=> {
      client.user.setActivity("~ Under Maintenance ~", { type: "STREAMING" });
    }, 10000);
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~NEW GUILD~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

client.on('guildCreate', async guild => {
  const ownerID = config.botOwnerID;
  if(ownerID){
    const newServerEmbed = param.getEmbed.execute(param, config.info_color, "Joined a Guild", `[**${guild.name}**] (\`${guild.id}\`)`);
    client.users.get(ownerID).send(newServerEmbed);
  }
  console.log(`Joined [${guild.name}] guild.`);
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~MESSSAGES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

client.on('message', async message => {
	if(message.author.bot) return;
  try {
    //maintenance mode
    if(config.maintenance == "1"){

      const authorID = message.author.id;
      const botOwnerID = config.botOwnerID;
      const botChannelID = config.botChannelID;
      const maintenanceEmbed = param.getEmbed.execute(param, config.error_color, "Maintenance", "All commands are disabled.");

      if(message.guild == null && authorID != botOwnerID){
        //in Direct Message and not bot owner
        return message.channel.send(maintenanceEmbed);
      } else if(config.mainServerID == "empty" && config.threadServerID == "empty") {
        //the mainServerID and threadServerID empty
        if(authorID != botOwnerID && !message.member.hasPermission('ADMINISTRATOR')){
          //not bot owner and doesn't have ADMINISTRATOR permission
          return message.channel.send(maintenanceEmbed);
        };
      } else if(config.mainServerID != "empty" && config.threadServerID != "empty"){
        //mainServerID and threadServerID isn't empty
        if(message.guild.id == config.mainServerID || message.guild.id == config.threadServerID){
          //inside mainServerID or threadServerID
          if(botChannelID != "empty" && message.channel.id != botChannelID){
            return;
          } else if(authorID != botOwnerID && !message.member.hasPermission('ADMINISTRATOR') && !param.roleCheck.execute(message, config.adminRoleID)){
            //not bot owner and user doesn't have ADMINISTRATOR permission nor have Admin role
            return message.channel.send(maintenanceEmbed);
          }
        } else {
          //outside mainServerID and threadServerID
          if(authorID != botOwnerID){
            //not bot owner
            return message.channel.send(maintenanceEmbed);
          };
        };
      }
    };

  	let args, commandName = "";

  	//checking wheter user use prefix or mention the bot
  	let prefixIndex = message.content.indexOf(config.prefix);
  	let botMentionIndex = message.content.indexOf("<@"+client.user.id+">");
  	if (prefixIndex !== 0 && botMentionIndex !== 0){
      if(message.guild != null){
        return;
      } else {
        const isThread = await ThreadDB.findOne({where: {userID: message.author.id}});
        if(!isThread){
          return;
        } else {
          return param.userReply.execute(param, message, isThread);
        }
      }
  	} else if (prefixIndex === 0){
  		args = message.content.slice(config.prefix.length).split(/ +/);
  		commandName = args.shift().toLowerCase();
  	} else if (botMentionIndex === 0){
  		args = message.content.slice(("<@"+client.user.id+">").length).split(/ +/);
  		commandName = args.shift().toLowerCase();
  	}

    //finding command that was triggered
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    //user using prefix or mention bot, command name is invalid
    if ((prefixIndex == 0 || botMentionIndex == 0) && !command) return;

    //command is guildOnly, user trigger it inside Direct Message
    if(command.guildOnly && message.channel.type !== 'text' && message.author.id != config.botOwnerID){
      let noDMEmbed = param.getEmbed.execute(param, config.error_color, "Command Unavailable", "This command can\'t be used inside Direct Message.");
      return message.channel.send(noDMEmbed);
    }

    //command need arguments to run, user did't gave any
    if(command.args && !args.length){
      let description = "You didn\'t provide any arguments."

      if(command.usage) {
        description += `\n**Usage** : \`${config.prefix}${command.name} ${command.usage}\``;
      }
      if(command.note){
        description += `\n**Note** : \`${command.note}\``;
      }

      let noArgsEmbed = param.getEmbed.execute(param, config.warning_color, "Missing Arguments", description);
      return message.channel.send(noArgsEmbed);
    }

    //command handler
    //trying to execute the command
  	await command.execute(param, message, args);
	} catch (error) {
    //catching error -> log it in console -> send error message to user
		console.log(error);
    let errorEmbed = param.getEmbed.execute(param, config.error_color, "An Error Occured.", `**Contact bot Owner** : <@${config.botOwnerID}>\n**Error Message** : \`${error.message}\``);
		return message.channel.send(errorEmbed);
	}

});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~LOGIN~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

client.login(process.env.TOKEN);
require("https")
  .createServer()
  .listen();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
