'use client'
import { useUser } from '@auth0/nextjs-auth0/client';
import { ActionIcon, AppShell, Text, Burger, Card, Flex, Input, Table, Tabs, Title, Box } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { IconDoorExit, IconEdit, IconLogout, IconPencil, IconSearch, IconTrash, IconUserEdit } from "@tabler/icons-react";
import { capitalize } from "lodash";
import Image from "next/image";
import { ReactNode, useContext, useEffect, useState } from "react";
import { StoreContext } from '@/store/context';
import { TabsValues } from '@/constants';
import { useRouter } from 'next/navigation';
import { useUserWithFallback } from '@/lib/useUserWithFallback';


interface DashboardProps {
    page?: TabsValues
    children?: ReactNode
}

// Dashboard shared layout with tabs and connected user information
export function Dashboard({ page = TabsValues.Scheduler, children }: DashboardProps) {
    const router = useRouter();
    const { user } = useUserWithFallback();
    const { name } = user || { nickname: "" }
    const [currentValue, setCurrentValue] = useState(page);
    const [animatedNickname, setAnimatedNickname] = useState("");


    const pathname = typeof window === 'undefined' ? '' : window.location.pathname

    // Set the current tab based on the URL path
    useEffect(() => {
        const pathSegment = window.location.pathname.split('/')[1];
        setCurrentValue(pathSegment as TabsValues);
    }, [pathname]);


    // Animate the user nickname on page load :)
    useEffect(() => {
        if (name) {
            let index = 0;
            const animate = () => {
                if (index < name.length) {
                    index++;
                    setAnimatedNickname(name.substring(0, index));
                    setTimeout(() => {
                        requestAnimationFrame(animate);
                    }, 32);
                }
            };
            setAnimatedNickname("");
            requestAnimationFrame(animate);
        }
    }, [name]);

    // Change the tab based on the selected tab
    function handleTabChange(value: TabsValues) {
        const newUrl = `/${value.toLowerCase()}`;
        window.history.pushState(null, '', newUrl);
        router.push(newUrl);
        setCurrentValue(value);
    }

    return (
        <Tabs value={currentValue} onChange={(value) => handleTabChange(value as TabsValues)} variant="pills" orientation="vertical">
            <AppShell
                w={'100%'}
                navbar={{
                    width: 220,
                    breakpoint: 'sm',
                    collapsed: { mobile: true },
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
                    <Flex align={'center'}>
                        <Title size={'20px'}>
                            {capitalize(currentValue)}
                        </Title>

                        <Card style={{ borderRadius: 300 }} p={"6px 16px"} ml={'auto'} shadow="xs">
                            <Flex gap={8} align={'center'} justify={'center'}>
                                <Text size={'14px'}>
                                    {`Hello, ${animatedNickname}`}
                                </Text>
                                <a href={'/api/auth/logout'}>
                                    <ActionIcon variant="subtle">
                                        <IconLogout />
                                    </ActionIcon>
                                </a>
                            </Flex>
                        </Card>
                    </Flex>
                    <Box mt={36}>
                        {children}
                    </Box>
                </AppShell.Main>
            </AppShell>
        </Tabs>
    )
}
