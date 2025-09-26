const apiKey = "3986e99e72ec17fd01737c89dda62900"; // tu API Key

const loader = document.getElementById('loader');
const weatherCard = document.getElementById('weather-card');
const errorDiv = document.getElementById('error');
const citySearchDiv = document.getElementById('city-search');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');

function setBackground(weather) {
  document.body.className = ''; // Reset
  if (weather.includes('rain')) document.body.classList.add('rainy');
  else if (weather.includes('cloud')) document.body.classList.add('cloudy');
  else if (weather.includes('snow')) document.body.classList.add('snowy');
  else document.body.classList.add('sunny');
}

function setWeatherData(data) {
  document.getElementById('city').textContent = data.name;
  document.getElementById('temp').textContent = Math.round(data.main.temp);
  document.getElementById('feels').textContent = Math.round(data.main.feels_like);
  document.getElementById('humidity').textContent = data.main.humidity;
  document.getElementById('wind').textContent = data.wind.speed;
  document.getElementById('description').textContent = data.weather[0].description;
  
  // Iconos simples con emojis
  const weatherMain = data.weather[0].main.toLowerCase();
  const iconDiv = document.getElementById('icon');
  if (weatherMain.includes('rain')) iconDiv.textContent = '🌧️';
  else if (weatherMain.includes('cloud')) iconDiv.textContent = '☁️';
  else if (weatherMain.includes('snow')) iconDiv.textContent = '❄️';
  else iconDiv.textContent = '☀️';
  
  setBackground(weatherMain);
  loader.classList.add('hidden');
  weatherCard.classList.remove('hidden');
}

async function getWeather(lat, lon) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`);
    if (!res.ok) throw new Error('Error al obtener datos del clima');
    const data = await res.json();
    setWeatherData(data);
  } catch (err) {
    showError(err.message);
  }
}

async function getWeatherByCity(city) {
  loader.classList.remove('hidden');
  weatherCard.classList.add('hidden');
  errorDiv.classList.add('hidden');
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&appid=${apiKey}`);
    if (!res.ok) throw new Error('Ciudad no encontrada');
    const data = await res.json();
    setWeatherData(data);
  } catch (err) {
    showError(err.message);
  }
}

function showError(msg) {
  loader.classList.add('hidden');
  weatherCard.classList.add('hidden');
  errorDiv.textContent = msg;
  errorDiv.classList.remove('hidden');
  citySearchDiv.classList.remove('hidden');
}

// Geolocalización
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      getWeather(latitude, longitude);
    },
    err => {
      showError('Permiso de geolocalización denegado. Ingresa una ciudad.');
    }
  );
} else {
  showError('Geolocalización no soportada');
}

// Buscar ciudad manualmente
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) getWeatherByCity(city);
});

