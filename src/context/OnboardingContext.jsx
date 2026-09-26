
import React, { createContext, useContext, useState } from "react";

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  const [career, setCareer] = useState(null);
  const [skills, setSkills] = useState([]);

  return (
    <OnboardingContext.Provider value={{ career, setCareer, skills, setSkills }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}