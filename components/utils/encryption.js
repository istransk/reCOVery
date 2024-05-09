import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import CryptoES from 'crypto-es';



const getKeyValue = async () => {
    try {
        const value = await SecureStore.getItemAsync('key');
        console.log('key getKeyValue:', value);
        return value;
    } catch (error) {
        console.error('Error getting value from SecureStore:', error);
        throw error;
    }
};


const encryption = (data,key) => {
    let encryptedData = '';
    encryptedData = CryptoES.AES.encrypt(data, key).toString();
    return encryptedData;
};


const decryption = (cryptedData,key) => {
    const decryptedData = CryptoES.AES.decrypt(cryptedData, key).toString(CryptoES.enc.Utf8);
    return decryptedData;
};

const generateKey = async () => {
    UUID = Crypto.randomUUID();
    console.log('UUID:', UUID);
    await SecureStore.setItemAsync('key', UUID);
    return UUID;
};

const checkIfValueExists = async (key) => {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value; // Returns true if value exists, false otherwise
    } catch (error) {
      console.error('Error checking value in SecureStore:', error);
      throw error;
    }
  };

export { encryption, decryption, generateKey, checkIfValueExists, getKeyValue};