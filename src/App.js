import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as LocalStorage from './utils/LocalStorage';
import * as ContextFunction from './utils/ContextFunctions';
import DarkModeContext from './utils/DarkModeContext';
import UnitContext from './utils/UnitContext';
import ThemeContext from './utils/ThemeContext';

const App = () => {

  // useEffect(() => {
  //   const localSetting = LocalStorage.checkLocalStorage(`simple-weather`);
  //   console.log(`localSetting is`);
  //   console.log(localSetting);
  //   if (localSetting) {
  //     console.log(`found existing local setting, setting darkMode state and unitState...`)
  //     setDarkModeState({ ...darkModeState, darkMode: localSetting.darkMode });
  //     setUnitState({ ...unitState, unitType: localSetting.type, units: localSetting.units })
  //   }
  // }, [])

  const localSetting = LocalStorage.checkLocalStorage(`simple-weather`);

  const [darkModeState, setDarkModeState] = useState({
    darkMode: localSetting.darkMode ? localSetting.darkMode : false,
    toggleDarkMode: (bool) => setDarkModeState({ ...darkModeState, darkMode: bool })
  });

  const [unitState, setUnitState] = useState({
    unitType: localSetting.type ? localSetting.type : `imperial`,
    units: localSetting.units ? localSetting.units : `°F`,
    updateUnitType: (unitType, units) => {
      setUnitState({ ...unitState, unitType, units });
    }
  });

  const [themeState, setThemeState] = useState({
    backgroundColor: `light`,
    textColor: `black`,
    borderColor: `dark`,
    updateTheme: (bool) => {
      const newThemeObj = ContextFunction.turnOnDarkTheme(bool);
      setThemeState({ ...themeState, ...newThemeObj })
    }
  })

  return (
    <Router>
      <UnitContext.Provider value={unitState}>
        <DarkModeContext.Provider value={darkModeState}>
          <ThemeContext.Provider value={themeState}>
            <div className={``}>
              <Navbar />
              <Route exact path="/" component={Home} />
              <Route exact path="/simple-weather" component={Home} />
              <Footer />
            </div>
          </ThemeContext.Provider>
        </DarkModeContext.Provider>
      </UnitContext.Provider>
    </Router>
  )
}

export default App;
