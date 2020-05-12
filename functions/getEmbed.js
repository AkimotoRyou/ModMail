module.exports = {
  name: "getEmbed",
  execute(param, color, title, description){
    const embed = new param.Discord.MessageEmbed()
      .setColor(color)
      .setTitle(title)
      .setDescription(description)
      .setFooter(param.client.user.tag, param.client.user.avatarURL())
      .setTimestamp();
    return embed;
  }
};
