module.exports = {
	name: "reset",
	async execute(param) {
		const defConfig = param.defConfig;
		const ConfigDB = param.ConfigDB;
		const configKeys = Object.keys(param.config);

		configKeys.forEach(async aKey => {
			await ConfigDB.set(aKey, defConfig[aKey]);
		});
		return param.configSync.execute(param);
	}
};
