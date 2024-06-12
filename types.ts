import { ExperienceType } from "./constants"

export interface FullUser {
    nickname: string
    picture: string
    created_at: string
    user_id: string
    name: string
    email_verified: boolean,
    identities: unknown,
    email: string
    family_name: string
    given_name: string
    updated_at: string
    last_login: string
    last_ip: string
    logins_count: number
}

export interface Participant {
    name: string;
    email: string;
    sex: string;
    lastExperience: string;
}

export interface Experience extends ScheduledExperience {
    avgSyncHands: number,
    avgSyncPendulum: number,
}

export interface ScheduledExperience {
    uniqueId: string
    createdByEmail: string
    createdBy: string
    selectedParticipants: Participant[]
    phaseDuration: number
    historyLength: number
    rateOfTesting: number
    highSync: number
    lowSync: number
    date: Date
    experienceType: ExperienceType[]
    pendulumRotation: number
    highSyncColor: string
    midSyncColor: string
    lowSyncColor: string
    sessionId: string
}
