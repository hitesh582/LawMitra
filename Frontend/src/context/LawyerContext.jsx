import { createContext, useState, useContext } from 'react';

export const LawyerDataContext = createContext();

const LawyerContext = ({ children }) => {
    const [ lawyer, setLawyer] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const updateLawyer = (lawyerData) => {
        setLawyer(lawyerData);
    };

    const value = {
        lawyer,
        setLawyer,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateLawyer
    };

    return (
        <LawyerDataContext.Provider value={value}>
            {children}
        </LawyerDataContext.Provider>
    );
};

export default LawyerContext;