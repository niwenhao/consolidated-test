import * as express from 'express'

const app = express()

//Take the test result
app.get('/v1/results/indexes', (req, res) => {

})

app.put('/v1/testcase', (req, res) => {

})

app.listen(1234, () => {
    console.log("Start .................................")
})