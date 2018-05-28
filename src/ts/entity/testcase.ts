/**
 * This file description entities for scritch a testcase
 * It will store in a mongo collection.
 */
class Testcase {
	name: string
	labels: Array<{key: string, value: string}> = []
	versions: Array<TestcaseVersion>

	constructor(config: any) {
		if (!config.name) {
			throw "The testcase need a name field"
		}
		this.name = config.name
		if (config.labels) {
			this.labels = config.labels.map((ent: any) => {
				if (!ent.key)
					throw "The label need a key field."
				if (!ent.value)
					throw "The label need a value field"
				return {
					key : ent.key,
					value : ent.value
				}
			});
		}
		if (config.versions && config.versions.length > 0)
			this.versions = config.versions.map((versionConfig: any) => new TestcaseVersion(versionConfig))
		else
			throw "The testcase need some versions"
	}
}

class TestcaseVersion {
	version: number
	services: Array<Service>
	constructor(config: any) {
		if (config.version && typeof config.version == "number") {
			this.version = config.version
		} else {
			throw "The testcase need a numeric version number."
		}
		if (config.services && config.services.length > 0) {
			this.services = config.services.map((config: any) => new Service(config))
		} else {
			throw "At least one service should be defined."
		}
	}
}

class Service {
	name: string
	constructor(config: any) {
		if (config.name) {
			this.name = config.name
		} else {
			throw "The service name is needed."
		}
	}
}

class RequestMatcher {
	constructor(config: any) {}
}

class VariableDefine {
	constructor(config: any) {}
}

class Condition {
	constructor(config: any) {}
}