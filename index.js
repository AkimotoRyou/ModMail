/*

*/

//===============================DEPENDECIES====================================

//#dependencies
console.log("Loading Dependencies");
const Discord = require("discord.js");
const { Util, Attachment } = require("discord.js");
const client = new Discord.Client();
const server = require("./server.js");
const Sequelize = require("sequelize");
const fs = require("fs");
const moment = require("moment");
const defConfig = require("./config.json");
require("dotenv").config();

//==============================================================================
//================================VARIABLES=====================================

console.log("Loading Variables");
//#config
//Config used by bot (synced from database everytime bot ready).
//Use same variable name on config.json or it won't be able to reseted on reset.
var config = {
  prefix: "",
  botOwnerID: "",
  serverID: "",
  categoryID: "",
  logChannelID: "",
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

//----Activity List----
//#activities
var activities = [
  `Glitch.com | ${defConfig.prefix}commands`,
  `DM to contact Staff | ${defConfig.prefix}help`,
  `DM, um Mitarbeiter zu kontaktieren | ${defConfig.prefix}helpDE`,
  `Personel ile irtibata geçmek için DM | ${defConfig.prefix}helpTR`,
  `직원에게 연락하는 DM | ${defConfig.prefix}helpKO`,
  `DM para entrar em contato com a equipe | ${defConfig.prefix}helpPT`,
  `DM contacte le personnel | ${defConfig.prefix}helpFR`,
  `DM связаться с персоналом | ${defConfig.prefix}helpRU`,
  `DM 与官方人员联系 | ${defConfig.prefix}helpCHS`,
  `DM 與官方人員聯繫 | ${defConfig.prefix}helpCHT`,
  `DM para contactar al personal | ${defConfig.prefix}helpES`
];

//----Database----
//#db
const blockedDB = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "blocked.sqlite"
});
const BlockedDB = blockedDB.define("blocked", {
  name: {
    type: Sequelize.STRING,
    unique: true
  }
});

const configDB = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "config.sqlite"
});
const ConfigDB = configDB.define("config", {
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  input: Sequelize.STRING
});

//==============================================================================
//===============================FUNCTIONS======================================

console.log("Loading Functions");

//----------------------------------Get Embed-----------------------------------
//#embed
function getEmbed(color, title, description) {
  var embed = new Discord.RichEmbed()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter(client.user.tag, client.user.avatarURL)
    .setTimestamp();
  return embed;
}

//------------------------------Guild Member Check------------------------------
//#isMemberFn
async function isMember(msg) {
  if (
    config.serverID == "empty" ||
    config.categoryID == "empty" ||
    config.logChannelID == "empty"
  ) {
    msg.channel.send(
      getEmbed(
        config.error_color,
        "Error!",
        "Bot configuration has not been set. Use =setup command."
      )
    );
    return false;
  }
  let searchMember =
    (await client.guilds.get(config.serverID).members.get(msg.author.id)) ||
    false;
  if (searchMember) {
    return true;
  } else {
    await msg.channel.send(
      getEmbed(
        config.error_color,
        "Not Member!",
        `You aren't member of **${
          client.guilds.get(config.serverID).name
        }** server.`
      )
    );
    return false;
  }
}

//------------------------------Blocked User Check------------------------------
//#isBlockedFn
async function isBlocked(msg) {
  if (
    config.serverID == "empty" ||
    config.categoryID == "empty" ||
    config.logChannelID == "empty"
  ) {
    msg.channel.send(
      getEmbed(
        config.error_color,
        "Error!",
        "Bot configuration has not been set. Use =setup command."
      )
    );
    return false;
  }
  let findInBlock = await BlockedDB.findOne({ where: { name: msg.author.id } });
  if (!findInBlock) {
    return false;
  } else {
    return await msg.channel.send(
      getEmbed(
        config.error_color,
        "Blocked!",
        `You are blocked in **${
          client.guilds.get(config.serverID).name
        }** server.`
      )
    );
    return true;
  }
}

//-------------------------------Permission Check-------------------------------
//#permissionCheckFn
async function permissionCheck(msg, permission) {
  let result = false;
  if (msg.member.hasPermission(permission)) {
    result = true;
  } else {
    result = false;
  }
  return result;
}

//---------------------------------Role Check-----------------------------------
//#roleCheckFn
async function roleCheck(msg, roleID) {
  let result = false;
  if (roleID == "empty") {
    if (config.adminRoleID == "empty" && config.modRoleID == "empty") {
      msg.channel.send(
        getEmbed(
          config.warning_color,
          "Warning!",
          `Value of \`adminRoleID\` and \`modRoleID\` is empty. Use =setup to change it.`
        )
      );
      return result;
    } else if (config.adminRoleID == "empty") {
      msg.channel.send(
        getEmbed(
          config.warning_color,
          "Warning!",
          `Value of \`adminRoleID\` is empty. Use =setup to change it.`
        )
      );
      return result;
    } else if (config.modRoleID == "empty") {
      msg.channel.send(
        getEmbed(
          config.warning_color,
          "Warning!",
          `Value of \`modRoleID\` is empty. Use =setup to change it.`
        )
      );
      return result;
    }
  }
  let role = msg.guild.roles.get(roleID);
  if (msg.member.roles.find(r => r.id == roleID)) {
    result = true;
  } else {
    result = false;
  }
  return result;
}

//++++++++++++++++++++++++++++++Command Functions+++++++++++++++++++++++++++++++
//-----------------------------New Thread Function------------------------------
//#newThreadFn
async function newThread(msg, args) {
  if (
    config.serverID == "empty" ||
    config.categoryID == "empty" ||
    config.logChannelID == "empty"
  ) {
    return msg.channel.send(
      getEmbed(
        config.error_color,
        "Error!",
        "Bot configuration has not been set. Use =setup command."
      )
    );
  }
  let IsMember = await isMember(msg);
  let IsBlocked = await isBlocked(msg);
  let HaveThread = await client.guilds
    .get(config.serverID)
    .channels.find(ch => ch.name == msg.author.id);
  let MentionedRole = "";
  if (
    config.mentionedRoleID == "everyone" ||
    config.mentionedRoleID == "here"
  ) {
    MentionedRole = "@" + config.mentionedRoleID;
  } else if (
    config.mentionedRoleID != null &&
    config.mentionedRoleID != "empty"
  ) {
    MentionedRole = "<@&" + config.mentionedRoleID + ">";
  }
  if (HaveThread) {
    return await msg.channel.send(
      getEmbed(
        config.warning_color,
        "Open Thread Exist!",
        `You still have open thread.`
      )
    );
  }
  if (IsMember && !IsBlocked && !HaveThread) {
    let newChannel = await client.guilds
      .get(config.serverID)
      .createChannel(msg.author.id, { type: "text" });
    await newChannel.setParent(config.categoryID);
    await newChannel.lockPermissions().catch(console.error);

    let user = client.users.get(msg.author.id);
    let memberRoles = await client.guilds
      .get(config.serverID)
      .members.get(msg.author.id)
      .roles.filter(r => r.name !== "@everyone")
      .map(role => role.name)
      .join(", ");
    let description = `**Nickname** : \`${user.tag}\`\n**ID** : \`${
      user.id
    }\`\n**Created at** : ${moment(user.createdAt).format(
      "DD MMM YYYY, HH:mm"
    )}\n**Joined at** : ${moment(
      client.guilds.get(config.serverID).members.get(msg.author.id).joinedAt
    ).format("DD MMM YYYY, HH:mm")}\n**Roles** : ${memberRoles}`;
    let newThreadEmbed = new Discord.RichEmbed()
      .setColor(config.info_color)
      .setAuthor("New Thread!")
      .setTitle(`"${args}"`)
      .setDescription(description)
      .setThumbnail(msg.author.avatarURL)
      .setFooter(`${msg.author.tag} | ${msg.author.id}`, msg.author.avatarURL)
      .setTimestamp();
    newChannel.send(`${MentionedRole}`, newThreadEmbed);

    let logEmbed = new Discord.RichEmbed()
      .setColor(config.info_color)
      .setAuthor("New Thread!")
      .setTitle(`"${args}"`)
      .setFooter(`${msg.author.tag} | ${msg.author.id}`, msg.author.avatarURL)
      .setTimestamp();
    let logChannel = await client.guilds
      .get(config.serverID)
      .channels.get(config.logChannelID);
    logChannel.send(logEmbed);

    let mainServer = client.guilds.get(config.serverID);
    let dmEmbed = new Discord.RichEmbed()
      .setColor(config.info_color)
      .setTitle("Thread Created!")
      .setDescription(
        `**Title : "${args}"**\n\n\`Please describe your issue. (No command needed.)\``
      )
      .setFooter(mainServer.name, mainServer.iconURL)
      .setTimestamp();
    msg.channel.send(dmEmbed);
  }
}

//----------------------------User Response Function----------------------------
//#userResponseFn
async function userResponse(msg, channel) {
  let chatEmbed = new Discord.RichEmbed()
    .setColor(config.received_color)
    .setTitle("Message Received")
    .setDescription(msg.content)
    .setFooter(`${msg.author.tag} | ${msg.author.id}`, msg.author.avatarURL)
    .setTimestamp();
  if (msg.attachments.size == 0) {
    channel.send(chatEmbed).then(msg.react("✅"));
  } else if (msg.attachments.size == 1) {
    await msg.attachments.forEach(a => {
      let attachment = new Attachment(a.url);
      channel.send(chatEmbed.attachFile(attachment)).then(msg.react("✅"));
    });
  } else {
    await msg.attachments.forEach(a => {
      let attachment = new Attachment(a.url);
      channel.send(attachment);
    });
    channel.send(chatEmbed).then(msg.react("✅"));
  }
}

//------------------------------User Block Function-----------------------------
//#blockFn
async function block(msg, arg) {
  if (!arg) {
    msg.channel.send(
      getEmbed(
        config.warning_color,
        "Missing Argument",
        "**Usage** : `block [user-id]`\n\n`Note : The bot didn't check user existence to enable blocking someone outside the server. Please double check the ID before using this command.`"
      )
    );
  } else {
    try {
      const block = await BlockedDB.create({
        name: arg
      });
      return msg.channel.send(
        getEmbed(
          config.error_color,
          "Blocked!",
          `<@${block.name}> (${block.name}) has been blocked.`
        )
      );
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return msg.channel.send(
          getEmbed(
            config.warning_color,
            "Duplicated!",
            `<@${arg}> (${arg}) already blocked.`
          )
        );
      } else {
        return msg.channel.send(
          getEmbed(config.error_color, "Error", `${e.name}`)
        );
      }
    }
  }
}

//----------------------------Users Blocklist Function--------------------------
//#blockListFn
async function blocklist(msg, arg) {
  const list = await BlockedDB.findAll({ attributes: ["name", "createdAt"] });
  var pages = Math.floor(list.length / 20);
  if (list.length % 20 != 0) {
    pages += 1;
  }
  if (!arg || isNaN(arg) || arg < 0) {
    arg = 1;
  }
  if (list.length == 0) {
    arg = 0;
  }
  const string =
    list
      .map(
        b =>
          `**[${moment(b.createdAt).format("DD/MM/YYYY")}]** <@${b.name}> \`(${
            b.name
          })\``
      )
      .slice(Math.abs((arg - 1) * 20))
      .slice(0, 20)
      .join("\n") || "Blocklist empty.";
  return msg.channel.send(
    getEmbed(
      config.info_color,
      "**List of blocked user :**",
      `${string}\n\n\`Page ${arg} from ${pages} pages.\``
    )
  );
}

//----------------------------User Unblock Function----------------------------
//#unblockFn
async function unblock(msg, arg) {
  if (!arg) {
    msg.channel.send(
      getEmbed(
        config.warning_color,
        "Missing Argument",
        "**Usage** : `unblock [user-id]`"
      )
    );
  } else {
    const rowCount = await BlockedDB.destroy({ where: { name: arg } });
    if (!rowCount)
      return msg.channel.send(
        getEmbed(config.warning_color, "Not Found!", "That user isn't blocked.")
      );

    return msg.channel.send(
      getEmbed(config.info_color, "Success!", `<@${arg}> (${arg}) unblocked.`)
    );
  }
}

//-----------------------------Thread Reply Function----------------------------
//#replyFn
async function reply(msg, arg) {
  if (
    config.serverID == "empty" ||
    config.categoryID == "empty" ||
    config.logChannelID == "empty"
  ) {
    return msg.channel.send(
      getEmbed(
        config.error_color,
        "Error!",
        "Bot configuration has not been set. Use =setup command."
      )
    );
  }
  if (!arg && msg.attachments.size == 0) {
    let embed = getEmbed(
      config.warning_color,
      "Missing Argument",
      `**Usage** : \`reply [reply message]\``
    );
    return msg.channel.send(embed);
  } else {
    let text = msg.content
      .split(/ +/)
      .slice(1)
      .join(" ");
    let channelName = await msg.channel.name;
    let user = await client.guilds.get(config.serverID).members.get(channelName)
      .user;
    let moderator = msg.author;

    if (!user) {
      msg.channel.send(
        getEmbed(
          config.warning_color,
          "User Not Found!",
          `Can\'t find <@${channelName}>.`
        )
      );
    } else {
      let mainServer = client.guilds.get(config.serverID);
      let chatGuildEmbed = new Discord.RichEmbed()
        .setColor(config.sent_color)
        .setAuthor(moderator.tag, moderator.avatarURL)
        .setTitle("Message sent")
        .setDescription(text)
        .setFooter(`${user.tag} | ${user.id}`, user.avatarURL)
        .setTimestamp();
      let chatDMEmbed = new Discord.RichEmbed()
        .setColor(config.sent_color)
        .setAuthor(moderator.tag, moderator.avatarURL)
        .setDescription(text)
        .setFooter(mainServer.name, mainServer.iconURL)
        .setTimestamp();
      if (msg.attachments.size == 0) {
        msg.channel.send(chatGuildEmbed);
        user.send(chatDMEmbed);
        msg.delete();
      } else {
        await msg.attachments.forEach(a => {
          let attachment = new Attachment(a.url);
          msg.channel.send(attachment).then(user.send(attachment));
        });
        msg.channel.send(chatGuildEmbed);
        user.send(chatDMEmbed);
        msg.delete();
      }
    }
  }
}

//----------------------------Thread Close Function-----------------------------
//#closeFn
async function close(msg, arg) {
  if (
    config.serverID == "empty" ||
    config.categoryID == "empty" ||
    config.logChannelID == "empty"
  ) {
    return msg.channel.send(
      getEmbed(
        config.error_color,
        "Error!",
        "Bot configuration has not been set. Use =setup command."
      )
    );
  }
  if (
    msg.channel.parentID != config.categoryID ||
    msg.channel.id == config.logChannelID
  ) {
    let embed = getEmbed(
      config.warning_color,
      "Not Thread Channel",
      "This is not thread channel."
    );
    msg.channel.send(embed);
  } else if (!arg) {
    let embed = getEmbed(
      config.warning_color,
      "Missing Argument",
      `**Usage** : \`close [reason], [note]\``
    );
    return msg.channel.send(embed);
  } else {
    let temp = arg.split(/,+/);
    let reason = temp[0];
    let note = temp[1] || "Empty";
    let logChannel = await client.guilds
      .get(config.serverID)
      .channels.get(config.logChannelID);
    let channelName = await msg.channel.name;
    let user = await client.guilds.get(config.serverID).members.get(channelName)
      .user;
    let moderator = msg.author;

    let logEmbed = new Discord.RichEmbed()
      .setColor(config.error_color)
      .setAuthor(moderator.tag, moderator.avatarURL)
      .setTitle("Thread closed!")
      .setDescription(`**Reason** : ${reason}\n**Note** : ${note}`)
      .setFooter(`${user.tag} | ${user.id}`, user.avatarURL)
      .setTimestamp();
    let dmEmbed = new Discord.RichEmbed()
      .setColor(config.error_color)
      .setAuthor(
        client.guilds.get(config.serverID).name,
        client.guilds.get(config.serverID).iconURL
      )
      .setTitle("Thread closed!")
      .setDescription(`**Reason** : ${reason}`)
      .setFooter(`${user.tag} | ${user.id}`, user.avatarURL)
      .setTimestamp();
    msg.channel.delete().catch(console.error);
    logChannel.send(logEmbed);
    user.send(dmEmbed);
  }
}

//-----------------------------Reset Config Function----------------------------
//#resetFn
//Using variables at config.js as default.
//I've tried to reverse this to (update > error > create) it can't find the row, didn't throw any error, and keep searching indefinitely.
async function resetConfig() {
  let configKeys = Object.keys(config);
  configKeys.forEach(async aKey => {
    try {
      //Create new row on config.sqlite
      const newConfig = await ConfigDB.create({
        name: aKey,
        input: defConfig[aKey]
      });
    } catch (e) {
      //Edit the value in config.sqlite with the one from config.js
      if (e.name === "SequelizeUniqueConstraintError") {
        await ConfigDB.update(
          { input: defConfig[aKey] },
          { where: { name: aKey } }
        );
      } else {
        console.log(e);
      }
    }
  });
  return await configSync();
}

//-----------------------------Config Setup Function----------------------------
//#setupFn
async function setup(msg, configName, configValue) {
  if (configName == "botOwnerID") {
    if (msg.author.id != config.botOwnerID) {
      return msg.channel.send(
        getEmbed(
          config.warning_color,
          "Missing Permission",
          "Only bot owner can change this value."
        )
      );
    } else if (!client.users.get(configValue)) {
      return msg.channel.send(
        getEmbed(config.warning_color, "Not Found!", "Can't find that user")
      );
    }
  } else if (configName == "serverID" && configValue != "empty") {
    if (!client.guilds.get(configValue))
      return msg.channel.send(
        getEmbed(config.warning_color, "Not Found!", "Cannot find that server.")
      );
  } else if (!config.serverID || config.serverID == "empty") {
    return msg.channel.send(
      getEmbed(
        config.error_color,
        "Cannot find ServerID!",
        "Please set `serverID` to change this value. `setup serverID [serverID]`"
      )
    );
  } else if (configName == "categoryID" && configValue != "empty") {
    if (!client.guilds.get(config.serverID).channels.get(configValue))
      return msg.channel.send(
        getEmbed(
          config.warning_color,
          "Not Found",
          "Can't find that category channel."
        )
      );
  } else if (configName == "logChannelID" && configValue != "empty") {
    if (!client.guilds.get(config.serverID).channels.get(configValue))
      return msg.channel.send(
        getEmbed(config.warning_color, "Not Found", "Can't find that channel.")
      );
  } else if (configName == "adminRoleID" && configValue != "empty") {
    if (!client.guilds.get(config.serverID).roles.get(configValue))
      return msg.channel.send(
        getEmbed(config.warning_color, "Not Found", "Can't find that role.")
      );
  } else if (configName == "modRoleID" && configValue != "empty") {
    if (!client.guilds.get(config.serverID).roles.get(configValue))
      return msg.channel.send(
        getEmbed(config.warning_color, "Not Found", "Can't find that role.")
      );
  } else if (
    configName == "mentionedRoleID" &&
    configValue != "everyone" &&
    configValue != "here" &&
    configValue != "empty"
  ) {
    if (!client.guilds.get(config.serverID).roles.get(configValue))
      return msg.channel.send(
        getEmbed(config.warning_color, "Not Found", "Can't find that role.")
      );
  } else if (configName == "maintenance") {
    if (config.maintenance == "0") {
      configValue = "1";
    } else {
      configValue = "0";
    }
  } else if (
    configName ==
    ("info_color" ||
      "warning_color" ||
      "error_color" ||
      "received_color" ||
      "sent_color")
  ) {
    var colorTest = /^#[0-9A-F]{6}$/i; //check if input is a hex color code. Search "JavaScript how to check hex code" for explanation.
    if (colorTest.test(configValue) == false) {
      return msg.channel.send(
        getEmbed(
          config.warning_color,
          "Invalid Input",
          `Use hex code for input.\n\nExample : \`#ffffff\`, \`#000000\`\n\nColor picker site will be helpful https://html-color.codes/`
        )
      );
    }
  }
  let checkDB = await ConfigDB.findOne({ where: { name: configName } });
  if (!checkDB) {
    const configList = await ConfigDB.findAll({ attributes: ["name"] });
    const configString =
      configList.map(c => `\`${c.name}\``).join(", ") ||
      "Database empty, use =reset command.";
    return msg.channel.send(
      getEmbed(
        config.warning_color,
        "Failed",
        `Could not find a config with name \`${configName}\`.\n\nAvailable config : ${configString}`
      )
    );
  } else {
    const affectedRows = await ConfigDB.update(
      { input: configValue },
      { where: { name: configName } }
    );
    if (affectedRows > 0) {
      await configSync();
      await msg.channel.send(
        getEmbed(
          config.error_color,
          "Success",
          `Value of \`${configName}\` was edited to \`${configValue}\`.`
        )
      );
      if (configName == "maintenance") {
        process.exit(1);
      }
    }
  }
}

//-----------------------------Config List Function-----------------------------
//#configlistFn
async function configList(msg) {
  let configKeys = Object.keys(config);
  let serverSet = "",
    colorSet = "";
  for (var i = 1; i < 8; i++) {
    serverSet += `${configKeys[i]} : \`${config[configKeys[i]]}\`\n`;
  }
  for (var i = 9; i < 14; i++) {
    colorSet += `${configKeys[i]} : \`${config[configKeys[i]]}\`\n`;
  }
  var embed = new Discord.RichEmbed()
    .setColor(config.info_color)
    .setTitle("Config List")
    .addField(
      configKeys[0][0].toUpperCase() + configKeys[0].slice(1),
      config[configKeys[0]]
    ) //Get config.prefix name and it's value
    .addField("Server Config", serverSet)
    .addField(
      configKeys[8][0].toUpperCase() + configKeys[8].slice(1),
      config[configKeys[8]]
    ) //Get config.maintenance name and it's value
    .addField("Color Config", colorSet)
    .setFooter(client.user.tag, client.user.avatarURL)
    .setTimestamp();
  return msg.channel.send(embed);
}

//-----------------------------Server List Function-----------------------------
//#serverlistFn
async function serverList(msg) {
  let list =
    client.guilds.map(g => `**${g.name}** \`(${g.id})\``).join("\n") ||
    "The bot hasn't joined any server yet.";
  return msg.channel.send(getEmbed(config.info_color, "Server List", list));
}

//----------------------------Leave Server Function-----------------------------
//#leaveFn
async function leaveServer(msg, server_ID) {
  if (!server_ID) {
    return msg.channel.send(
      getEmbed(
        config.warning_color,
        "Missing Argument",
        "Usage : `leave [serverID]`"
      )
    );
  }
  let server = client.guilds.get(server_ID);
  if (!server) {
    return msg.channel.send(
      getEmbed(
        config.warning_color,
        "Unidentified!",
        `The bot isn't inside the server with serverID of \`(${server_ID})\`.`
      )
    );
  } else {
    server.leave();
    return msg.channel.send(
      getEmbed(
        config.error_color,
        "Leaving Server.",
        `Leaving from **"${server.name}"** server.`
      )
    );
  }
}

//+++++++++++++++++++++++++++Config Sync Function+++++++++++++++++++++++++++++++
//#configSyncFn
//syncing the variables value at #config with the database file
async function configSync() {
  client.user.setActivity("Syncing...", { type: "WATCHING" });
  let configKeys = Object.keys(config);
  var syncPromise = new Promise(resolve => {
    configKeys.forEach(async aKey => {
      try {
        let getConfig = await ConfigDB.findOne({ where: { name: aKey } }).catch(
          console.error
        );
        config[aKey] = getConfig.input || "empty";
        resolve();
      } catch (e) {
        if (e.message == "Cannot read property 'input' of null") {
          await resetConfig();
          resolve();
        }
        return console.log(e);
      }
    });
  });
  syncPromise.then(() => {
    console.log("Sync done.");
  });
}

//==============================================================================
//==================================READY=======================================
//#botReady
client.on("ready", async () => {
  console.log("Syncing database....");
  await BlockedDB.sync();
  await ConfigDB.sync();
  await configSync();
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("Ready.", { type: "WATCHING" });
  //when i use local variable (config.maintenance), the configSync() is still in process.
  let getMT = await ConfigDB.findOne({ where: { name: "maintenance"} }).catch(console.error);
  if (getMT.input == "0") {
    let index = 0;
    setInterval(() => {
      client.user.setActivity(activities[index], { type: "WATCHING" });
      index++;
      if (index == activities.length) index = 0;
    }, 7000);
  } else {
    client.user.setActivity("Under Maintenance.", { type: "WATCHING" });
  }
});

//==============================================================================
//=================================NEW GUILD====================================
//#botJoin
client.on("guildCreate", async guild => {
  client.users
    .get(config.botOwnerID)
    .send(
      getEmbed(
        config.info_color,
        "Joined a Server",
        `Joined \`${guild.name}\` server.\nServerID : \`${guild.id}\``
      )
    );
});

//==============================================================================
//=================================MESSAGES=====================================
//#newMessage
client.on("message", async msg => {
  if (msg.author.bot) return;

  //----------------------------Local Variables---------------------------------

  let cmd = msg.content
    .slice(config.prefix.length)
    .split(/ +/, 1)
    .join(" ")
    .toLowerCase();
  let arg = msg.content
    .split(/ +/)
    .slice(1)
    .join(" ");

  //------------------------Command Message Handler-----------------------------
  //checking from default config first so that you can always use default prefix to run any commands
  if (
    msg.content.indexOf(defConfig.prefix) == 0 ||
    msg.content.indexOf(config.prefix) == 0
  ) {
    //-------------------------Restart Command----------------------------------
    //#restartCmd
    if (cmd == "restart") {
      const embed = new Discord.RichEmbed()
        .setTitle("Done.")
        .setDescription(`Restarted in **${Math.floor(client.ping)}**ms`);
      const errorEmbed = getEmbed(
        config.error_color,
        "Missing Permission",
        "Only Owner and Admin can use this command."
      );
      if (msg.guild == null) {
        if (msg.author.id === config.botOwnerID) {
          msg.channel.send(embed).then(() => {
            process.exit(1);
          });
        } else {
          return msg.channel.send(errorEmbed);
        }
      } else {
        if (msg.author.id === config.botOwnerID) {
          msg.channel.send(embed).then(() => {
            process.exit(1);
          });
        } else if (
          msg.guild.id == config.serverID ||
          (await permissionCheck(msg, "ADMINISTRATOR"))
        ) {
          if (
            (await roleCheck(msg, config.adminRoleID)) ||
            (await permissionCheck(msg, "ADMINISTRATOR"))
          ) {
            msg.channel.send(embed).then(() => {
              process.exit(1);
            });
          } else {
            return msg.channel.send(errorEmbed);
          }
        } else {
          if (config.serverID == "empty") {
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Warning!",
                "The `serverID` value has not been set."
              )
            );
          } else {
            let serverName = await client.guilds.get(config.serverID).name;
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Not Main Server!",
                `You need to be in **${serverName}** to use this command.`
              )
            );
          }
        }
      }
    }

    //--------------------------Server List Command-----------------------------
    //#serverlistCmd
    else if (cmd == "serverlist") {
      const errorEmbed = getEmbed(
        config.error_color,
        "Missing Permission",
        "Only Owner and Admin can use this command."
      );
      if (msg.guild == null) {
        if (msg.author.id === config.botOwnerID) {
          await serverList(msg);
        } else {
          return msg.channel.send(errorEmbed);
        }
      } else {
        if (msg.author.id === config.botOwnerID) {
          await serverList(msg);
        } else if (
          msg.guild.id == config.serverID ||
          (await permissionCheck(msg, "ADMINISTRATOR"))
        ) {
          if (
            (await roleCheck(msg, config.adminRoleID)) ||
            (await permissionCheck(msg, "ADMINISTRATOR"))
          ) {
            await serverList(msg);
          } else {
            return msg.channel.send(errorEmbed);
          }
        } else {
          if (config.serverID == "empty") {
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Warning!",
                "The `serverID` value has not been set."
              )
            );
          } else {
            let serverName = await client.guilds.get(config.serverID).name;
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Not Main Server!",
                `You need to be in **${serverName}** to use this command.`
              )
            );
          }
        }
      }
    }

    //--------------------------Leave Server Command----------------------------
    //#leaveCmd
    else if (cmd == "leave") {
      const errorEmbed = getEmbed(
        config.error_color,
        "Missing Permission",
        "Only Owner can use this command."
      );
      if (msg.author.id === config.botOwnerID) {
        await leaveServer(msg, arg);
      } else {
        return msg.channel.send(errorEmbed);
      }
    }

    //---------------------------Command list Command---------------------------
    //#cmdlistCmd
    else if (cmd == "commands") {
      let ownerLevel = "**leave** : Make the bot leave a specified server.";
      let adminLevel =
        "**restart** : Restart the bot.\n" +
        "**reset** : Reset config values to default.\n" +
        "**setup** : Setup config values.\n" +
        "**configlist** : Show current config setting.\n" +
        "**serverlist** : Show a list of servers that have this bot.";
      let modLevel =
        "**reply** : Reply to a user thread.\n" +
        "**close** : Close a thread.\n" +
        "**block** : Block a user.\n" +
        "**blocklist** : Show list of blocked user.\n" +
        "**unblock** : Remove a user from blocked list.";
      let userLevel =
        "**new** : Create a new thread.\n" +
        "**help** : Show instruction about how to use the bot.\n" +
        "**helpde** : Anleitung zur Verwendung des Bots anzeigen.\n" +
        "**helptr** : Bot kullanımı hakkında talimat göster.\n" +
        "**helpko** : 봇 사용 방법에 대한 지시 사항 표시.\n" +
        "**helppt** : Mostrar instruções sobre como usar o bot.\n" +
        "**helpfr** : Afficher les instructions sur l'utilisation du bot.\n" +
        "**helpru** : Показать инструкцию о том, как использовать бот.\n" +
        "**helpchs** : 显示如何使用操作这个系统的说明.\n" +
        "**helpcht** : 顯示如何使用操作這個系統的說明.\n" +
        "**helpes** : Mostrar instrucciones sobre cómo usar el bot.";
      let ownerEmbed = new Discord.RichEmbed()
        .setColor(config.info_color)
        .setTitle("Command List")
        .addField("Owner Level", ownerLevel)
        .addField("Admin Level", adminLevel)
        .addField("Moderator Level", modLevel)
        .addField("User level", userLevel)
        .setThumbnail(client.user.avatarURL)
        .setFooter(client.user.tag, client.user.avatarURL)
        .setTimestamp();
      let adminEmbed = new Discord.RichEmbed()
        .setColor(config.info_color)
        .setTitle("Command List")
        .addField("Admin Level", adminLevel)
        .addField("Moderator Level", modLevel)
        .addField("User level", userLevel)
        .setThumbnail(client.user.avatarURL)
        .setFooter(client.user.tag, client.user.avatarURL)
        .setTimestamp();
      let moderatorEmbed = new Discord.RichEmbed()
        .setColor(config.info_color)
        .setTitle("Command List")
        .addField("Moderator Level", modLevel)
        .addField("User level", userLevel)
        .setThumbnail(client.user.avatarURL)
        .setFooter(client.user.tag, client.user.avatarURL)
        .setTimestamp();
      let userEmbed = new Discord.RichEmbed()
        .setColor(config.info_color)
        .setTitle("Command List")
        .addField("User level", userLevel)
        .setThumbnail(client.user.avatarURL)
        .setFooter(client.user.tag, client.user.avatarURL)
        .setTimestamp();
      if (msg.guild == null) {
        if (msg.author.id === config.botOwnerID) {
          msg.channel.send(ownerEmbed);
        } else {
          return msg.channel.send(userEmbed);
        }
      } else {
        if (msg.author.id === config.botOwnerID) {
          msg.channel.send(ownerEmbed);
        } else if (
          msg.guild.id == config.serverID ||
          (await permissionCheck(msg, "ADMINISTRATOR"))
        ) {
          if (
            (await roleCheck(msg, config.adminRoleID)) ||
            (await permissionCheck(msg, "ADMINISTRATOR"))
          ) {
            msg.channel.send(adminEmbed);
          } else if (await roleCheck(msg, config.modRoleID)) {
            msg.channel.send(moderatorEmbed);
          } else {
            msg.channel.send(userEmbed);
          }
        } else {
          if (config.serverID == "empty") {
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Warning!",
                "The `serverID` value has not been set."
              )
            );
          } else {
            let serverName = await client.guilds.get(config.serverID).name;
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Not Main Server!",
                `You need to be in **${serverName}** to use this command.`
              )
            );
          }
        }
      }
    }

    //-------------------------------Help Commands------------------------------
    //#helpCmd
    else if (cmd == "help") {
      let embed = getEmbed(
        config.info_color,
        "Instruction",
        "Use `=new Your thread title here` to create a new thread. You don't need to use any command after your thread created. Describe your issue afterward."
      );
      msg.channel.send(embed);
    } else if (cmd == "helpde") {
      let embed = getEmbed(
        config.info_color,
        "Anweisung",
        "Verwenden Sie `=new Dein Threadtitel hier`, um einen neuen Thread zu erstellen (es wird **Thread Created!** Angezeigt). Sie müssen nach dem Erstellen Ihres Threads keinen Befehl mehr verwenden. Beschreiben Sie anschließend Ihr Problem."
      );
      msg.channel.send(embed);
    } else if (cmd == "helptr") {
      let embed = getEmbed(
        config.info_color,
        "Talimat",
        "Yeni bir bilet oluşturmak için `=new konuyu buraya yazın` kullanın (şu mesajı alırsınız: **Thread Created!**). Konuyu oluşturduktan sonra herhangi bir komut kullanmanıza gerek yoktur. Daha sonra sorununuzu açıklayın."
      );
      msg.channel.send(embed);
    } else if (cmd == "helpko") {
      let embed = getEmbed(
        config.info_color,
        "교수",
        "`=new 스레드 제목을 여기에 사용하십시오` 새 스레드를 만들려면 **Thread Created!** 라고합니다. 스레드가 생성 된 후에는 명령을 사용할 필요가 없습니다. 나중에 문제를 설명하십시오."
      );
      msg.channel.send(embed);
    } else if (cmd == "helppt") {
      let embed = getEmbed(
        config.info_color,
        "Instrução",
        "Digite `=new O título do seu tópico aqui`. para criar um novo tópico (ele dirá **Thread Created!**). Você não precisa usar nenhum comando após a criação do seu thread. Descreva seu problema posteriormente."
      );
      msg.channel.send(embed);
    } else if (cmd == "helpfr") {
      let embed = getEmbed(
        config.info_color,
        "Instruction",
        "Taper `=new le titre de votre sujet de discussion  ici` pour créer un nouveau sujet (ça va dire **Thread Created!**). Vous n'avez plus besoin d'utiliser de commande après la création du sujet. Décrivez simplement votre problème."
      );
      msg.channel.send(embed);
    } else if (cmd == "helpru") {
      let embed = getEmbed(
        config.info_color,
        "инструкция",
        "Введите `=new заголовок вашей темы здесь`. создать новую тему (будет сказано **Thread Created!**). Вам не нужно использовать какую-либо команду после создания вашего потока. Опишите вашу проблему позже."
      );
      msg.channel.send(embed);
    } else if (cmd == "helpchs") {
      let embed = getEmbed(
        config.info_color,
        "指令",
        "在此处输入`=new 您的线程标题`。 创建一个新线程（它将显示为 **Thread Created！**）。 创建线程后，无需使用任何命令。 之后描述您的问题。"
      );
      msg.channel.send(embed);
    } else if (cmd == "helpcht") {
      let embed = getEmbed(
        config.info_color,
        "指令",
        "在此處輸入 `=new 您的線程標題`。 創建一個新線程（它將顯示為 **Thread Created!**）。 創建線程後，無需使用任何命令。 之後描述您的問題。"
      );
      msg.channel.send(embed);
    } else if (cmd == "helpes") {
      let embed = getEmbed(
        config.info_color,
        "Instrucción",
        "Escribe `=new el título de su tema de discusión aquí` para crear un nuevo tema (esto mostrará **Thread Created!**). Ya no necesita usar un comando después de crear el asunto. Sólo tiene que describir su problema."
      );
      msg.channel.send(embed);
    }

    //----------------------------New Thread Command----------------------------
    //#newThreadCmd
    else if (cmd == "new") {
      if (msg.guild == null) {
        if (!arg) {
          let embed = getEmbed(
            config.warning_color,
            "Missing Argument",
            "Usage : `new [Thread Title]`"
          );
          return msg.channel.send(embed);
        } else {
          await newThread(msg, arg);
        }
      } else {
        msg.channel.send(
          getEmbed(
            config.error_color,
            "Command Unavailable",
            "This command can only be used in Direct Message."
          )
        );
      }
    }

    //----------------------------Thred Reply Command---------------------------
    //#replyCmd
    else if (cmd == "reply") {
      const errorEmbed = getEmbed(
        config.error_color,
        "Missing Permission",
        "You need to have moderator role to use this command."
      );
      if (msg.guild == null) {
        return msg.channel.send(
          getEmbed(
            config.warning_color,
            "Command Unavailable",
            "You can't use this command in DM."
          )
        );
      } else {
        if (msg.author.id === config.botOwnerID) {
          await reply(msg, arg);
        } else if (
          msg.guild.id == config.serverID ||
          (await permissionCheck(msg, "ADMINISTRATOR"))
        ) {
          if (
            (await roleCheck(msg, config.modRoleID)) ||
            (await roleCheck(msg, config.adminRoleID)) ||
            (await permissionCheck(msg, "ADMINISTRATOR"))
          ) {
            await reply(msg, arg);
          } else {
            return msg.channel.send(errorEmbed);
          }
        } else {
          if (config.serverID == "empty") {
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Warning!",
                "The `serverID` value has not been set."
              )
            );
          } else {
            let serverName = await client.guilds.get(config.serverID).name;
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Not Main Server!",
                `You need to be in **${serverName}** to use this command.`
              )
            );
          }
        }
      }
    }

    //---------------------------Thread Close Command---------------------------
    //#closeCmd
    else if (cmd == "close") {
      const errorEmbed = getEmbed(
        config.error_color,
        "Missing Permission",
        "You need to have moderator role to use this command."
      );
      if (msg.guild == null) {
        return msg.channel.send(
          getEmbed(
            config.warning_color,
            "Command Unavailable",
            "You can't use this command in DM."
          )
        );
      } else {
        if (msg.author.id === config.botOwnerID) {
          await close(msg, arg);
        } else if (
          msg.guild.id == config.serverID ||
          (await permissionCheck(msg, "ADMINISTRATOR"))
        ) {
          if (
            (await roleCheck(msg, config.modRoleID)) ||
            (await roleCheck(msg, config.adminRoleID)) ||
            (await permissionCheck(msg, "ADMINISTRATOR"))
          ) {
            await close(msg, arg);
          } else {
            return msg.channel.send(errorEmbed);
          }
        } else {
          if (config.serverID == "empty") {
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Warning!",
                "The `serverID` value has not been set."
              )
            );
          } else {
            let serverName = await client.guilds.get(config.serverID).name;
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Not Main Server!",
                `You need to be in **${serverName}** to use this command.`
              )
            );
          }
        }
      }
    }

    //---------------------------User Blocklist Command-------------------------
    //#blocklistCmd
    else if (cmd == "blocklist") {
      const errorEmbed = getEmbed(
        config.error_color,
        "Missing Permission",
        "You need to have moderator role to use this command."
      );
      if (msg.guild == null) {
        if (msg.author.id === config.botOwnerID) {
          await blocklist(msg, arg);
        } else {
          return msg.channel.send(
            getEmbed(
              config.warning_color,
              "Command Unavailable",
              "You can't use this command in DM."
            )
          );
        }
      } else {
        if (msg.author.id === config.botOwnerID) {
          await blocklist(msg, arg);
        } else if (
          msg.guild.id == config.serverID ||
          (await permissionCheck(msg, "ADMINISTRATOR"))
        ) {
          if (
            (await roleCheck(msg, config.modRoleID)) ||
            (await roleCheck(msg, config.adminRoleID)) ||
            (await permissionCheck(msg, "ADMINISTRATOR"))
          ) {
            await blocklist(msg, arg);
          } else {
            return msg.channel.send(errorEmbed);
          }
        } else {
          if (config.serverID == "empty") {
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Warning!",
                "The `serverID` value has not been set."
              )
            );
          } else {
            let serverName = await client.guilds.get(config.serverID).name;
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Not Main Server!",
                `You need to be in **${serverName}** to use this command.`
              )
            );
          }
        }
      }
    }

    //---------------------------User Block Command-----------------------------
    //#blockCmd
    else if (cmd == "block") {
      const errorEmbed = getEmbed(
        config.error_color,
        "Missing Permission",
        "You need to have moderator role to use this command."
      );
      if (msg.guild == null) {
        if (msg.author.id === config.botOwnerID) {
          await block(msg, arg);
        } else {
          return msg.channel.send(
            getEmbed(
              config.warning_color,
              "Command Unavailable",
              "You can't use this command in DM."
            )
          );
        }
      } else {
        if (msg.author.id === config.botOwnerID) {
          await block(msg, arg);
        } else if (
          msg.guild.id == config.serverID ||
          (await permissionCheck(msg, "ADMINISTRATOR"))
        ) {
          if (
            (await roleCheck(msg, config.modRoleID)) ||
            (await roleCheck(msg, config.adminRoleID)) ||
            (await permissionCheck(msg, "ADMINISTRATOR"))
          ) {
            await block(msg, arg);
          } else {
            return msg.channel.send(errorEmbed);
          }
        } else {
          if (config.serverID == "empty") {
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Warning!",
                "The `serverID` value has not been set."
              )
            );
          } else {
            let serverName = await client.guilds.get(config.serverID).name;
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Not Main Server!",
                `You need to be in **${serverName}** to use this command.`
              )
            );
          }
        }
      }
    }

    //----------------------------Unblock Command-------------------------------
    //#unblockCmd
    else if (cmd == "unblock") {
      const errorEmbed = getEmbed(
        config.error_color,
        "Missing Permission",
        "You need to have moderator role to use this command."
      );
      if (msg.guild == null) {
        if (msg.author.id === config.botOwnerID) {
          await unblock(msg, arg);
        } else {
          return msg.channel.send(
            getEmbed(
              config.warning_color,
              "Command Unavailable",
              "You can't use this command in DM."
            )
          );
        }
      } else {
        if (msg.author.id === config.botOwnerID) {
          await unblock(msg, arg);
        } else if (
          msg.guild.id == config.serverID ||
          (await permissionCheck(msg, "ADMINISTRATOR"))
        ) {
          if (
            (await roleCheck(msg, config.modRoleID)) ||
            (await roleCheck(msg, config.adminRoleID)) ||
            (await permissionCheck(msg, "ADMINISTRATOR"))
          ) {
            await unblock(msg, arg);
          } else {
            return msg.channel.send(errorEmbed);
          }
        } else {
          if (config.serverID == "empty") {
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Warning!",
                "The `serverID` value has not been set."
              )
            );
          } else {
            let serverName = await client.guilds.get(config.serverID).name;
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Not Main Server!",
                `You need to be in **${serverName}** to use this command.`
              )
            );
          }
        }
      }
    }

    //-----------------------------Reset Config Command-------------------------
    //#resetCmd
    else if (cmd == "reset") {
      const errorEmbed = getEmbed(
        config.error_color,
        "Missing Permission",
        "Only Owner and Admin can use this command."
      );
      if (msg.guild == null) {
        if (msg.author.id === config.botOwnerID) {
          await resetConfig();
          await configSync();
          msg.channel.send(
            getEmbed(
              config.error_color,
              "Success",
              "Config values has been reseted."
            )
          );
        } else {
          return msg.channel.send(
            getEmbed(
              config.warning_color,
              "Command Unavailable",
              "You can't use this command in DM."
            )
          );
        }
      } else {
        if (msg.author.id === config.botOwnerID) {
          await resetConfig();
          await configSync();
          msg.channel.send(
            getEmbed(
              config.error_color,
              "Success",
              "Config values has been reseted."
            )
          );
        } else if (
          msg.guild.id == config.serverID ||
          (await permissionCheck(msg, "ADMINISTRATOR"))
        ) {
          if (
            (await roleCheck(msg, config.adminRoleID)) ||
            (await permissionCheck(msg, "ADMINISTRATOR"))
          ) {
            await resetConfig();
            await configSync();
            msg.channel.send(
              getEmbed(
                config.error_color,
                "Success",
                "Config values has been reseted."
              )
            );
          } else {
            return msg.channel.send(errorEmbed);
          }
        } else {
          if (config.serverID == "empty") {
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Warning!",
                "The `serverID` value has not been set."
              )
            );
          } else {
            let serverName = await client.guilds.get(config.serverID).name;
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Not Main Server!",
                `You need to be in **${serverName}** to use this command.`
              )
            );
          }
        }
      }
    }

    //----------------------------Config Setup Command--------------------------
    //#setupCmd
    else if (cmd == "setup") {
      const noArgs = getEmbed(
        config.warning_color,
        "Missing Argument",
        "Usage : `setup [config name] [config value]`\n\n`Note : The bot didn't check the value given please set correctly to avoid errors.`"
      );
      const errorEmbed = getEmbed(
        config.error_color,
        "Missing Permission",
        "Only Owner and Admin can use this command."
      );
      let tempArg,
        configName,
        configValue = "";
      if (arg) {
        tempArg = arg.split(/ +/);
        configName = tempArg[0];
        configValue = tempArg[1] || "empty";
        configValue = configValue.toLowerCase();
      }
      if (msg.guild == null) {
        if (msg.author.id === config.botOwnerID) {
          if (!arg || !configName || !configValue) {
            msg.channel.send(noArgs);
          } else {
            await setup(msg, configName, configValue);
          }
        } else {
          return msg.channel.send(
            getEmbed(
              config.warning_color,
              "Command Unavailable",
              "You can't use this command in DM."
            )
          );
        }
      } else {
        if (msg.author.id === config.botOwnerID) {
          if (!arg || !configName || !configValue) {
            msg.channel.send(noArgs);
          } else {
            await setup(msg, configName, configValue);
          }
        } else if (
          msg.guild.id == config.serverID ||
          (await permissionCheck(msg, "ADMINISTRATOR"))
        ) {
          if (
            (await roleCheck(msg, config.adminRoleID)) ||
            (await permissionCheck(msg, "ADMINISTRATOR"))
          ) {
            if (!arg || !configName || !configValue) {
              msg.channel.send(noArgs);
            } else {
              await setup(msg, configName, configValue);
            }
          } else {
            return msg.channel.send(errorEmbed);
          }
        } else {
          if (config.serverID == "empty") {
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Warning!",
                "The `serverID` value has not been set."
              )
            );
          } else {
            let serverName = await client.guilds.get(config.serverID).name;
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Not Main Server!",
                `You need to be in **${serverName}** to use this command.`
              )
            );
          }
        }
      }
    }
    //----------------------------Config List Command---------------------------
    //#configlistCmd
    else if (cmd == "configlist") {
      const errorEmbed = getEmbed(
        config.error_color,
        "Missing Permission",
        "Only Owner and Admin can use this command."
      );
      if (msg.guild == null) {
        if (msg.author.id === config.botOwnerID) {
          await configList(msg);
        } else {
          return msg.channel.send(
            getEmbed(
              config.warning_color,
              "Command Unavailable",
              "You can't use this command in DM."
            )
          );
        }
      } else {
        if (msg.author.id === config.botOwnerID) {
          await configList(msg);
        } else if (
          msg.guild.id == config.serverID ||
          (await permissionCheck(msg, "ADMINISTRATOR"))
        ) {
          if (
            (await roleCheck(msg, config.adminRoleID)) ||
            (await permissionCheck(msg, "ADMINISTRATOR"))
          ) {
            await configList(msg);
          } else {
            return msg.channel.send(errorEmbed);
          }
        } else {
          if (config.serverID == "empty") {
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Warning!",
                "The `serverID` value has not been set."
              )
            );
          } else {
            let serverName = await client.guilds.get(config.serverID).name;
            msg.channel.send(
              getEmbed(
                config.warning_color,
                "Not Main Server!",
                `You need to be in **${serverName}** to use this command.`
              )
            );
          }
        }
      }
    }
  }
  //---------------------------UserDM Message Handler---------------------------
  //#userDM
  else if (msg.guild == null) {
    try {
      let getChannel = await client.guilds
        .get(config.serverID)
        .channels.find(ch => ch.name == msg.author.id);
      if (getChannel) {
        let IsMember = await isMember(msg);
        let IsBlocked = await isBlocked(msg);
        if (IsMember && !IsBlocked) {
          userResponse(msg, getChannel);
        }
      }
    } catch (e) {
      if (e.message == "Cannot read property 'channels' of undefined")
        return msg.channel.send(
          getEmbed(
            config.error_color,
            "Error!",
            "Bot configuration has not been set."
          )
        );
      console.log(e);
    }
  }
});

//==============================================================================
//==================================LOGIN=======================================

client.login(process.env.TOKEN);
require("http")
  .createServer()
  .listen();

//==============================================================================
