'use client'
import { StoreContext } from "@/store/context";
import { Experience, Participant, ScheduledExperience } from "@/types";
import axios from "axios";
import { useContext } from "react";
import useSWR from "swr";

interface InitialDataProviderProps {
    children: React.ReactNode;
}

export function InitialDataProvider({ children }: InitialDataProviderProps) {
    const [{ schedulerLoading }, setStore] = useContext(StoreContext);
    useSWR<Participant[]>('/api/participants', (url: string) => axios.get(url).then(res => res.data), {
        onSuccess: (data) => {
            setStore((prev) => ({ ...prev, participants: data, participantsLoading: false }))
        }
    });

    useSWR<ScheduledExperience[]>('/api/scheduled', (url: string) => axios.get(url).then(res => res.data), {
        onSuccess: (data) => {
            setStore((prev) => ({ ...prev, scheduled: data, schedulerLoading: false }))
        }
    });


    useSWR<Experience[]>('/api/experiences', (url: string) => axios.get(url).then(res => res.data), {
        onSuccess: (data) => {
            setStore((prev) => ({ ...prev, experiences: data, experiencesLoading: false }))
        }
    });

    return <>{children}</>
}