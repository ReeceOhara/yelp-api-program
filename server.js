const yelp = require('yelp-fusion');
const bodyParser = require('body-parser');
const express = require('express');
const port = 3000;

const app = express();

//Setup static files
app.use(express.static((__dirname + "/public")));

app.set('views', __dirname + '/public');

//Setting up view engine
app.set('view engine', 'pug');

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
app.post('/send-location', async (req, res) => {
    try{
        var place = req.body['location-name'];
        defaultSearchRequest['location'] = place;
        
        var business = await queryRequest();
        console.log(business);

        res.render('storeView.pug', {businessName: business.name});
    } catch (e) {
        console.log(e);
    }
});

app.listen(port, () => console.log('Server listening on port: ' + port));

//This searches the yelp-API. Right now the defaultSearchRequest is the parameter being passed
function queryRequest(){
        // const firstResult = res.jsonBody.businesses[0];
        // const prettyJson = JSON.stringify(firstResult, null, 4);
        return new Promise((resolve) => {
            client.search(defaultSearchRequest).then(res => {
                resolve({
                    name: res.jsonBody.businesses[0].name,
                    img: res.jsonBody.businesses[0].image_url,
                    rating: res.jsonBody.businesses[0].rating
                });
            }).catch(e => {
                console.log(e);
            });
        });
}