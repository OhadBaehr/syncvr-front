'use client';

import { createContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';

interface Participant {
    name: string;
    email: string;
    sex: string;
    lastExperience: string;
}

interface Experience {
    participant1: string;
    participant2: string;
    date: string;
    level: number;
}

interface SyncLevel {
    time: string;
    level: number;
}

interface Form {
    question: string;
    answer1: number;
    answer2: number;
}

interface ScheduledExperience {
    createdBy: string;
    date: string;
    participant1: string;
    participant2: string;
}

interface IContext {
    participants: Participant[];
    experiences: Experience[];
    synclevel: SyncLevel[];
    personalForms: Form[];
    scheduled: ScheduledExperience[];
}

const initialState: IContext = {
    participants: [
        { lastExperience: '27.3.24', sex: 'male', email: 'itay45977@gmail.com', name: 'Itay Aharoni' },
        { lastExperience: '27.3.24', sex: 'male', email: 'ohad@gmail.com', name: 'Ohad Baehr' },
        { lastExperience: '27.3.24', sex: 'male', email: 'moran@gmail.com', name: 'Moran Amar' },
    ],
    experiences: [
        { date: '27.3.24', level: 74, participant1: 'ohad@gmail.com', participant2: 'itay45977@gmail.com' },
        { date: '30.3.24', level: 69, participant1: 'noam@gmail.com', participant2: 'nikol@gmail.com' },
        { date: '31.3.24', level: 40, participant1: 'jecki@gmail.com', participant2: 'ilan@gmail.com' },
    ],
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
    scheduled: [
        { date: '27.3.24', participant2: 'itay45977@gmail.com', participant1: 'ohad@gmail.com', createdBy: 'Michal Rinott' },
        { date: '30.3.24', participant2: 'nikol@gmail.com', participant1: 'noam@gmail.com', createdBy: 'Michal Rinott' },
        { date: '31.3.24', participant2: 'ilan@gmail.com', participant1: 'jecki@gmail.com', createdBy: 'Michal Rinott' },
    ]
};

export const StoreContext = createContext([
    initialState,
    (() => {}) as Dispatch<SetStateAction<IContext>>,
]);

export function StoreContextProvider({ children }: { children: ReactNode }) {
    const [store, setStore] = useState(initialState);
    return (
        <StoreContext.Provider value={[store, setStore]}>
            {children}
        </StoreContext.Provider>
    );
}
