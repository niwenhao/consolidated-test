import { AxiosResponse } from 'axios'
import { Matcher } from '../http-matcher/matcher';


type ResMatcher = Matcher<AxiosResponse>
export type ConditionFactory = (config: object | null) => ResMatcher

export const ResponseConditionFactory: { [key:string]: ConditionFactory} = {}

ResponseConditionFactory.and = (config:any) => {
    if (config instanceof Map) {
        let matches: ResMatcher[] = []

    }
}