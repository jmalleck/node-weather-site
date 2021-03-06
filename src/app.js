const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express conig
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory
app.use(express.static(publicDirectoryPath));

// Routes
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Joel Malleck'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Joel Malleck',
        about: 'This site was created by Joel Malleck. It uses data from mapbox.com and weatherstack.com!'
    });
});


app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Joel Malleck',
        help: 'Type a location in the search box to get the weather!'
    });
});

app.get('/weather', (req, res) => {
    const address = req.query.address;

    if (!address) {
        return res.send({
            error: 'You must provide an address!'
         });
    }

    // geocode/forecast
    geocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            });
        } 
    
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            }
    
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            });
          })
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help',
        name: 'Joel Malleck',
        message: 'Help article not found'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Joel Malleck',
        message: 'Page not found'
    })
});

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});