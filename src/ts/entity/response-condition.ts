import { AxiosResponse } from 'axios'
import { Matcher, AndMatcher } from '../http-matcher/matcher';


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

ResponseConditionFactory.url = (config: any) => {
	if (typeof config.pattern == "string") {
		return new ExpressRequestUrlMatcher("", config.pattern)
	} else {
		throw "Url condition need a pattern"
	}
}

RequestConditonFactories.query = (config: any) => {
	if (typeof config.name == "string" && typeof config.pattern == "string") {
		return new ExpressRequestQueryMatcher(config.name, config.pattern)
	} else {
		throw 'Query condition need name and pattern'
	}
}

RequestConditonFactories.header = (config: any) => {
	if (typeof config.name == "string" && typeof config.pattern == "string") {
		return new ExpressRequestHeadMatcher(config.name, config.pattern)
	} else {
		throw 'Header condition need name and pattern'
	}
}

RequestConditonFactories.form = (config: any) => {
	if (typeof config.name == "string" && typeof config.pattern == "string") {
		return new ExpressRequestBodyMatcher(config.name, config.pattern)
	} else {
		throw 'From condition need name and pattern'
	}
}

RequestConditonFactories.json = (config: any) => {
	if (typeof config.query == "string" && typeof config.pattern == "string") {
		return new ExpressRequestJsonQueryBodyMatcher(config.query, config.pattern)
	} else {
		throw 'Json condition need query and pattern'
	}
}