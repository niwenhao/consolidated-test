import { AxiosResponse } from 'axios'
import { Matcher, AndMatcher, OrMatcher } from '../http-matcher/matcher';
import { AxiosResponseHeadMatcher, AxiosResponseJsonQueryBodyMatcher, AxiosResponseBodyMatcher } from '../http-matcher/AxiosResponseMatcher';


type ResMatcher = Matcher<AxiosResponse>
export type ConditionFactory = (config: object | null) => ResMatcher

export const ResponseConditionFactory: { [key:string]: ConditionFactory} = {}

ResponseConditionFactory.and = (config:any) => {
    if (config instanceof Map) {
        let matches: ResMatcher[] = []
        config.forEach((value, key) => {
            let f = ResponseConditionFactory["key"]
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

ResponseConditionFactory.or = (config: any) => {
	if (config instanceof Map) {
		let matches = [] as ResMatcher[]
		config.forEach((value, key) => {
			let f = ResponseConditionFactory[key]
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

ResponseConditionFactory.header = (config: any) => {
	if (typeof config.name == "string" && typeof config.pattern == "string") {
		return new AxiosResponseHeadMatcher(config.name, config.pattern)
	} else {
		throw 'Header condition need name and pattern'
	}
}

ResponseConditionFactory.json = (config: any) => {
	if (typeof config.query == "string" && typeof config.pattern == "string") {
		return new AxiosResponseJsonQueryBodyMatcher(config.query, config.pattern)
	} else {
		throw 'Json condition need query and pattern'
	}
}

ResponseConditionFactory.body = (config: any) => {
	if (typeof config.pattern == "string") {
		return new AxiosResponseBodyMatcher("", config.pattern)
	} else {
		throw 'Body condition need marching pattern'
	}
}