import { Matcher, AndMatcher, OrMatcher } from '../http-matcher/matcher';
import { Request } from 'express';
import { AxiosResponse } from 'axios'
import { RequestConditonFactories } from './request-condition'
import BodyConverter from './body-generator'
import { ResponseConditionFactory } from './response-condition';
/**
 * This file description entities for scritch a testcase
 * It will be stored in a mongo collection.
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
	response: Response
	constructor(config: any) {
		if (config.name) {
			this.name = config.name
			if (config.matcher) {
				this.matcher = new RequestMatcher(config.matcher)
			} else {
				throw `The service ${this.name} need a matcher`
			}
			if (config.relay) {
				this.response = new RelayResponse(config.relay)
			} else if (config.response) {
				this.response = new ContentResponse(config.response)
			} else {
				throw "The element after matcher need be a relay or a response"
			}
		} else {
			throw "The service name is needed."
		}
	}
}

interface Response {

}

type Header = { name: string, value: string }
class ContentResponse implements Response {
	status: number
	headers: Header[]
	contentType: string
	body: Buffer
	constructor(config: any) {
		this.status = config.status ? config.status : 200
		this.headers = config.headers ? config.headers : []
		if (!config.contentType) {
			throw "A response need a content-type."
		} else {
			this.contentType = config.contentType
		}
		if (!config.body) {
			throw "A response need body."
		} else {
			this.body = BodyConverter(this.contentType, config.body)
		}
	}
}

class RelayResponse implements Response {
	matcher: Matcher<AxiosResponse>
	constructor(config: any) {
		if (config instanceof Map) {
			let entList: {key:string, value: any}[] = []
			let iter = config.forEach((value, key) => {
				entList.push({key: key, value: value})
			})

			if (entList.length != 1) {
				throw "The response matcher has only one sub condition"
			}

			let { key, value } = entList[0]

			let factory = ResponseConditionFactory[key]
			if (factory) {
				this.matcher = factory(value)
			} else {
				throw `Cann't found conditon for ${key}`
			}
		} else {
			throw "Conditon config need be a map"
		}
	}
}

class RequestMatcher {
	matcher: Matcher<Request>
	constructor(config: any) {
		if (config instanceof Map) {
			let entList: { key:string, value: any}[] = []
			let iter = config.forEach((value, key) => {
				entList.push({key: key, value: value})
			})
			if (entList.length != 1) {
				throw "The request matcher has only one sub condition"
			}

			let { key, value } = entList[0]

			let factory = RequestConditonFactories[key]
			if (factory) {
				this.matcher = factory(value)
			} else {
				throw `Cann't found conditon for ${key}`
			}
		} else {
			throw "Conditon config need be a map"
		}
	}
}

