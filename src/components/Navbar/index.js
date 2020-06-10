import React, { useContext } from 'react';
import ToggleSwitch from '../ToggleSwitch';
import UnitRadioButtonGroup from '../UnitRadioButtonGroup';
import AppContext from '../../utils/AppContext';
import unitArr from '../../constant/units.json';

const Navbar = () => {
  const appContext = useContext(AppContext);
  const toggleDarkMode = () => {
    appContext.updateDarkMode(!appContext.darkMode);
  }
  return (
    <div className="">
      <div className="collapse" id="navbarToggleExternalContent">
        <div className="bg-dark p-4">
          <h4 className="text-white h4">Settings</h4>

          <ToggleSwitch toggleId="dark-mode-toggle" label="Dark mode" darkMode={appContext.darkMode} toggle={toggleDarkMode} />

          <UnitRadioButtonGroup
            radios={unitArr}
            updateUnitType={appContext.updateUnitType}
            updateUnits={appContext.updateUnits}
            currentUnitType={appContext.unitType} />

        </div>
      </div>

      <nav className="navbar navbar-dark bg-dark">
        <button className="navbar-toggler" type="button" data-toggle="collapse"
          data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
          aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <span className="navbar-brand mb-0 h1 mx-auto text-white">Simple Weather</span>
      </nav>
    </div>
  )
}

export default Navbar;