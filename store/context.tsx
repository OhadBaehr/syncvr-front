'use client';

import { Participant, Experience, SyncLevel, Form, ScheduledExperience } from '@/types';
import { createContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

interface IContext {
    participants: Participant[];
    experiences: Experience[];
    synclevel: SyncLevel[];
    personalForms: Form[];
    scheduled: ScheduledExperience[];
}

const initialState: IContext = {
    participants: [],
    experiences: [],
    synclevel: [
        { time: '0s', level: 0 },
        { time: '10s', level: 10 },
        { time: '20s', level: 30 },
        { time: '30s', level: 50 },
        { time: '40s', level: 70 },
        { time: '50s', level: 90 },
        { time: '60s', level: 60 },
        { time: '70s', level: 80 },
        { time: '80s', level: 40 },
        { time: '90s', level: 20 },
        { time: '100s', level: 30 },
        { time: '110s', level: 50 },
        { time: '120s', level: 70 },
    ],
    personalForms: [
        { question: 'q1', answer1: 2, answer2: 3 },
        { question: 'q2', answer1: 1, answer2: 4 },
        { question: 'q3', answer1: 4, answer2: 2 },
        { question: 'q4', answer1: 3, answer2: 1 },
        { question: 'q5', answer1: 5, answer2: 2 },
        { question: 'q6', answer1: 4, answer2: 1 },
        { question: 'q7', answer1: 3, answer2: 1 },
        { question: 'q8', answer1: 4, answer2: 5 },
        { question: 'q9', answer1: 5, answer2: 5 },
        { question: 'q10', answer1: 3, answer2: 5 },
    ],
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
