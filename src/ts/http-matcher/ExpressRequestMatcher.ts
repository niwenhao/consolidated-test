import { Request } from 'express'
import { ValueMatcher, JsonQueryBodyMatch } from './matcher';

export class ExpressRequestUrlMatcher extends ValueMatcher<Request> {
    getValue(input: Request, key: string) {
        return input.url
    }
}

export class ExpressRequestHeadMatcher extends ValueMatcher<Request> {
    getValue(input: Request, name: string) {
        return input.header("name") || ""
    }
}

export class ExpressRequestQueryMatcher extends ValueMatcher<Request> {
    getValue(input:Request, name:string):string {
        return input.params["name"]
    }
}

export class ExpressRequestBodyMatcher extends ValueMatcher<Request> {
    getValue(input:Request, name:string):string {
        return input.body["name"]
    }
}

export class ExpressRequestJsonQueryBodyMatcher extends JsonQueryBodyMatch<Request> {
    getJsonObject(input: Request): object {
        return input.body
    }
}
