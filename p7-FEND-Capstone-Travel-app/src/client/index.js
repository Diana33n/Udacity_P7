import  { getGeoCity, getImageURL, getWeatherForecast, getCountryInfo} from './js/app';

import { getCity, getTripStart, getTripEnd } from './js/form';

import { showModal, recentTrip } from './js/model';

import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/style.scss';

import 'bootstrap';

const $ = require("jquery");


const trip = {};

const handleSave = async (event) => {
  event.preventDefault();

  try {
    const res = await fetch('http://localhost:8080/saveData',
      {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trip: trip })
      });
    if (res.ok) {
      const data = await res.json();
      recentTrip(data);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

const handleCancel = (event) => {
  event.preventDefault();
  
  const modal = document.getElementById('tripModal');
  if (modal) {
    $('#tripModal').modal('toggle');
  } else {
    console.warn("Modal not found!");
  }

  const caption = document.querySelector('.caption');
  if (caption) {
    caption.style.display = 'block';
  }
};


const handleSearch = async (e) => {
  e.preventDefault();

  try {
    trip.city = getCity();
    trip.start = getTripStart();
    trip.end = getTripEnd();

    const geocity = await getGeoCity(trip.city);
    if (!geocity) throw new Error("GeoNames API failed");

    trip.latitude = geocity.latitude;
    trip.longitude = geocity.longitude;
    trip.countryCode = geocity.countryCode;

    trip.weatherForecast = await getWeatherForecast(trip.latitude, trip.longitude);
    if (!trip.weatherForecast) throw new Error("Weather API failed");

    const countryInfo = await getCountryInfo(trip.countryCode);
    if (!countryInfo) throw new Error("Country API failed");

    trip.country = countryInfo.name;
    trip.countryFlag = countryInfo.flag;

    trip.image = await getImageURL(trip.city, trip.country);
    if (!trip.image) throw new Error("Image API failed");

    console.log(trip);
    showModal(trip);
  } catch (error) {
    console.error("Error fetching trip data:", error);
    alert("An error occurred while fetching trip details. Please try again.");
  }
};

/* Add event listeners */
document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById('button_search');
  if (searchButton) {
    searchButton.addEventListener('click', handleSearch);
  } else {
    console.warn("Search button not found!");
  }

  const saveButton = document.querySelector('.trip_save');
  if (saveButton) {
    saveButton.addEventListener('click', handleSave);
  } else {
    console.warn("Save button not found!");
  }

  document.querySelectorAll('.trip_cancel').forEach(element => {
    element.addEventListener('click', handleCancel);
  });
});
