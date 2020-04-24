module.exports = {
  name: "configuration",
  async execute(param){
    const Discord = param.Discord;
    const client = param.client;
    const config = param.config;
    const configKeys = Object.keys(config); //getting the name of each config (prefix, botOwnerID, etc)
    let botConfig = [];
    let serverConfig = [];
    let embedColorConfig = [];
    let botOwnerIDIndex = ""; //As separator for server related config and bot config.
    let maintenanceIndex = ""; //As separator for server related config and embed color config.

    //getting the index first for separator
    for (var i = 0; i < configKeys.length; i++) {
      if(configKeys[i] == "botOwnerID"){
        botOwnerIDIndex = i;
      } else if(configKeys[i] == "maintenance"){
        maintenanceIndex = i;
      }
    };

    for (var i = 0; i < configKeys.length; i++) {
      if(configKeys[i] == "prefix"){
        botConfig.push(`${configKeys[i]} : \`${config[configKeys[i]]}\``);
      } else if(configKeys[i] == "botOwnerID"){
        botConfig.push(`${configKeys[i]} : \`${config[configKeys[i]]}\``);
      } else if(i > botOwnerIDIndex && i < maintenanceIndex){
        serverConfig.push(`${configKeys[i]} : \`${config[configKeys[i]]}\``);
      } else if(configKeys[i] == "maintenance"){
        botConfig.push(`${configKeys[i]} : \`${config[configKeys[i]]}\``);
      } else if(i > maintenanceIndex && i < configKeys.length){
        embedColorConfig.push(`${configKeys[i]} : \`${config[configKeys[i]]}\``);
      }
    };

    const configEmbed = new Discord.RichEmbed()
      .setColor(config.info_color)
      .setTitle("Configuration")
      .addField("~ Bot ~", botConfig)
      .addField("~ Server ~", serverConfig)
      .addField("~ Embed Color ~", embedColorConfig)
      .setThumbnail(client.user.avatarURL)
      .setFooter(client.user.tag, client.user.avatarURL)
      .setTimestamp();
    return configEmbed;
  }
};
