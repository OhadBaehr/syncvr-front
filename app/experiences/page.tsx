import { ExperiencesTable } from "@/components/Experiences/ExperiencesTable";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Experiences() {
    return (
        <ExperiencesTable />
    )
}