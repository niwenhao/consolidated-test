import { AxiosResponse as Response } from 'axios'
import { ValueMatcher, JsonQueryBodyMatch } from './matcher';

export class AxiosResponseStatusMatcher extends ValueMatcher<Response> {
    getValue(input: Response, name: string) {
        return input.status.toString()
    }
}

export class AxiosResponseHeadMatcher extends ValueMatcher<Response> {
    getValue(input: Response, name: string) {
        return input.headers[name] || ""
    }
}

export class AxiosResponseBodyMatcher extends ValueMatcher<Response> {
    getValue(input:Response, name:string):string {
        return input.data.toString()
    }
}

export class AxiosResponseJsonQueryBodyMatcher extends JsonQueryBodyMatch<Response> {
    getJsonObject(input: Response): object {
        return input.data
    }
}

