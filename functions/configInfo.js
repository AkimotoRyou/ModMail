module.exports = {
  name: "configInfo",
  async execute(param, message, args){
    const Discord = param.Discord;
    const moment = param.moment;
    const client = param.client;
    const getEmbed = param.getEmbed;
    const config = param.config;
    const ConfigDB = param.ConfigDB;

    const configName = args.shift();
    const isConfig = await ConfigDB.findOne({where: {name: configName}});
    const configCollection = await ConfigDB.findAll({ attributes: ["name"] });
    const configList = configCollection.map(conf => `\`${conf.name}\``).join(', ');

    const noConfigEmbed = getEmbed.execute(param, config.error_color, "Not Found", `Couldn\'t find config named \`${configName}\`.\nAvailable names : ${configList}`);

    var configData = [];
    if (configName == "prefix") {
      configData.push(`**Name** : ${configName}`);
      configData.push(`**Description** : To differentiate between a command and non command.`);
      configData.push(`**Requirements** : \n\`> Any input that didn\'t have [space] as it\'ll be ignored.\``);
    } else if(configName == "botOwnerID") {
      configData.push(`**Name** : ${configName}`);
      configData.push(`**Description** : An owner of this bot can use any commands anywhere.`);
      configData.push(`**Requirements** : \n\`> Only bot owner can change this value.\n> Input can\'t be empty.\``);
    } else if(configName == "mainServerID") {
      configData.push(`**Name** : ${configName}`);
      configData.push(`**Description** : The server that is used by users who will use this bot to ask moderators.`);
      configData.push(`**Requirements** : \n\`> Any server that have this bot.\n> Value can be same as [threadServerID].\``);
    } else if(configName == "threadServerID") {
      configData.push(`**Name** : ${configName}`);
      configData.push(`**Description** : The server where thread channels will be on.`);
      configData.push(`**Requirements** : \n\`> Any server that have this bot.\n> Value can be same as [mainServerID].\``);
    } else if(configName == "categoryID") {
      configData.push(`**Name** : ${configName}`);
      configData.push(`**Description** : Category channel where thread channels will be created.`);
      configData.push(`**Requirements** : \n\`> Any category channel that are inside thread server.\n> [threadServerID] value can\'t be empty.\``);
      configData.push(`**Note** : To understand what category channel is, check (<https://support.discordapp.com/hc/en-us/articles/115001580171-Channel-Categories-101>).`);
      configData.push(`\`ps. Discord.js treat it as channel that\'s why i use this term too.\``);
    } else if(configName == "logChannelID") {
      configData.push(`**Name** : ${configName}`);
      configData.push(`**Description** : Channel where thread logs will be sent.`);
      configData.push(`**Requirements** : \n\`> Any channel inside thread server.\n> [threadServerID] value can\'t be empty.\``);
    } else if(configName == "adminRoleID") {
      configData.push(`**Name** : ${configName}`);
      configData.push(`**Description** : Role that will have administrator permission level.`);
      configData.push(`**Requirements** : \n\`> Any role inside thread server.\n> [threadServerID] value can\'t be empty.\``);
    } else if(configName == "modRoleID") {
      configData.push(`**Name** : ${configName}`);
      configData.push(`**Description** : Role that will have moderator permission level.`);
      configData.push(`**Requirements** : \n\`> Any role inside thread server.\n> [threadServerID] value can\'t be empty.\``);
    } else if(configName == "mentionedRoleID") {
      configData.push(`**Name** : ${configName}`);
      configData.push(`**Description** : The role that will be mentioned on new thread.`);
      configData.push(`**Requirements** : \n\`> Can be empty (no one mentioned).\n> Any role at thread server including here and everyone [set mentionedRoleID everyone].\``);
    } else if(configName == "botChannelID") {
      configData.push(`**Name** : ${configName}`);
      configData.push(`**Description** : Channel where user can only use to execute commands (any commands in other channels will be ignored except help commands).`);
      configData.push(`**Requirements** : \n\`> Can be empty (everyone can use any commands anywhere).\n> Any channels inside main server.\n> Should\'t be a category channel (Discord.js treat categories as a channel too).\``);
    } else if(configName == "maintenance") {
      configData.push(`**Name** : ${configName}`);
      configData.push(`**Description** : Maintenance mode toggle. Config changed according previous value.`);
    } else if(configName == "info_color") {
      configData.push(`**Name** : ${configName}`);
      configData.push(`**Description** : Color used for any information related embeds.`);
      configData.push(`**Requirements** : \n\`> Hex code color input.\``);
    } else if(configName == "warning_color") {
      configData.push(`**Name** : ${configName}`);
      configData.push(`**Description** : Color used for any warning related embeds.`);
      configData.push(`**Requirements** : \`.\``);
    } else if(configName == "error_color") {
      configData.push(`**Name** : ${configName}`);
      configData.push(`**Description** : Color used for any error related embeds.`);
      configData.push(`**Requirements** : \`.\``);
    } else if(configName == "sent_color") {
      configData.push(`**Name** : ${configName}`);
      configData.push(`**Description** : Color used for any message sent on threads related embeds.`);
      configData.push(`**Requirements** : \`.\``);
    } else if(configName == "received_color") {
      configData.push(`**Name** : ${configName}`);
      configData.push(`**Description** : Color used for any message received on threads related embeds.`);
      configData.push(`**Requirements** : \`.\``);
    } else {
      configData.push(`\`Information is still not available.\``);
    }
    const dataEmbed = await getEmbed.execute(param, config.info_color, "Configuration Information", configData.join('\n'));

    if (!isConfig) {
      return message.channel.send(noConfigEmbed);
    } else {
      return message.channel.send(dataEmbed);
    };

  }
};
