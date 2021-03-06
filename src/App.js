import "./App.css";
import Info from "./Info";
import Footer from "./Footer";
import Forecast from "./Forecast";
import React, { useState } from "react";
import axios from "axios";

export default function App() {
	const [city, setCity] = useState("Madrid");
	const [info, setInfo] = useState({ ready: false });

	function displayInfo(response) {
		setInfo({
			ready: true,
			coordinates: response.data.coord,
			name: response.data.name,
			date: new Date(response.data.dt * 1000),
			temperature: Math.round(response.data.main.temp),
			humidity: Math.round(response.data.main.humidity),
			wind: Math.round(response.data.wind.speed),
			icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
			description: response.data.weather[0].description,
		});
	}
	function search() {
		let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=523328191cb42f7e509a7d1cfe8f3757&units=metric`;
		axios.get(apiUrl).then(displayInfo);
	}
	function handleSubmit(event) {
		event.preventDefault();
		search();
	}
	function updateCity(event) {
		setCity(event.target.value);
	}
	function getLocation(event) {
		event.preventDefault();
		navigator.geolocation.getCurrentPosition(obtainCoordinates);
	}
	function obtainCoordinates(position) {
		let lon = position.coords.longitude;
		let lat = position.coords.latitude;
		let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=523328191cb42f7e509a7d1cfe8f3757&units=metric`;
		axios.get(url).then(displayInfo);
	}

	if (info.ready) {
		return (
			<div className="App">
				<div className="container">
					<section>
						<div className="row">
							<div className="col-7">
								<Info defaultCity="Madrid" data={info} />
							</div>
							<div className="col-5">
								<form className="SearchForm" onSubmit={handleSubmit}>
									<div className="row">
										<div className="col-7">
											<span className="searchForm">
												<input
													id="search-city"
													type="search"
													placeholder="Enter city name"
													autoComplete="off"
													onChange={updateCity}
													className="form-control form-control-sm"
												/>
											</span>
										</div>
										<div className="col-3">
											<input
												type="submit"
												value="Search"
												className="btn btn-primary btn-sm"
											/>
										</div>
									</div>
								</form>
								<div className="currentLocation">
									<button
										type="button"
										className="btn btn-secondary btn-sm"
										onClick={getLocation}
									>
										Current location
									</button>
								</div>
								<Forecast coord={info.coordinates} />
							</div>
						</div>
					</section>
					<Footer />
				</div>
			</div>
		);
	} else {
		search();
		return <div>Loading data...</div>;
	}
}
