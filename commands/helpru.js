module.exports = {
	name: 'helpru',
  aliases: ['помощь'],
  level: 'User',
  guildOnly: false,
	args: false,
  usage: false,
	description: 'Показать инструкцию о том, как использовать бот.',
	note: false,
	async execute(param, message, args){
    const config = param.config;
    const prefix = config.prefix;
    const getEmbed = param.getEmbed;

		const helpEmbed = getEmbed.execute(param, config.info_color, "инструкция", `В прямом сообщении используйте \`${config.prefix}new Ваше название темы здесь\`, чтобы создать новую тему (**Thread Created!** Отображается). Вам не нужно использовать какую-либо команду после создания вашего потока. Тогда опишите свою проблему.`);

    return message.channel.send(helpEmbed);

  }
};
