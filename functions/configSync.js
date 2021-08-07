module.exports = {
	name: "configSync",
	async execute(param) {
		console.log(`~~ ${this.name.toUpperCase()} ~~`);

		const defConfig = param.defConfig;
		const config = param.config;
		const db = param.db;
		const configPrefix = param.dbPrefix.config;

		const configKeys = Object.keys(config);
		const dbKeys = await db.list(configPrefix);
		async function forLoop() {
			for (let i = 0; i < configKeys .length; i++) {
				const dbKey = configPrefix + configKeys[i];
				if(!dbKeys.includes(dbKey)) {
					console.log(`> Resetting ${dbKey} value to ${defConfig[configKeys[i]]}.`);
					await db.set(dbKey, defConfig[configKeys[i]]);
				}
				await db.get(dbKey).then(value => {
					console.log(`> Syncing ${configKeys[i]}: ${value}`);
					config[configKeys[i]] = value || "empty";
				});
			}
		}
		forLoop().then(async () => {
			param.locale = param.client.locale.get(config.language);
			await param.updateActivity.execute(param);
			console.log(">> Synced <<");
		});
	},
};
