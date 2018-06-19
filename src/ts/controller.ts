import * as express from 'express'
import { MongoClient } from 'mongodb'
import { Testcase } from './entity/testcase';

const app = express()

const testcase_ep = "/v1/testcase"

//Take the test result
app.get('/v1/results/indexes', (req, res) => {

})

app.post(testcase_ep, (req, res) => {
    let testcase = new Testcase(req.body)
})

app.listen(1234, () => {
    console.log("Start .................................")
})