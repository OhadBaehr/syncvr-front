'use client'
import { StoreContext } from "@/store/context";
import { Experience, Participant, ScheduledExperience } from "@/types";
import axios from "axios";
import { useContext, useEffect } from "react";
import useSWR from "swr";

interface InitialDataProviderProps {
    children: React.ReactNode;
}

export function InitialDataProvider({ children }: InitialDataProviderProps) {
    const [{ schedulerLoading }, setStore] = useContext(StoreContext);
    const fetcher = (url: string) => axios.get(url, {
        headers: {
            'Cache-Control': 'no-cache'
        }
    }).then(res => res.data);

    useSWR('/api/participants', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 10000,
        onSuccess: (data) => {
            setStore((prev) => ({ ...prev, participants: data, participantsLoading: false }));
        }
    });

    useSWR('/api/scheduled', fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 10000,
        onSuccess: (data) => {
            setStore((prev) => ({ ...prev, scheduled: data, schedulerLoading: false }));
        }
    });

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await axios.get('/api/experiences', {
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                });
                setStore((prev) => ({ ...prev, experiences: response.data, experiencesLoading: false }));
            } catch (error) {
                console.error('Error fetching experiences:', error);
                setStore((prev) => ({ ...prev, experiencesLoading: false }));
            }
        };

        fetchExperiences();
    }, [setStore]);

    return <>{children}</>
}