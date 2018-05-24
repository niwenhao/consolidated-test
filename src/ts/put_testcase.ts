import express from 'express'
import * as mongo from 'mongodb'


export default function(req: express.Request, res: express.Response) {
    mongo.connect("mongodb://mongodb:27017/mydb").then((db) => {
        db.collection("testcase", (err, collection) => {
            let testcaseName = req.body.meta.name
            collection.findOneAndDelete({"meta.name": testcaseName}, (err, result) => {
                collection.insertOne(req.body).then((result) => {
                    res.json({result: "ok"})
                })
            })
        })
    })
    mongo.connect("mongodb://mongodb:27017/mydb", (err, db) => {
        let testcaseCollection = db.collection("testcase")
        testcaseCollection.insertOne(req.body, (err, result) => {

        })
    })
}