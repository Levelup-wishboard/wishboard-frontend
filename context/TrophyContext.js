// TrophyContext.js
import React, { createContext, useState } from 'react';

export const TrophyContext = createContext();

export const TrophyProvider = ({ children }) => {
  const [customTrophies, setCustomTrophies] = useState([]);

  const addTrophy = (trophy) => {
    setCustomTrophies((prev) => {
      const exists = prev.find(t => t.bucketId === trophy.bucketId);
      if (exists) return prev;
      return [trophy, ...prev];
    });
  };

  return (
    <TrophyContext.Provider value={{ customTrophies, addTrophy }}>
      {children}
    </TrophyContext.Provider>
  );
};
