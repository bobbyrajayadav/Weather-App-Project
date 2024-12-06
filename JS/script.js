async function fetchWeatherForecast(city) {
    const apiKey = "f37c71d93e5ba4f3210877670ff4e8ea"; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("City not found or API error");
      }
  
      const data = await response.json();
  
      // Use a map to filter one forecast per day
      const dailyForecast = {};
      data.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString(); // Get the date
        if (!dailyForecast[date]) {
          dailyForecast[date] = item; // Store the first instance of each date
        }
      });
  
      // Convert the filtered forecasts into an array of objects
      return Object.keys(dailyForecast).slice(0, 3).map((date) => {
        const item = dailyForecast[date];
        return {
          date,
          temperature: `${item.main.temp.toFixed(1)}°C`,
          condition: item.weather[0].description,
          humidity: `${item.main.humidity}%`,
          windSpeed: `${item.wind.speed.toFixed(1)} m/s`,
        };
      });
    } catch (error) {
      throw error;
    }
  }
  
  // Handle user interaction and display the forecast
  document.getElementById("generateBtn").addEventListener("click", async () => {
    const city = document.getElementById("cityInput").value.trim();
    const outputDiv = document.getElementById("forecastOutput");
  
    if (city === "") {
      outputDiv.innerHTML = "<p style='color: red;'>Please enter a city name!</p>";
      return;
    }
  
    try {
      const forecastData = await fetchWeatherForecast(city);
  
      let outputHTML = `<h2>3-Day Weather Forecast for ${city}</h2>`;
      outputHTML += `
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Temperature</th>
              <th>Condition</th>
              <th>Humidity</th>
              <th>Wind Speed</th>
            </tr>
          </thead>
          <tbody>
      `;
  
      forecastData.forEach((day) => {
        outputHTML += `
          <tr>
            <td>${day.date}</td>
            <td>${day.temperature}</td>
            <td>${day.condition}</td>
            <td>${day.humidity}</td>
            <td>${day.windSpeed}</td>
          </tr>
        `;
      });
  
      outputHTML += `
          </tbody>
        </table>
      `;
  
      outputDiv.innerHTML = outputHTML;
    } catch (error) {
      outputDiv.innerHTML = `<p style='color: red;'>${error.message}</p>`;
    }
  });
  