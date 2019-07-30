const yelp = require('yelp-fusion');
const bodyParser = require('body-parser');
const express = require('express');
const port = process.env.PORT || 3000;

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

//Backup search in case the user doesnt enter anything
const defaultSearchRequest = {
    term: 'Luggage Storage',
    location: 'Los Angeles, CA',
    limit: '5',
    sort_by: 'best_match'
};

const client = yelp.client(apiKey);

app.get('/', (req, res) => {
    res.render('index.pug');
});

//Getting the submit action from the html
app.post('/send-location', async (req, res) => {
    try{
        var place = req.body['location-name'];
        defaultSearchRequest['location'] = place;
        
        var business = await queryRequest();
        console.log(business);

        // for(let i = 0; i< business.length-1; i++){
        //     for(let k = i+1; k < business.length; k++){
        //         if(business[i].rating < business[k].rating){
        //             let temp = business[i];
        //             business[i] = business[k];
        //             business[k] = temp;
        //         }
        //     }
        // }

        res.render('storesListView.pug', {location: defaultSearchRequest['location'], businessList: business});
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
                    businessList: res.jsonBody.businesses
                    // name: res.jsonBody.businesses[0].name,
                    // img: res.jsonBody.businesses[0].image_url,
                    // rating: res.jsonBody.businesses[0].rating,
                    // url: res.jsonBody.businesses[0].url
                });
            }).catch(e => {
                console.log(e);
            });
        });
}