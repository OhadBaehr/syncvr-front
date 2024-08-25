'use client'
import { StoreContext } from "@/store/context";
import { Experience, Participant, ScheduledExperience } from "@/types";
import axios from "axios";
import { useContext } from "react";
import useSWR from "swr";

interface InitialDataProviderProps {
    children: React.ReactNode;
}

// Fetch all important data on platform load
export function InitialDataProvider({ children }: InitialDataProviderProps) {
    const [_, setStore] = useContext(StoreContext);
    const fetcher = (url: string) => axios.post(url).then(res => res.data);

    // Fetch all participants on component mount
    useSWR('/api/participants/fetch', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 10000,
        onSuccess: (data) => {
            setStore((prev) => ({ ...prev, participants: data, participantsLoading: false }));
        }
    });

    // Fetch all scheduled (not yet done) experiences on component mount
    useSWR('/api/scheduled/fetch', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 10000,
        onSuccess: (data) => {
            setStore((prev) => ({ ...prev, scheduled: data, schedulerLoading: false }));
        }
    });

    // Fetch all experiences already done on component mount
    useSWR('/api/experiences/fetch', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 10000,
        onSuccess: (data) => {
            setStore((prev) => ({ ...prev, experiences: data, experiencesLoading: false }));
        }
    });

    return <>{children}</>
}