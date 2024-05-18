'use client'
import { ParticipantsTable } from "@/components/Participants/ParticipantsTable";
import { ActionIcon, AppShell, Text, Burger, Card, Flex, Input, Table, Tabs, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDoorExit, IconEdit, IconLogout, IconPencil, IconSearch, IconTrash, IconUserEdit } from "@tabler/icons-react";
import { capitalize } from "lodash";
import Image from "next/image";

enum TabsValues {
    Dashboard = "dashboard",
    Participants = "participants",
    Experiences = "experiences",
    Profile = "profile",
    Analyzer = "analyzer",
}

export default function Participants() {
    const [opened, { toggle }] = useDisclosure();

    return (
        <Tabs variant="pills" defaultValue={TabsValues.Participants} orientation="vertical">
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
                    <Title size={'20px'}>
                        Participants
                    </Title>
                    <Flex align={'center'} h={48}>


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
                    <Tabs.Panel mt={36} value={TabsValues.Participants}>
                        <ParticipantsTable />
                    </Tabs.Panel>
                </AppShell.Main>
            </AppShell>
        </Tabs>
    )
}