'use client';

import { ActionIcon, Card, Flex, Group, Input, Select, Table, Text, Title } from '@mantine/core';
import { IconPencil, IconSearch, IconTrash } from '@tabler/icons-react';
import { EditExperience } from './EditExperience';

export function ExperiencesTable() {
  const elements = [
    {
      date: '27/3/24',
      level: '74',
      participant2: 'itay45977@gmail.com',
      participant1: 'ohad@gmail.com',
    },
    {
      date: '30/3/24',
      level: '69',
      participant2: 'nikol@gmail.com',
      participant1: 'noam@gmail.com',
    },
    {
      date: '31/3/24',
      level: '40',
      participant2: 'ilan@gmail.com',
      participant1: 'jecki@gmail.com',
    },
  ];

  const rows = elements.map((element) => (
    <Table.Tr flex="col" key={element.participant1}>
      <Table.Td>{element.participant1}</Table.Td>
      <Table.Td>{element.participant2}</Table.Td>
      <Table.Td>{element.level}</Table.Td>
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
    <Flex direction="column" w="100%">
      <Flex align="flex-end">
        <Input.Wrapper label="7/221 Displayed">
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

        <Input.Wrapper ml="auto" label="Sort by">
          <Select data={['Last Experience (Increasing)']} value="Last Experience (Increasing)" />
        </Input.Wrapper>
      </Flex>
      <Card mt={16} shadow="xs">
        <Title size="16px">Sessions</Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Participant 1</Table.Th>
              <Table.Th>Participant 2</Table.Th>
              <Table.Th>Level of Synchronization</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Edit</Table.Th>
              <Table.Th>Delete</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Card>
      <EditExperience />
    </Flex>
  );
}
