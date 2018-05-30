import { Request, Response } from "express"
export interface Matcher<I> {
    matches(org: I): boolean
}

export class AndMatcher<I> implements Matcher<I> {
    private matchers: Matcher<I>[]

    constructor(matchers: Matcher<I>[]) {
        this.matchers = matchers
    }

    matches = (org: I) => this.matchers.reduce<boolean>((result, matcher) => result && matcher.matches(org), true)
}

export class OrMatcher<I> implements Matcher<I> {
    private matchers: Matcher<I>[]

    constructor(matchers: Matcher<I>[]) {
        this.matchers = matchers
    }

    matches = (org: I) => this.matchers.reduce<boolean>((result, matcher) => result || matcher.matches(org), false)
}

export class NotMatcher<I> implements Matcher<I> {
    private matchers: Matcher<I>[]

    constructor(matchers: Matcher<I>[]) {
        this.matchers = matchers
    }

    matches = (org: I) => this.matchers.reduce<boolean>((result, matcher) => result || matcher.matches(org), false)
}

export class HeaderMatcher<I> implements Matcher<I> {

}

