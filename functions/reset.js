module.exports = {
	// ⚠️⚠️⚠️ Don't change this value!!! ⚠️⚠️⚠️
	name: "reset",
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	async execute(param, target) {
		const { DB, config, defaultConfig, updateActivity } = param;
		const keys = Object.keys(defaultConfig);

		const resetFn = async function(key) {
			let value = defaultConfig[key];
			if (!value) value = "-";
			await DB.config.set(key, value);
			config[key] = value;
			console.log(`> ${key} value set to ${value}.`);
		};
		// Checking whether the defaultConfig contain the target and reset it's value.
		if (keys.includes(target)) {
			await resetFn(target);
			if (target == "maintenance") await updateActivity.execute(param);
			return;
		}
		// If not, reset all config values to default
		for (const key of keys) {
			await resetFn(key);
		}
		await updateActivity.execute(param);
	},
};
