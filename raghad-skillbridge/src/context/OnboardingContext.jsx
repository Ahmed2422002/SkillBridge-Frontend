
import { getCurrentUser, saveProfileExtra, addEvent } from "../api";
import { learningPaths } from "../data/coursePlaylists";
import React, { createContext, useContext, useState, useEffect } from "react";
const OnboardingContext = createContext(null);


export function OnboardingProvider({ children }) {
  const [career, setCareer] = useState(null);
  const [skills, setSkills] = useState([]);
 useEffect(() => {
  const user = getCurrentUser();
  if (user.email && career) {
    saveProfileExtra(user.email, { career });
    addEvent({
      type: "joined",
      studentEmail: user.email,
      pathKey: career,
      label: (learningPaths[career] && learningPaths[career].title) || career,
    });
  }
}, [career]);
  return (
    <OnboardingContext.Provider value={{ career, setCareer, skills, setSkills }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}