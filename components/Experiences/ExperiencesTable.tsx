'use client';

import React, { useContext, useState } from 'react';
import {
  ActionIcon,
  Card,
  Flex,
  Input,
  Loader,
  Select,
  Table,
  Title,
  Text,
  Button,
  ScrollArea,
} from '@mantine/core';
import { IconHandStop, IconLollipop, IconPencil, IconSearch, IconTrash } from '@tabler/icons-react';
import { StoreContext } from '@/store/context';
import { EditExperience } from './EditExperience';
import { Column } from '../Layout/Column';
import { SearchBar } from '../Atoms/SearchBar';
import { ExperienceType } from '@/constants';
import { Circle } from '../Atoms/Circle';
import { Row } from '../Layout/Row';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export function ExperiencesTable() {
  const [{ experiences, experiencesLoading }, setStore] = useContext(StoreContext);

  const [search, setSearch] = useState('');

  const filteredExperiences = experiences
    .filter((experience) => {
      return (
        experience.createdBy.toLowerCase().includes(search.toLowerCase()) ||
        experience.createdByEmail.toLowerCase().includes(search.toLowerCase()) ||
        experience.selectedParticipants[0].email.toLowerCase().includes(search.toLowerCase()) ||
        experience.selectedParticipants[0].sex.toLowerCase().includes(search.toLowerCase()) ||
        experience.selectedParticipants[0].name.toLowerCase().includes(search.toLowerCase()) ||
        experience.selectedParticipants[1].email.toLowerCase().includes(search.toLowerCase()) ||
        experience.selectedParticipants[1].sex.toLowerCase().includes(search.toLowerCase()) ||
        experience.selectedParticipants[1].name.toLowerCase().includes(search.toLowerCase()) ||
        ExperienceType.Hands.toLowerCase().includes(search.toLowerCase()) && experience.experienceType.includes(ExperienceType.Hands) ||
        ExperienceType.Pendulum.toLowerCase().includes(search.toLowerCase()) && experience.experienceType.includes(ExperienceType.Pendulum)
      );
    })


  const rows = filteredExperiences.map((experience) => {
    const {
      uniqueId,
      createdBy,
      selectedParticipants,
      date,
      experienceType,
      historyLength,
      rateOfTesting,
      avgSyncHands,
      avgSyncPendulum
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
              {avgSyncHands.toFixed(2)}%
            </Text>
            {experienceType.includes(ExperienceType.Hands) && <IconHandStop stroke={1.1} />}
            {experienceType.includes(ExperienceType.Pendulum) && (
              <Row>
                <IconLollipop style={{ transform: 'rotate(180deg)' }} stroke={1} />
                <Text size={'sm'}>
                  {avgSyncPendulum.toFixed(2)}%
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
          <Link href={`experiences/${uniqueId}`}>
            <Button>
              Explore
            </Button>
          </Link>
        </Table.Td>
      </Table.Tr>
    )
  });


  return (
    <Flex direction="column" w="100%">
      <Flex align="flex-end">
        <SearchBar
          onChange={(event) => setSearch(event.currentTarget.value)}
          currentNumber={filteredExperiences.length}
          totalNumber={experiences.length}
          searchingFor={'Experience'}
        />
      </Flex>
      <Card mt={16} shadow="xs">
        <Flex justify="space-between" align="center">
          <Title size="16px">Sessions</Title>
        </Flex>
        {experiencesLoading ? (
          <Column align={'center'} justify={'center'} mih={200}>
            <Loader />
          </Column>
        ) : (
          <ScrollArea>
            <Table miw={920} mt={20}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Created By</Table.Th>
                  <Table.Th>Participant 1</Table.Th>
                  <Table.Th>Participant 2</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Avg Sync</Table.Th>
                  <Table.Th>History</Table.Th>
                  <Table.Th>Overview</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Card>
    </Flex>
  );
}
