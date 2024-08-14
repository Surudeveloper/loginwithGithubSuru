let express = require('express');
let cors = require('cors');
let request = require('request');
let superagent = require('superagent');

var dotenv = require('dotenv');
dotenv.config(); //this must be above//

let clientID = process.env.clientID
let clientSecret = process.env.clientSecret
let port = process.env.PORT

let app = express();

app.use(cors())

app.get('/', (req, res) => {
    res.send(`<a href="https://github.com/login/oauth/authorize?client_id=${clientID}">Login With Github</a>`)
})

app.get('/profile', (req, res) => {
    const code = req.query.code
    if (!code) {
        res.send({ success: false, errMsg: 'Error While Login' })
    }
    superagent
        .post("https://github.com/login/oauth/access_token")
        .send({
            client_id: clientID,
            client_secret: clientSecret,
            code: code
        })
        .set('Accept', 'application/json')
        .end((err, result) => {
            if (err) throw err;
            const accessToken = result.body.access_token
            const option = {
                url: 'https://api.github.com/user',
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'User-Agent': 'mycode'       //anything just to tell u are human
                }
            }
            request(option, (err, result) => {
                if (err) {
                    console.log(err.response);
                } else {
                    res.send(JSON.parse(result.body))
                }
            })
        })
})

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`app is listening to port ${port}`);
})
