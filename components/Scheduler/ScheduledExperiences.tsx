'use client';
import { ActionIcon, Card, Flex, Group, Input, Select, Table, Text, Title, Button } from '@mantine/core';
import { IconPencil, IconSearch, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Configuration } from './Configuration';
import { StoreContext } from '@/store/context';
import { useContext } from 'react';

export function ScheduledExperiences() {
    const [store, setStore] = useContext(StoreContext);
    const [opened, { open, close, toggle }] = useDisclosure(false);

    const rows = store.scheduled.map((element) => (
        <Table.Tr flex="col" key={element.createdBy}>
            <Table.Td>{element.createdBy}</Table.Td>
            <Table.Td>{element.participant1}</Table.Td>
            <Table.Td>{element.participant2}</Table.Td>
            <Table.Td>{element.date}</Table.Td>
            <Table.Td>
                <ActionIcon variant="subtle">
                    <IconPencil color="blue" />
                </ActionIcon>

            </Table.Td>
            <Table.Td>
                <ActionIcon variant="subtle">
                    <IconTrash color="red" />
                </ActionIcon>
            </Table.Td>
        </Table.Tr>
    ));
    return (
        <>
            <Flex align="flex-end">
                <Input.Wrapper label="3/8 Displayed">
                    <Input
                        w={450}
                        maw={450}
                        leftSection={
                            <ActionIcon variant="subtle">
                                <IconSearch />
                            </ActionIcon>
                        }
                        styles={{ input: { borderRadius: 300 } }}
                        placeholder="Search for an Experience..."
                    />
                </Input.Wrapper>

            </Flex>
            <Card mt={16} shadow="xs">
                <Flex>
                    <Title size="20px" mb={10}>Scheduled Experiences</Title>
                    <Button onClick={open} ml="auto">
                        Schedule New Experience
                    </Button>
                </Flex>

                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Created By</Table.Th>
                            <Table.Th>Participant 1</Table.Th>
                            <Table.Th>Participant 2</Table.Th>
                            <Table.Th>Date</Table.Th>
                            <Table.Th>Edit</Table.Th>
                            <Table.Th>Delete</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Card>
            <Configuration disclosure={[opened, { open, close, toggle }]} />
        </>
    );
}
