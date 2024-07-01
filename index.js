const express = require('express');
const request = require('request');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;
const locationApiKey = process.env.LOCATION_API_KEY
const weatherApiKey = process.env.WEATHER_API_KEY

app.get('/api/hello', (req, res) => {
    const visitorName = req.query.visitor_name || 'Anonymous';
    const clientIp = req.ip;

    // Use request library to call FreeGeoIP API
    request(`https://api.ipgeolocation.io/ipgeo?apiKey=${locationApiKey}`,(error, response, body) => {
        
        if (error) {
            console.error(error);
            res.status(500).send('Error retrieving location');
        } else {
            const data = JSON.parse(body);
            
            const location = data.city || 'Unknown';
            // Replace with a weather API call for real-time temperature

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`;
            request(weatherUrl, (weatherError, weatherResponse, weatherBody) => {
                console.log(weatherBody)
                if (weatherError) {
                    console.error(weatherError);
                    res.status(500).send('Error retrieving weather data');
                }
                else {
                    const weatherData = JSON.parse(weatherBody);
                    const temperature = Math.round((weatherData.main.temp - 273.15) * 10) / 10; // Convert Kelvin to Celcius

                    res.json({
                        client_ip: clientIp,
                        location: location,
                        greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celcius in ${location}`
                    });
                }
            })
         
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
