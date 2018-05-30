import { Request, Response } from "express"
import * as jsonQuery from 'json-query'

export interface Matcher<I> {
    matches(input: I): boolean
}

export class AndMatcher<I> implements Matcher<I> {
    private matchers: Matcher<I>[]

    constructor(matchers: Matcher<I>[]) {
        this.matchers = matchers
    }

    matches = (input: I) => this.matchers.reduce<boolean>((result, matcher) => result && matcher.matches(input), true)
}

export class OrMatcher<I> implements Matcher<I> {
    private matchers: Matcher<I>[]

    constructor(matchers: Matcher<I>[]) {
        this.matchers = matchers
    }

    matches = (input: I) => this.matchers.reduce<boolean>((result, matcher) => result || matcher.matches(input), false)
}

export class NotMatcher<I> implements Matcher<I> {
    private matchers: Matcher<I>[]

    constructor(matchers: Matcher<I>[]) {
        this.matchers = matchers
    }

    matches = (input: I) => this.matchers.reduce<boolean>((result, matcher) => result || matcher.matches(input), false)
}

export abstract class ValueMatcher<I> implements Matcher<I> {
    abstract getValue(input: I, key:string): string

    name: string
    pattern: RegExp

    constructor(name: string, regexp: string) {
        this.name = name
        this.pattern = new RegExp(regexp)
    }

    matches(input: I): boolean {
        let headValue = this.getValue(input, this.name)
        return this.pattern.exec(headValue) != null
    }
}

export abstract class JsonQueryBodyMatch<I> extends ValueMatcher<I> {
    abstract getJsonObject(input: I): object

    constructor(query:string, regexp: string) {
        super(query, regexp)
    }

    getValue(input: I, name: string) {
        return jsonQuery(name, { data: this.getJsonObject(input) }).toString()
    }
}