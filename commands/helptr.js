module.exports = {
	name: 'helptr',
  aliases: ['yardım'],
  level: 'User',
  guildOnly: false,
	args: false,
  usage: false,
	description: 'Bot kullanımı hakkında talimat göster.',
	note: false,
	async execute(param, message, args){
    const config = param.config;
    const prefix = config.prefix;
    const getEmbed = param.getEmbed;

		const helpEmbed = getEmbed.execute(param, config.info_color, "Talimat", `Doğrudan Mesaj'da, yeni bir bilet oluşturmak için \`${config.prefix}new konuyu buraya yazın\` yazın ve gönderin (**Thread Created!** görüntülenir). Konuyu oluşturduktan sonra herhangi bir komut kullanmanıza gerek yoktur. Daha sonra sorununuzu açıklayın.`);

    return message.channel.send(helpEmbed);

  }
};
