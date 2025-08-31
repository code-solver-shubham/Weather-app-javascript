// ===== Selectors =====
const weatherSearchForm = document.querySelector(".weather_search");
const cityInput = document.querySelector(".city_name");

// Display elements
const weatherCity = document.querySelector(".weather_city");
const weatherDateTime = document.querySelector(".weather_date_time");
const weatherForecast = document.querySelector(".weather_forecast");
const weatherIcon = document.querySelector(".weather_icon");
const weatherTemperature = document.querySelector(".weather_temperature");
const weatherMin = document.querySelector(".weather_min");
const weatherMax = document.querySelector(".weather_max");
const weatherFeelsLike = document.querySelector(".weather_feelsLike");
const weatherHumidity = document.querySelector(".weather_humidity");
const weatherWind = document.querySelector(".weather_wind");
const weatherPressure = document.querySelector(".weather_pressure");

// ===== Config =====
const apiKey = "d09fe17f8c31f44dcb364c45de3c0e7d";
let currentCity = "Delhi,IN"; // default city (use "City,CountryCode" for accuracy)

// ===== Helpers =====
const getCountryName = (code) => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code; // fallback if DisplayNames not supported
  }
};

const getDateTime = (dt) => {
let curDate = new Date (dt * 1000)
const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
const formatter = new Intl.DateTimeFormat("en-US", options);
return formatter.format(curDate);
  
};

const renderWeather = (data) => {
  const { main, name, weather, wind, sys, dt, timezone } = data;
  
  weatherCity.textContent = `${name}, ${getCountryName(sys.country)}`;
  weatherDateTime.innerHTML = getDateTime(dt)
  weatherForecast.textContent = weather[0].main;
  
  weatherIcon.innerHTML = `
    <img
      src="https://openweathermap.org/img/wn/${weather[0].icon}@4x.png"
      alt="${weather[0].description}"
      width="100" height="100"
      loading="lazy"
    />
  `;
  
  weatherTemperature.innerHTML = `${Math.round(main.temp)}&#176;`;
  weatherMin.innerHTML = `Min: ${Math.round(main.temp_min)}&#176;`;
  weatherMax.innerHTML = `Max: ${Math.round(main.temp_max)}&#176;`;
  weatherFeelsLike.innerHTML = `${Math.round(main.feels_like)}&#176;`;
  weatherHumidity.textContent = `${main.humidity}%`;
  weatherWind.textContent = `${Math.round(wind.speed)} m/s`;
  weatherPressure.textContent = `${main.pressure} hPa`;
};

const showError = (msg) => {
  weatherCity.textContent = msg;
  weatherDateTime.textContent = "";
  weatherForecast.textContent = "";
  weatherIcon.innerHTML = "";
  weatherTemperature.innerHTML = "";
  weatherMin.innerHTML = "";
  weatherMax.innerHTML = "";
  weatherFeelsLike.innerHTML = "";
  weatherHumidity.textContent = "";
  weatherWind.textContent = "";
  weatherPressure.textContent = "";
};

// ===== API =====
const getWeatherData = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    setBackground(data.weather[0].main);
    
    if (res.ok) {
      renderWeather(data);
      currentCity = `${data.name},${data.sys.country}`;
      console.log("API Response:", data); // Inspect structure in DevTools Console
    } else {
      showError(data?.message ? data.message : "City not found");
      console.warn("API Error:", data);
    }
  } catch (err) {
    showError("Network error. Check your connection.");
    console.error(err);
  }
};

// ===== Events =====
weatherSearchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = cityInput.value.trim();
  if (!q) return;
  getWeatherData(q);
  cityInput.value = "";
});
// Function to change background dynamically based on weather
function setBackground(weather) {
  const body = document.body;
  if (weather.includes("Cloud")) {
    body.style.background = "linear-gradient(135deg, #667db6, #0082c8, #0082c8, #667db6)";
  } else if (weather.includes("Clear")) {
    body.style.background = "linear-gradient(135deg, #2980B9, #6DD5FA, #FFFFFF)";
  } else if (weather.includes("Rain")) {
    body.style.background = "linear-gradient(135deg, #000428, #004e92)";
  } else if (weather.includes("Snow")) {
    body.style.background = "linear-gradient(135deg, #83a4d4, #b6fbff)";
  } else {
    body.style.background = "linear-gradient(135deg, #1e3c72, #2a5298, #0f2027)";
  }
}

// Example usage after API fetch
// setBackground(weather[0].main);



// Load default city on page load
window.addEventListener("load", () => getWeatherData(currentCity));
