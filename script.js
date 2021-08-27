const errorLabel = document.querySelector("label[for='error-msg']")
const latInp = document.querySelector("#latitude")
const lonInp = document.querySelector("#longitude")
const airQuality = document.querySelector(".air-quality")
const airQualityStat = document.querySelector(".air-quality-status")
const srchBtn = document.querySelector(".search-btn")
const componentsEle = document.querySelectorAll(".component-val")
const healthAdvice = document.querySelector(".health-advice .component-names")

const appId = "96a16da9157f81eabc3304d5b26669a7"
const link = "https://api.openweathermap.org/data/2.5/air_pollution"	// API end point

const getUserLocation = () => {
	// Get user Location
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(onPositionGathered, onPositionGatherError)
	} else {
		onPositionGatherError({ message: "Can't Access your location. Please enter your co-ordinates" })
	}
}

const onPositionGathered = (pos) => {
	let lat = pos.coords.latitude.toFixed(4), lon = pos.coords.longitude.toFixed(4)

	// Set values of Input for user to know
	latInp.value = lat
	lonInp.value = lon

	// Get Air data from weather API
	getAirQuality(lat, lon)
}

const getAirQuality = async (lat, lon) => {
	// Get data from api
	const rawData = await fetch(`${link}?lat=${lat}&lon=${lon}&appid=${appId}`).catch(err => {
		onPositionGatherError({ message: "Something went wrong. Check your internet conection." })
		console.log(err)
	})
	const airData = await rawData.json()
	console.log(airData);
	setValuesOfAir(airData)
	setComponentsOfAir(airData)
}

const setValuesOfAir = airData => {

	let aqi = 0;
	
	if(airData.hasOwnProperty('list'))
	aqi = airData.list[0].main.aqi
	
	let airStat = "", color = ""
	let recommendation = "";

	// Set Air Quality Index
	airQuality.innerText = aqi

	// Set status of air quality

	switch (aqi) {
		case 1:
			airStat = "Good"
			color = "rgb(19, 201, 28)"
			recommendation = "Air quality is considered satisfactory, and air pollution poses little or no risk."
			break
		case 2:
			airStat = "Fair"
			color = "rgb(15, 134, 25)"
			recommendation = "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution. Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion."
			break
		case 3:
			airStat = "Moderate"
			color = "rgb(201, 204, 13)"
			recommendation = "Members of sensitive groups may experience health effects. The general public is not likely to be affected. Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion."
			break
		case 4:
			airStat = "Poor"
			color = "rgb(204, 83, 13)"
			recommendation = "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects. Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion."
			break
		case 5:
			airStat = "Very Poor"
			color = "rgb(204, 13, 13)"
			recommendation = "Health warnings of emergency conditions. The entire population is more likely to be affected. Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion."
			break
		default:
			airStat = "Unknown"
			recommendation = "NA"
	}

	airQualityStat.innerText = airStat
	airQualityStat.style.color = color

	//set health recommendations based on aqi
	healthAdvice.innerText = recommendation;
}

const setComponentsOfAir = airData => {
	let components = { ...airData.list[0].components }
	componentsEle.forEach(ele => {
		const attr = ele.getAttribute('data-comp')
		ele.innerText = components[attr] += " μg/m³"
	})
}

const onPositionGatherError = e => {
	errorLabel.innerText = e.message
}

srchBtn.addEventListener("click", () => {
	getAirQuality(parseFloat(latInp.value).toFixed(4), parseFloat(lonInp.value).toFixed(4))
})

getUserLocation()
