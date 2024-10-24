'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserInput {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  gender: string;
  city: string;
}

interface UserInputContextType {
  userInput: UserInput;
  setUserInput: React.Dispatch<React.SetStateAction<UserInput>>;
}

const UserInputContext = createContext<UserInputContextType | undefined>(undefined);

export const UserInputProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInput, setUserInput] = useState<UserInput>({
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    gender: '',
    city: '',
  });

  return (
    <UserInputContext.Provider value={{ userInput, setUserInput }}>
      {children}
    </UserInputContext.Provider>
  );
};

export const useUserInput = () => {
  const context = useContext(UserInputContext);
  if (context === undefined) {
    throw new Error('useUserInput must be used within a UserInputProvider');
  }
  return context;
};
