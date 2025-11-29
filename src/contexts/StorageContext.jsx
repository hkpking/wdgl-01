import React, { createContext, useContext } from 'react';
import * as mockStorage from '../services/mockStorage';

const StorageContext = createContext(null);

export const StorageProvider = ({ children, storage = mockStorage }) => {
    return (
        <StorageContext.Provider value={storage}>
            {children}
        </StorageContext.Provider>
    );
};

export const useStorage = () => {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error('useStorage must be used within a StorageProvider');
    }
    return context;
};
