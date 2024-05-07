import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getKeyValue } from '../utils/encryption';

const KeyContext = createContext();

const useKey = () => {
  return useContext(KeyContext);
}

const KeyProvider = ({ children }) => {
  const [key, setKey] = useState(null);
  useEffect(() => {
    getKeyValue().then(setKey);
  }, []);

  const getKeyValue = async () => {
    try {
        const value = await SecureStore.getItemAsync('key');
        return value;
    } catch (error) {
        console.error('Error getting value from SecureStore:', error);
        throw error;
    }
  };
  return (
    <KeyContext.Provider value={key}>
      {children}
    </KeyContext.Provider>
  );
};

export { KeyProvider, KeyContext };