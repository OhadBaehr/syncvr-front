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
    const fetcher = (url: string) => axios.post(url).then(res => res.data);

    useSWR('/api/participants/fetch', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 10000,
        onSuccess: (data) => {
            setStore((prev) => ({ ...prev, participants: data, participantsLoading: false }));
        }
    });

    useSWR('/api/scheduled/fetch', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 10000,
        onSuccess: (data) => {
            setStore((prev) => ({ ...prev, scheduled: data, schedulerLoading: false }));
        }
    });

    useSWR('/api/experiences/fetch', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 10000,
        onSuccess: (data) => {
            setStore((prev) => ({ ...prev, experiences: data, experiencesLoading: false }));
        }
    });

    return <>{children}</>
}