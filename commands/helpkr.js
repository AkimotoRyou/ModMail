module.exports = {
	name: 'helpkr',
  aliases: ['도움'],
  level: 'User',
  guildOnly: false,
	args: false,
  usage: false,
	description: '봇 사용 방법에 대한 지시 사항 표시.',
	note: false,
	async execute(param, message, args){
    const config = param.config;
    const prefix = config.prefix;
    const getEmbed = param.getEmbed;

		const helpEmbed = getEmbed.execute(param, config.info_color, "훈령", `직접 메시지에서\`${config.prefix}new 스레드 제목은 여기\`를 사용하여 새 스레드를 만듭니다 (**Thread Created!**가 표시됨). 스레드가 작성된 후 명령을 사용할 필요가 없습니다. 그런 다음 문제를 설명하십시오.`);

    return message.channel.send(helpEmbed);

  }
};
