'use client';

import { createContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

interface Participant {
    name: string;
    email: string;
}

interface IContext {
    participants: Participant[];
}

const initialState: IContext = {
    participants: [],
};

export const StoreContext = createContext([
    initialState,
    (() => { }),
] as [IContext, Dispatch<SetStateAction<IContext>>]);

export function StoreContextProvider({ children }: { children: ReactNode }) {
    const [store, setStore] = useState(initialState);
    return (
        <StoreContext.Provider value={[store, setStore]}>
            {children}
        </StoreContext.Provider>
    );
}
