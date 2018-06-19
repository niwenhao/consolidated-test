import { MongoClient, Db, Collection } from 'mongodb'

const url = 'mongodb://testcase-db'

var db: Db
var testcase: Collection

MongoClient.connect(url).then((client) => {
    db = client.db("ConsolidatedTest")
    testcase = db.collection("Testcase")
})

export const findTestcaseName = () => new Promise<string[]>((resolve, reject) => {
    let names = [] as string[]
    testcase.find({}).forEach(
        (v) => names.push(v.name),
        () => resolve(names)
    )
})

export const findTestcaseByName = (name: string) => testcase.findOne({ name: name })

export const insertTestcase = (config: any) => new Promise((resolve, reject) => {
    testcase.findOneAndDelete({ name: config.name }).then((value) => {
        testcase.insertOne(config).then((value) => {
            resolve()
        }).catch((err) => reject(err))
    }).catch((err) => reject(err))
})

