import "./style.css"
import { getWeather } from "./weather"
import { ICON_MAP } from "./iconMap"

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)


function positionSuccess({ coords }) {
  getWeather(
    coords.latitude, 
    coords.longitude, 
    Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderWeather)
.catch(e => {
  console.error("Error getting weather.", e)
  // alert("Error getting weather.")
})

}

function positionError () {
  alert("There was an error getting your location. Please allow us to use your location and refresh the page")
}

// getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone).then
// (
//   data => {
//   console.log(data)
  // Gives us the data from the API
// }
// )
// "...Intl.DateTimeFormat().resolvedOptions().timeZone)" gives us the 
// current time of the timezone we are currently in

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather (current); 
  renderDailyWeather (daily);
  renderHourlyWeather(hourly);
  document.body.classList.remove("blurred")
}

function setValue(selector, value, { parent = document } = { }) {
  // A helper function "setValue" that will take in a selector, and take in a value
  // Then optionally the helper function gets passed a parent but by defeault the
  // document object is what is preferred to be the default
  parent.querySelector(`[data-${selector}]`).textContent = value

}

function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`
}

const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current) {
  currentIcon.src = getIconUrl(current.iconCode)
  setValue("current-temp", current.currentTemp)
  // We don't have to use "document.querySelector("[data-current-temp]").textContent = current.currentTemp"
  // we can just use "setValue("current-temp", current.currentTemp)" due to the helper function
  setValue("current-high", current.highTemp)
  setValue("current-low", current.lowTemp)
  setValue("current-fl-high", current.highFeelsLike)
  setValue("current-fl-low", current.lowFeelsLike)
  setValue("current-wind", current.windSpeed)
  setValue("current-precipitation", current.precip)
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "short" })
// This code runs a formatter, that returns just the day portion of the weekday
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily) {
  dailySection.innerHTML = ""
  daily.forEach(day => {
    const element = dayCardTemplate.content.cloneNode(true)
    // This "const element = dayCardTemplate.content.cloneNode(true)" is how
    // to clone a template (an element that is a clone of the template)
    // It not only clones the template but also all of its children as well
    setValue("temp", day.maxTemp, { parent: element })
    // The important thing is that the parent is a current element, to set
    // that value
    setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element })
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
    dailySection.append(element)
    
  })
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric" })
// This code runs a formatter, that returns just the day portion of the weekday
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")
function renderHourlyWeather (hourly) {
  hourlySection.innerHTML = ""
  hourly.forEach(hour => {
    const element = hourRowTemplate.content.cloneNode(true)
    // This "const element = hourCardTemplate.content.cloneNode(true)" is how
    // to clone a template (an element that is a clone of the template)
    // It not only clones the template but also all of its children as well
    setValue("temp", hour.temp, { parent: element })
    // The important thing is that the parent is a current element, to set
    // that value
    setValue("fl-temp", hour.feelsLike, { parent: element })
    setValue("wind", hour.windSpeed, { parent: element })
    setValue("precip", hour.precip, { parent: element })
    setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element })
    setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element })
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
    hourlySection.append(element)
    
  })
}