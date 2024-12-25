function searchCountry() {
    const countryName = document.getElementById('countryInput').value.trim();
    if (!countryName) {
        alert('Please enter a country name.');
        return;
    }

    const url = `https://restcountries.com/v3.1/name/${countryName}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const countryGrid = document.getElementById('countryGrid');
            countryGrid.innerHTML = '';

            data.forEach(country => {
                const card = document.createElement('div');
                card.className = 'card card-custom';

                card.innerHTML = `
                    <img src="${country.flags.png}" class="card-img-top" alt="Flag of ${country.name.common}">
                    <div class="card-body">
                        <h5 class="card-title">${country.name.common}</h5>
                        <p class="card-text"><strong>Capital:</strong> ${country.capital || 'N/A'}</p>
                        <p class="card-text"><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                        <p class="card-text"><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
                        <p class="card-text"><strong>Region:</strong> ${country.region || 'N/A'}</p>
                        <p class="card-text"><strong>Currency:</strong> ${Object.values(country.currencies || {}).map(c => c.name).join(', ') || 'N/A'}</p>
                        <p class="card-text"><strong>Languages:</strong> ${Object.values(country.languages || {}).join(', ') || 'N/A'}</p>
                        <p class="card-text"><strong>Calling Code:</strong> +${country.idd.root || ''}${(country.idd.suffixes || []).join(', ') || ''}</p>
                        <button class="btn btn-primary" onclick="showWeather('${country.name.common}', ${country.latlng[0]}, ${country.latlng[1]})">More Details</button>
                    </div>
                `;

                countryGrid.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching country data:', error));
}

function showWeather(countryName, latitude, longitude) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            const weatherDetails = document.getElementById('weatherData');
            weatherDetails.textContent = `Temperature: ${data.current_weather.temperature}°C, Wind Speed: ${data.current_weather.windspeed} km/h`;
            const offCanvas = new bootstrap.Offcanvas(document.getElementById('weatherDetails'));
            offCanvas.show();
        })
        .catch(error => {
            alert('Error fetching weather data: ' + error.message);
        });
}
