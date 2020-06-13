import React, { useContext, useEffect } from 'react';
import ToggleSwitch from '../ToggleSwitch';
import UnitRadioButtonGroup from '../UnitRadioButtonGroup';
import AppContext from '../../utils/AppContext';
import ThemeContext from '../../utils/ThemeContext';
import unitArr from '../../constant/units.json';

const Navbar = () => {
  const appContext = useContext(AppContext);
  const themeContext = useContext(ThemeContext);
  const toggleDarkMode = () => appContext.updateDarkMode(!appContext.darkMode);

  useEffect(() => {
    themeContext.darkMode(appContext.darkMode)
  }, [appContext.darkMode])

  return (
    <div className="">
      <div className="collapse" id="navbarToggleExternalContent">
        <div className={`bg-${themeContext.backgroundColor} p-4`}>
          <h4 className={`text-${themeContext.textColor} h4`}>Settings</h4>

          <ToggleSwitch toggleId="dark-mode-toggle" label="Dark mode" darkMode={appContext.darkMode} toggle={toggleDarkMode} />

          <UnitRadioButtonGroup
            radios={unitArr}
            updateUnitType={appContext.updateUnitType}
            updateUnits={appContext.updateUnits}
            currentUnitType={appContext.unitType} />

        </div>
      </div>

      <nav className={`navbar navbar-${themeContext.backgroundColor} bg-${themeContext.backgroundColor}`}>
        <button className="navbar-toggler" type="button" data-toggle="collapse"
          data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
          aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <span className={`navbar-brand mb-0 h1 mx-auto text-${themeContext.textColor}`}>Simple Weather</span>
      </nav>
    </div>
  )
}

export default Navbar;