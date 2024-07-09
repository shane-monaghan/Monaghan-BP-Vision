import React, {createContext, useContext, useState} from 'react';

const ProcessedImageContext = createContext();

export const useProcessedImages = () => useContext(ProcessedImageContext);

export const ProcessedImagesProvider = ({children}) => {
    const [processedImages, setProcessedImages] = useState([]);

    return (
        <ProcessedImageContext.Provider value={{processedImages, setProcessedImages}}>
            {children}
        </ProcessedImageContext.Provider>
    );
};