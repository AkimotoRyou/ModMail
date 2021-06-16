module.exports = {
	name: "reset",
	async execute(param) {
		const defConfig = param.defConfig;
		const db = param.db;
		const configPrefix = param.dbPrefix.config;
		const configKeys = Object.keys(param.config);

		configKeys.forEach(async aKey => {
			const dbKey = configPrefix + aKey;
			await db.set(dbKey, defConfig[aKey]);
		});
		return param.configSync.execute(param);
	}
};
