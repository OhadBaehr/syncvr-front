'use client';
import { ActionIcon, Card, Flex, Table, Text, Title, Button } from '@mantine/core';
import { IconHandStop, IconLollipop, IconPencil, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Configuration } from './Configuration';
import { StoreContext } from '@/store/context';
import { useContext, useState } from 'react';
import { Circle } from '../Atoms/Circle';
import { Row } from '../Layout/Row';
import { SearchBar } from '../Atoms/SearchBar';
import { ExperienceType } from '@/constants';
import { ScheduledExperience } from '@/types';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';

export function ScheduledExperiences() {
    const [{ scheduled }, setStore] = useContext(StoreContext);
    const [opened, { open, close, toggle }] = useDisclosure(false);
    const [search, setSearch] = useState('');
    const [editScheduled, setEditScheduled] = useState<ScheduledExperience | undefined>();
    const [loading, setLoading] = useState(false);

    const handleEditClick = (scheduledExperience: ScheduledExperience) => {
        setEditScheduled(scheduledExperience);
        open();
    };

    const filteredScheduled = scheduled
        .filter((scheduledExperience) => {
            return (
                scheduledExperience.createdBy.toLowerCase().includes(search.toLowerCase()) ||
                scheduledExperience.createdByEmail.toLowerCase().includes(search.toLowerCase()) ||
                scheduledExperience.selectedParticipants[0].email.toLowerCase().includes(search.toLowerCase()) ||
                scheduledExperience.selectedParticipants[0].sex.toLowerCase().includes(search.toLowerCase()) ||
                scheduledExperience.selectedParticipants[0].name.toLowerCase().includes(search.toLowerCase()) ||
                scheduledExperience.selectedParticipants[1].email.toLowerCase().includes(search.toLowerCase()) ||
                scheduledExperience.selectedParticipants[1].sex.toLowerCase().includes(search.toLowerCase()) ||
                scheduledExperience.selectedParticipants[1].name.toLowerCase().includes(search.toLowerCase()) ||
                ExperienceType.Hands.toLowerCase().includes(search.toLowerCase()) && scheduledExperience.experienceType.includes(ExperienceType.Hands) ||
                ExperienceType.Pendulum.toLowerCase().includes(search.toLowerCase()) && scheduledExperience.experienceType.includes(ExperienceType.Pendulum)
            );
        })

    const handleCreateSchedule = (scheduledExperience: ScheduledExperience) => {
        axios.post('/api/scheduled', scheduledExperience)
          .then(() => {
            setStore(prev=>({...prev, scheduled: [...prev.scheduled, scheduledExperience]}))
            showNotification({ message: 'Experience created successfully!', color: 'green' });
            close();
          })
          .catch(() => {
            showNotification({ message: 'Failed to create experience. Please try again.', color: 'red' });
          });
    }

    const rows = filteredScheduled.map((experience) => {
        const {
            uniqueId,
            createdBy,
            selectedParticipants,
            date,
            phaseDuration,
            experienceType,
            historyLength,
            rateOfTesting,
            highSync,
            lowSync,
            pendulumRotation,
            highSyncColor,
            midSyncColor,
            lowSyncColor
        } = experience;
        return (
            <Table.Tr flex="col" key={uniqueId}>
                <Table.Td>{createdBy}</Table.Td>
                <Table.Td>{selectedParticipants[0].name}</Table.Td>
                <Table.Td>{selectedParticipants[1].name}</Table.Td>
                <Table.Td>
                    {new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    {', '}
                    {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </Table.Td>
                <Table.Td>
                    <Row align={'center'} gap={4}>
                        <Text size={'sm'}>
                            {phaseDuration}s
                        </Text>
                        {experienceType.includes(ExperienceType.Hands) && <IconHandStop stroke={1.1} />}
                        {experienceType.includes(ExperienceType.Pendulum) && (
                            <Row>
                                <IconLollipop style={{ transform: 'rotate(180deg)' }} stroke={1} />
                                <Text fw={500} size={'xs'}>
                                    {pendulumRotation}°
                                </Text>
                            </Row>
                        )}
                    </Row>
                </Table.Td>
                <Table.Td>
                    <Text fw={500} size={'sm'}>
                        {`${historyLength} x ${rateOfTesting / 1000} ms`}
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Row align={'center'} gap={4}>
                        {lowSync}
                        <Circle color={lowSyncColor} />

                        <Circle color={midSyncColor} />

                        <Circle color={highSyncColor} />
                        {highSync}
                    </Row>
                </Table.Td>
                <Table.Td>
                    <ActionIcon onClick={()=>handleEditClick(experience)} variant="subtle">
                        <IconPencil color="blue" />
                    </ActionIcon>
                </Table.Td>
                <Table.Td>
                    <ActionIcon variant="subtle">
                        <IconTrash color="red" />
                    </ActionIcon>
                </Table.Td>
            </Table.Tr>
        )
    });
    return (
        <>
            <Flex align="flex-end">
                <SearchBar
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    currentNumber={filteredScheduled.length}
                    totalNumber={scheduled.length}
                    searchingFor='Scheduled Experience'
                />
            </Flex>
            <Card mt={16} shadow="xs">
                <Flex>
                    <Title size="16px" mb={10}>Scheduled Experiences</Title>
                    <Button onClick={open} ml="auto">
                        Schedule New Experience
                    </Button>
                </Flex>
                <Table mt={20}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Created By</Table.Th>
                            <Table.Th>Participant 1</Table.Th>
                            <Table.Th>Participant 2</Table.Th>
                            <Table.Th>Date</Table.Th>
                            <Table.Th>Mode</Table.Th>
                            <Table.Th>History</Table.Th>
                            <Table.Th>Sync Level</Table.Th>
                            <Table.Th>Edit</Table.Th>
                            <Table.Th>Delete</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Card>
            <Configuration 
                loading={loading}
                disclosure={[opened, { open, close, toggle }]}
                onCreateSchedule={handleCreateSchedule}
                initialValues={editScheduled}
            />
        </>
    );
}
