import { Matcher, AndMatcher, OrMatcher } from '../http-matcher/matcher';
import { Request } from 'express';
import { ADDRCONFIG } from 'dns';
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
	matcher: RequestMatcher
	constructor(config: any) {
		if (config.name) {
			this.name = config.name
			if (config.matcher) {
				this.matcher = new RequestMatcher(config.matcher)
			} else {
				throw `The service ${this.name} need a matcher`
			}
		} else {
			throw "The service name is needed."
		}
	}
}

class RequestMatcher {
	constructor(config: any) {}
}

type ReqMatcher = Matcher<Request>
type ConditionFactory = (config: object | null) => ReqMatcher

let RequestConditonFactories: {[key:string]: ConditionFactory} = {}

RequestConditonFactories.and = (config:any) => {
	if (config instanceof Map) {
		let matches : ReqMatcher[] = []
		config.forEach((value, key) => {
			let f = RequestConditonFactories[key]
			if (f) {
				matches.push(f(value))
			} else {
				throw `Condition ${key} was not found`
			}
		})
		return new AndMatcher(matches)
	} else {
		throw "And condition need some subconditions"
	}
}

RequestConditonFactories.or = (config: any) => {
	if (config instanceof Map) {
		let matches = [] as ReqMatcher[]
		config.forEach((value, key) => {
			let f = RequestConditonFactories[key]
			if (f) {
				matches.push(f(value))
			} else {
				throw `Condition ${key} was not found`
			}

		})
		return new OrMatcher(matches)
	} else {
		throw "Or condition need some subconditions"
	}
}