const btn = document.getElementById("btn");
const inputVal = document.getElementById("place");
const loadingElement = document.getElementById("loading");
const boxElement = document.querySelector(".box");

btn.addEventListener("click", (event) => {
  event.preventDefault();
  const input = inputVal.value.trim();
  if (input.length <= 0) {
    inputVal.classList.add("invalid");
    console.log("Value is empty");
  } else {
    inputVal.classList.remove("invalid");
    createReport(input);
  }
});

async function getWeatherReport(place) {
  const DESTINATION = place.toLowerCase();
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${DESTINATION}?unitGroup=metric&key=SSPBBG2AMCLT6ZDWU55E3NUAT&contentType=json`,
    {
      method: "GET",
      headers: {},
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return {
    address: data.resolvedAddress,
    description: data.description,
    timezone: data.timezone,
    maxTemp: data.days[0].tempmax,
    minTemp: data.days[0].tempmin,
    condition: data.days[0].conditions,
  };
}

async function createReport(place) {
  loadingElement.style.display = "block";
  boxElement.innerHTML = "";
  boxElement.classList.remove("boxProp");

  try {
    const weatherData = await getWeatherReport(place);
    updateUI(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    boxElement.innerHTML = `<h2>Error: ${error.message}</h2>`;
    boxElement.classList.add("boxProp");
  } finally {
    loadingElement.style.display = "none";
  }
}

function updateUI(data) {
  boxElement.classList.add("boxProp");
  boxElement.innerHTML = `
    <h1>${data.address.toUpperCase()}</h1>
    <h4>${data.description}</h4>
    <h1>Timezone: ${data.timezone}</h1>
    <h1>Max Temp: ${data.maxTemp}°C</h1>
    <h1>Min Temp: ${data.minTemp}°C</h1>
    <h1>Condition: ${data.condition}</h1>
  `;
}

