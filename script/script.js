let apiKey = "ac528d9a31cb6c0dffe8feccd1497739";
let apiRequest =
  "https://api.openweathermap.org/data/2.5/weather?q=mycity&appid=mykey";
let inpSearch = document.querySelector(".inp-search");
let searchBtn = document.querySelector(".btn-search");
let errorCity = document.querySelector(".error");
let widget = document.querySelector(".widget");
let spinner = document.querySelector(".spinner");

let getData = () => {
  let inpValue = inpSearch.value.toLowerCase();
  let url = apiRequest.replace("mycity", inpValue).replace("mykey", apiKey);
  if (inpValue.length === 0) {
    errorCity.textContent = "Enter your city";
  } else {
    spinner.removeAttribute("hidden");
    weatherFetch();
  }

  function weatherFetch() {
    fetch(url)
      .then((resolve) => {
        return resolve.json();
      })
      .catch((err) => {
        spinner.setAttribute("hidden", "");
        errorCity.textContent = err;
      })
      .then((data) => {
        if (data.cod === "404") {
          spinner.setAttribute("hidden", "");
          errorCity.textContent = "City not found";
        } else {
          spinner.setAttribute("hidden", "");
          errorCity.textContent = "";

          let country = data.sys.country;
          let tempCelsius = Math.round(data.main.temp - 273) + "&deg;";
          let sign = tempCelsius > 0 ? "+" : "";
          let description =
            data.weather[0].description.charAt(0).toUpperCase() +
            data.weather[0].description.slice(1);
          let imgURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
          let wind = data.wind.speed;

          widget.insertAdjacentHTML(
            "afterbegin",
            `
          <div class="card">
              <div class="place">
              <h2>${data.name},</h2>
              <h3>&nbsp; ${country}</h3></div>
              <h2 class="tempcelsius">${sign}${tempCelsius}</h2>
              <hr>
              <img src=${imgURL} alt="">
              <p class="description">${description}</p>
              <p class="wind">Wind: ${wind} m/s</p>
              <button class="btn-delete">Hide</button>
              
          </div>
          `
          );

          widget.addEventListener("click", (event) => {
            if (event.target.classList.contains("btn-delete")) {
              let parent = event.target.parentNode;
              parent.remove();
            }
          });
          inpSearch.value = "";
        }
      });
  }
};
searchBtn.onclick = getData;

inpSearch.addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    getData();
  }
});
