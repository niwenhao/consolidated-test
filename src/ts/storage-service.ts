import { MongoClient, Db } from 'mongodb'

const url = 'mongodb://testcase-db'

var db: Db

MongoClient.connect(url).then((client) => {
    db = client.db("ConsolidatedTest")
})

export function findTestcaseByName(name: string):Promise<any> {
    let collection = db.collection("Testcase")
    return collection.findOne({ name: name })
}

