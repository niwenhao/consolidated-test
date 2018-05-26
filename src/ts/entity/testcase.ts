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
                if (!ent.key) throw "The label need a key field."
                if (!ent.value) throw "The label need a value field"
                return {key: ent.key, value: ent.value}
            });
        }
        if (config.versions && config.versions.length > 0)
            this.versions = config.versions.map((versionConfig: any) => new TestcaseVersion(versionConfig))
        else
            throw "The testcase need some versions"
    }
}

class TestcaseVersion {
    constructor(config: any) {
    }
}

class RequestMatcher {
    constructor(config: any) {
    }
}

class VariableDefine {
    constructor(config: any) {
    }
}

class Condition {
    constructor(config: any) {
    }
}