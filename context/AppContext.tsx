"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of your context value
type AppContextType = {
  createCommunityOpen: boolean;
  createPostOpen: boolean;
  accountManagementOpen: boolean;
  setCreateCommunityOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCreatePostOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAccountManagementOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// Provide default values for the context
const defaultContextValue: AppContextType = {
  createCommunityOpen: false,
  createPostOpen: false,
  accountManagementOpen: false,
  setCreateCommunityOpen: () => {}, // Default empty function
  setCreatePostOpen: () => {}, // Default empty function
  setAccountManagementOpen: () => {}, // Default empty function
};

// Create the context with a default value
const AppContext = createContext<AppContextType>(defaultContextValue);

// Create a provider component
type AppProviderProps = {
  children: ReactNode;
};

export default function AppProvider({ children }: AppProviderProps) {
  const [createCommunityOpen, setCreateCommunityOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [accountManagementOpen, setAccountManagementOpen] = useState(false);

  const value: AppContextType = {
    createCommunityOpen,
    setCreateCommunityOpen,
    createPostOpen,
    setCreatePostOpen,
    accountManagementOpen,
    setAccountManagementOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
