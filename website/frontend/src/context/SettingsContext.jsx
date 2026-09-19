import { createContext, useContext, useEffect, useState } from "react";
import { getClinicSettings } from "../services/settingsService";
import { demoClinicSettings } from "../utils/demoData";

const SettingsContext = createContext(demoClinicSettings);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(demoClinicSettings);

  useEffect(() => {
    let mounted = true;
    getClinicSettings().then(({ item }) => {
      if (mounted && item) setSettings(item);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
