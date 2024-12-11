import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCurrentUser } from "@/lib/appwrite";
import { Models } from "react-native-appwrite";

interface GlobalProviderProps {
    children: ReactNode;
}

interface GlobalContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: any; 
    setUser: React.Dispatch<React.SetStateAction<any>>; 
    isLoading: boolean;
}

const initialContextValue: GlobalContextType = {
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    user: null,
    setUser: () => {},
    isLoading: true,
};

const GlobalContext = createContext<GlobalContextType>(initialContextValue);
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then((response) => {
                if (response) {
                    setIsLoggedIn(true);
                    setUser(response);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};