module.exports = {
	name: "configSync",
	async execute(param) {
		const config = param.config;
		const ConfigDB = param.ConfigDB;

		console.log("[Syncing Configuration]");
		const configKeys = Object.keys(config);
		const syncPromise = new Promise(resolve => {
			try {
				async function forLoop() {
					for (let i = 0; i < configKeys .length; i++) {
						const getConfig = await ConfigDB.findOne({ where: { name: configKeys[i] } });
						if(getConfig) {
							console.log(`Syncing ${getConfig.name}...`)
							config[configKeys[i]] = getConfig.input || "empty";
						} else {
							// resolved too cause im still confused with reject()
							console.log("Calling reset function...")
							await param.reset.execute(param);
							break;
						}
					}
					resolve();
				}
				forLoop();
			} catch (error) {
				return console.log(error);
			}
		});
		syncPromise.then(async () => {
			console.log("[Synced]");
		});
	}
};
