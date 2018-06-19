import * as express from 'express'
import { MongoClient } from 'mongodb'
import { Testcase } from './entity/testcase';
import { insertTestcase, findTestcaseByName, findTestcaseName } from './storage-service';

const app = express()

app.get('/v1/testcases/name', (req, res)=> {
    findTestcaseName().then((names) => {
        res.json(names)
    })
})

app.get('/v1/testcases/:name/versions/version', (req, res)=> {
    findTestcaseByName(req.params.name).then((testcase) => {
        res.json(testcase.version)
    })
})

app.post('/v1/testcases', (req, res) => {
    let testcase = new Testcase(req.body)
    insertTestcase(req.body)
})

app.listen(1234, () => {
    console.log("Start .................................")
})