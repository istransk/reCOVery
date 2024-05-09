import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getKeyValue, checkIfValueExists, generateKey } from '../utils/encryption';

const KeyContext = createContext();

const useKey = () => {
  return useContext(KeyContext);
}

const KeyProvider = ({ children }) => {
  const [key, setKey] = useState(null);
  useEffect(() => {
    checkIfValueExists('key').then((result) => {
      if (!result) {
          generateKey().then((key) => {
              setKey(key);
              console.log("key generated:", key);
          });
      } else {
        getKeyValue().then(setKey);
      }
  });
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