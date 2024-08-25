'use client';
import { ActionIcon, Card, Flex, Table, Text, Title, Button, Loader, ScrollArea } from '@mantine/core';
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
import { debounce, set, throttle } from 'lodash';
import { Column } from '../Layout/Column';
import { formatDate } from '@/lib/utils';

export function SchedulerTable() {
    const [{ scheduled, schedulerLoading }, setStore] = useContext(StoreContext);
    const [opened, { open, close, toggle }] = useDisclosure(false);
    const [search, setSearch] = useState('');
    const [editScheduled, setEditScheduled] = useState<ScheduledExperience | undefined>();
    const [loading, setLoading] = useState(false);

    // Open the modal to edit a scheduled experience
    const handleEditClick = (scheduledExperience: ScheduledExperience) => {
        setEditScheduled(scheduledExperience);
        open();
    };

    // Filter scheduled experiences based on search input
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

    // Create a new scheduled experience or update an existing one, with debouncing and throttling to prevent multiple requests
    const handleCreateSchedule = debounce(throttle((scheduledExperience: ScheduledExperience) => {
        if (loading) return;
        setLoading(true);

        const handleSuccess = (message: string) => {
            setStore(prev => ({
                ...prev,
                scheduled: editScheduled
                    ? prev.scheduled.map((exp) => exp.uniqueId === editScheduled.uniqueId ? scheduledExperience : exp)
                    : [scheduledExperience, ...prev.scheduled]
            }));
            showNotification({ message, color: 'green' });
            close();
            setLoading(false);
            setEditScheduled(undefined);
        };

        const handleError = (message: string) => {
            showNotification({ message, color: 'red' });
            setLoading(false);
        };

        if (editScheduled) {
            axios.put(`/api/scheduled`, scheduledExperience)
                .then(() => handleSuccess('Experience updated successfully!'))
                .catch(() => handleError('Failed to update experience. Please try again.'));
        } else {
            axios.post('/api/scheduled', scheduledExperience)
                .then(() => handleSuccess('Experience created successfully!'))
                .catch(() => handleError('Failed to create experience. Please try again.'));
        }
    }, 5000), 300);

    // Open the modal to create a new scheduled experience
    const handleOpen = () => {
        setEditScheduled(undefined);
        open();
    }


    // Delete a scheduled experience
    const deleteScheduled = (scheduledExperience: ScheduledExperience) => {
        axios.delete(`/api/scheduled`, {
            params: { uniqueId: scheduledExperience.uniqueId }
        })
            .then(() => {
                setStore(prev => ({
                    ...prev,
                    scheduled: prev.scheduled.filter(exp => exp.uniqueId !== scheduledExperience.uniqueId)
                }));
                showNotification({ message: 'Experience deleted successfully!', color: 'green' });
            })
            .catch(() => {
                showNotification({ message: 'Failed to delete experience. Please try again.', color: 'red' });
            });
    };

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
            lowSyncColor,
            sessionId
        } = experience;
        return (
            <Table.Tr flex="col" key={uniqueId}>
                <Table.Td>{createdBy}</Table.Td>
                <Table.Td>{selectedParticipants[0].name}</Table.Td>
                <Table.Td>{selectedParticipants[1].name}</Table.Td>
                <Table.Td>
                    {formatDate(date)}
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
                <Table.Td>{sessionId}</Table.Td>
                <Table.Td>
                    <ActionIcon onClick={() => handleEditClick(experience)} variant="subtle">
                        <IconPencil color="blue" />
                    </ActionIcon>
                </Table.Td>
                <Table.Td>
                    <ActionIcon onClick={() => deleteScheduled(experience)} variant="subtle">
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
                    <Button disabled={scheduled.length >= 100} onClick={handleOpen} ml="auto">
                        Schedule New Experience
                    </Button>
                </Flex>
                {schedulerLoading ? (
                    <Column align={'center'} justify={'center'} mih={200}>
                        <Loader />
                    </Column>
                ) : (
                    <ScrollArea>
                        <Table miw={1000} mt={20}>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Created By</Table.Th>
                                    <Table.Th>Participant 1</Table.Th>
                                    <Table.Th>Participant 2</Table.Th>
                                    <Table.Th>Date</Table.Th>
                                    <Table.Th>Mode</Table.Th>
                                    <Table.Th>History</Table.Th>
                                    <Table.Th>Sync Level</Table.Th>
                                    <Table.Th>Session ID</Table.Th>
                                    <Table.Th>Edit</Table.Th>
                                    <Table.Th>Delete</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </ScrollArea>
                )}

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
