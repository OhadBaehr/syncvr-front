'use client'
import { useUser } from '@auth0/nextjs-auth0/client';
import { ExperiencesTable } from "@/components/Experiences/ExperiencesTable";
import { ParticipantsTable } from "@/components/Participants/ParticipantsTable";
import { ScheduledExperiences } from "@/components/Scheduler/ScheduledExperiences";
import { ActionIcon, AppShell, Text, Burger, Card, Flex, Input, Table, Tabs, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDoorExit, IconEdit, IconLogout, IconPencil, IconSearch, IconTrash, IconUserEdit } from "@tabler/icons-react";
import { capitalize } from "lodash";
import Image from "next/image";
import { useState } from "react";
enum TabsValues {
    Scheduler = "scheduler",
    Participants = "participants",
    Experiences = "experiences",

}
export default function Participants() {
    const [opened, { toggle }] = useDisclosure();
    const { user, error, isLoading } = useUser();
    console.log(user)
    const [currentValue, setCurrentValue] = useState(TabsValues.Participants);
    return (
        <Tabs onChange={(value) => setCurrentValue(value as TabsValues)} variant="pills" defaultValue={TabsValues.Participants} orientation="vertical">
            <AppShell
                w={'100%'}
                navbar={{
                    width: 220,
                    breakpoint: 'sm',
                    collapsed: { mobile: !opened },
                }}
                padding="md"
            >
                <AppShell.Navbar p="md">
                    <Flex gap={8} align={'center'}>
                        <Image src={'/assets/logo.svg'} alt="logo" width={40} height={40} />
                        <Title size={"24px"}>SyncVR</Title>
                    </Flex>
                    <Tabs.List mt={16}>
                        {Object.values(TabsValues).map((tab: TabsValues) => (
                            <Tabs.Tab key={tab} value={tab}>
                                {capitalize(tab)}
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </AppShell.Navbar>

                <AppShell.Main style={{ background: "#F4F7FE" }}>

                    <Flex align={'center'} >
                        <Title size={'20px'}>
                            {capitalize(currentValue)}
                        </Title>

                        <Card style={{ borderRadius: 300 }} p={"6px 16px"} ml={'auto'} shadow="xs">
                            <Flex gap={8} align={'center'} justify={'center'}>
                                <Text size={'14px'}>
                                    Hello, Researcher
                                </Text>
                                <ActionIcon variant="subtle">
                                    <IconLogout />
                                </ActionIcon>
                            </Flex>
                        </Card>
                    </Flex>
                    <Tabs.Panel mt={36} value={TabsValues.Scheduler}>
                        <ScheduledExperiences />
                    </Tabs.Panel>
                    <Tabs.Panel mt={36} value={TabsValues.Participants}>
                        <ParticipantsTable />
                    </Tabs.Panel>
                    <Tabs.Panel mt={36} value={TabsValues.Experiences}>
                        <ExperiencesTable />
                    </Tabs.Panel>
                </AppShell.Main>
            </AppShell>
        </Tabs>
    )
}