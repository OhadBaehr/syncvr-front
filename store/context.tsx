'use client';

import { Participant, Experience, ScheduledExperience } from '@/types';
import { createContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

interface IContext {
    participants: Participant[];
    experiences: Experience[];
    scheduled: ScheduledExperience[];
    participantsLoading: boolean;
    experiencesLoading: boolean;
    schedulerLoading: boolean;
}

const initialState: IContext = {
    participantsLoading: true,
    experiencesLoading: true,
    schedulerLoading: true,
    participants: [],
    experiences: [],
    scheduled: [],
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
