import React, { useState, useEffect, useContext } from 'react';
import { SearchGroup, CountryDropdown, RecentCitiesDiv, ConsoleLogButton } from '../../components';
import CurrentWeatherDiv from '../../components/CurrentWeatherDiv';
import HourlyForecastDiv from '../../components/HourlyForecastDiv';
import DailyForecastDiv from '../../components/DailyForecastDiv';
import API from '../../utils/API';
import * as LocalStorage from '../../utils/LocalStorage';

import UnitContext from '../../utils/UnitContext';
import countryArr from '../../constant/countries.json';
import ThemeContext from '../../utils/ThemeContext';

const Home = () => {
	const [userInput, updateUserInput] = useState('');
	const [selectedCountry, setSelectedCountry] = useState('US');
	const [showSearchButton, setShowSearchButton] = useState(false);

	const localStorageKey = `recent-cities`;
	const hourlyForecastNumber = 24;
	const maxRecentCities = 6;
	const savedCities = LocalStorage.checkLocalStorage(localStorageKey) ? LocalStorage.checkLocalStorage(localStorageKey) : [];

	const [currentCity, setCurrentCity] = useState({ city: '', country: 'US' });
	const [currentCoord, setCurrentCoord] = useState();
	const [forecastCoord, setForecastCoord] = useState();

	const [recentCities, setRecentCities] = useState(savedCities);

	const [currentWeather, setCurrentWeather] = useState();
	const [timezoneOffset, setTimezoneOffset] = useState(0);
	const [hourlyForecast, setHourlyForecast] = useState([]);
	const [dailyForecast, setDailyForecast] = useState([]);

	const unitContext = useContext(UnitContext);
	const themeContext = useContext(ThemeContext);

	// current weather by current coord.
	useEffect(() => {
		if (currentCoord !== undefined && currentCoord.lon && currentCoord.lat) {
			console.log(`getting current weather using currentCoord state...`);
			API.currentWeatherByCoord({ units: unitContext.unitType, lon: currentCoord.lon, lat: currentCoord.lat })
				.then(res => {
					setCurrentWeather(res.data);
					setForecastCoord(res.data.coord);
					setCurrentCity({ city: '', country: 'US' });
				})
				.catch(err => {
					if (err.response) {
						if (err.response.status === 404) { alert(`Cannot find forecast for that city`) }
						else { alert(`Something is wrong, cannot get forecast at this time`) }
					}
				});
		}
	}, [currentCoord, unitContext]);

	// current weather by current city.
	useEffect(() => {
		if (currentCity.city) {
			console.log(`getting current weather using currentCity state ... `)
			API.currentWeatherByCity({ units: unitContext.unitType, city: currentCity.city, country: currentCity.country })
				.then(res => {
					setCurrentWeather(res.data);
					setForecastCoord(res.data.coord);
					setCurrentCoord();
				})
				.catch(err => console.error(err))
		}

	}, [currentCity, unitContext]);

	// forecast weather by forecast coord.
	useEffect(() => {
		if (forecastCoord !== undefined && forecastCoord.lon && forecastCoord.lat) {
			console.log(`getting forecast weather data using forecastCoord state ...`);
			API.oneCallWeatherByCoord({ units: unitContext.unitType, lon: forecastCoord.lon, lat: forecastCoord.lat })
				.then(res => {
					setTimezoneOffset(res.data.timezone_offset)
					setHourlyForecast(res.data.hourly);
					setDailyForecast(res.data.daily);
					setForecastCoord();
				})
				.catch(err => console.error(err))
		}
	}, [forecastCoord, unitContext])

	// toggle search and locate me buttons
	useEffect(() => {
		if (userInput) {
			setShowSearchButton(true);
		} else {
			setShowSearchButton(false);
		}
	}, [userInput])

	// update selectedCountry
	const updateSelectedCountryState = event => {
		const country = event.target.value;
		setSelectedCountry(country);
	};

	// update recent cities state
	const updateRecentCities = newCityObj => {
		const recentCitiesArr = recentCities;
		const exist = recentCitiesArr.find(city => { return (city.city === newCityObj.city && city.country === newCityObj.country) });
		if (exist) return;
		console.log(`adding ${newCityObj.city} to recent cities...`)
		const newRecentCitiesArr = [newCityObj, ...recentCitiesArr];
		if (newRecentCitiesArr.length > maxRecentCities) { newRecentCitiesArr.pop() };
		setRecentCities(newRecentCitiesArr);
		LocalStorage.saveLocalStorage(localStorageKey, newRecentCitiesArr);
	}

	// check for enter key pressed
	const keyPressed = code => { if (code === 13) setCurrentCity({ city: userInput, country: selectedCountry }) };

	// when search button is pressed
	const searchButtonPressed = () => { setCurrentCity({ city: userInput, country: selectedCountry }) }



	const locateMeButtonPressed = () => {
		const success = browserPosition => {
			const coords = browserPosition.coords;
			console.log(browserPosition)
			console.log(`updating currentCoord state...`);
			setCurrentCoord({ lat: coords.latitude, lon: coords.longitude });
		}

		const error = err => {
			alert(`Unable to retrieve your location at this time`);
			console.log(err);
		};

		if (!navigator.geolocation) {
			console.log(`Geolocation is not supported by your browser ...`);
			alert(`Geolocation is not supported by your browser...`);
		} else {
			console.log(`Getting your location ...`)
			const options = { timeout: 12000 };
			navigator.geolocation.getCurrentPosition(success, error, options);
		}
	};

	const recentCityButtonPressed = ({ city, country }) => {
		setCurrentCity({ city: city, country: country });
	};

	const removeCityButtonPressed = key => {
		const recentCitiesArr = recentCities;
		const index = recentCitiesArr.findIndex(city => city.key === key);
		recentCitiesArr.splice(index, 1);
		setRecentCities([...recentCitiesArr]);
		LocalStorage.saveLocalStorage(localStorageKey, recentCitiesArr);
	};


	return (
		<div className={`container-fluid pb-5 bg-${themeContext.backgroundColor}`} style={{ height: '100vh', overflow: 'auto' }}>
			<div className="row">
				<div className="col-12 col-md-4 col-lg-3">

					<SearchGroup defaultValue={userInput}
						onChange={updateUserInput}
						keyPressed={keyPressed}
						showSearchButton={showSearchButton}
						locateMeButtonPressed={locateMeButtonPressed}
						searchButtonPressed={searchButtonPressed} />
					<CountryDropdown
						countryArr={countryArr}
						selectedCountry={selectedCountry} // selected country code
						onChange={updateSelectedCountryState} />
					{recentCities.length > 0 ?
						<RecentCitiesDiv
							recentCities={recentCities}
							recentCityButtonPressed={recentCityButtonPressed}
							removeCityButtonPressed={removeCityButtonPressed}
						/>

						:
						``
					}

					<div className="d-flex flex-column">
						<ConsoleLogButton name="currentCity" state={currentCity} />
						<ConsoleLogButton name="currentCoord" state={currentCoord} />
						<ConsoleLogButton name="forecastCoord" state={forecastCoord} />
						<ConsoleLogButton name="userInput" state={userInput} />
						<ConsoleLogButton name="selectedCountry" state={selectedCountry} />
						<ConsoleLogButton name="recent" state={recentCities} />
						<ConsoleLogButton name="current" state={currentWeather} />
						<ConsoleLogButton name="timezoneOffset" state={timezoneOffset} />
						<ConsoleLogButton name="hourly" state={hourlyForecast} />
						<ConsoleLogButton name="daily" state={dailyForecast} />
					</div>

				</div>

				<div className="col-12 col-md-8 col-lg-9">
					{
						currentWeather ?
							<CurrentWeatherDiv
								currentWeather={currentWeather}
								country="USA" />
							:
							``
					}
					{
						hourlyForecast ?
							<HourlyForecastDiv
								hourly={hourlyForecast}
								hours={hourlyForecastNumber}
								timezone={timezoneOffset}
							/>
							:
							``
					}
					{
						dailyForecast ?
							<DailyForecastDiv
								daily={dailyForecast} timezoneOffset={timezoneOffset} />
							:
							``
					}

				</div>


			</div>
		</div>
	);
}

export default Home;
