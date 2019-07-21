const yelp = require('yelp-fusion');
const bodyParser = require('body-parser');
const express = require('express');
const port = 3000;

const app = express();

//Setup static files
app.use(express.static((__dirname + "/public")));

//Setup parser
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

const apiKey = 'YOUR API KEY HERE';

//Probably dont keep defaultSearchRequest as a global
const defaultSearchRequest = {
    term: 'Luggage Storage',
    location: 'Cincinnati, OH'
};

const client = yelp.client(apiKey);

app.get('/', (req, res) => {
    res.redirect('index.html');
});

//Getting the submit action from the html
app.post('/send-location', (req, res) => {
    var place = req.body['location-name'];
    defaultSearchRequest['location'] = place;
    console.log(defaultSearchRequest);
    
    queryRequest();

    res.redirect('index.html');
});

app.listen(port, () => console.log('Server listening on port: ' + port));

//This searches the yelp-API. Right now the defaultSearchRequest is the parameter being passed
function queryRequest(){
    client.search(defaultSearchRequest).then(res => {
        const firstResult = res.jsonBody.businesses[0];
        const prettyJson = JSON.stringify(firstResult, null, 4);
        console.log(prettyJson);
    }).catch(e => {
        console.log(e);
    });
}