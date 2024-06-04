import React, { useContext, useState } from 'react';
import { ActionIcon, Card, Flex, Input, Select, Table, Button, Title } from '@mantine/core';
import { IconPencil, IconSearch, IconTrash } from '@tabler/icons-react';
import { StoreContext } from '@/store/context';
import { useDisclosure } from '@mantine/hooks';
import { NewParticipant } from './NewParticipant';

export function ParticipantsTable() {
  const [store, setStore] = useContext(StoreContext);
  const [opened, { open, close, toggle }] = useDisclosure(false);
  const [editParticipant, setEditParticipant] = useState(null);

  const handleCreateParticipant = (participant) => {
    const newParticipant = {
      ...participant,
      lastExperience: editParticipant ? editParticipant.lastExperience : '-',
    };

    if (editParticipant) {
      // Update existing participant
      setStore((prevState) => {
        const updatedStore = {
          ...prevState,
          participants: prevState.participants.map(p =>
            p.email === editParticipant.email ? newParticipant : p
          ),
        };
        console.log('Store after update:', updatedStore);
        return updatedStore;
      });
    } else {
      // Add new participant
      setStore((prevState) => {
        const updatedStore = {
          ...prevState,
          participants: [...prevState.participants, newParticipant],
        };
        console.log('Store after add:', updatedStore);
        return updatedStore;
      });
    }

    close();
    setEditParticipant(null);
  };

  const handleEditClick = (participant) => {
    setEditParticipant(participant);
    open();
  };

  const handleDeleteClick = (email) => {
    setStore((prevState) => {
      const updatedStore = {
        ...prevState,
        participants: prevState.participants.filter(p => p.email !== email),
      };
      console.log('Store after delete:', updatedStore);
      return updatedStore;
    });
  };

  const rows = store.participants.map((element) => (
    <Table.Tr key={element.email}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>{element.sex}</Table.Td>
      <Table.Td>{element.lastExperience}</Table.Td>
      <Table.Td>
        <ActionIcon variant="subtle" onClick={() => handleEditClick(element)}>
          <IconPencil color="blue" />
        </ActionIcon>
      </Table.Td>
      <Table.Td>
        <ActionIcon variant="subtle" onClick={() => handleDeleteClick(element.email)}>
          <IconTrash color="red" />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Flex align={'flex-end'}>
        <Input.Wrapper label={'7/159 Displayed'}>
          <Input
            w={'100%'}
            maw={360}
            leftSection={
              <ActionIcon variant="subtle">
                <IconSearch />
              </ActionIcon>
            }
            styles={{ input: { borderRadius: 300 } }}
            placeholder={'Search for a Participant...'}
          />
        </Input.Wrapper>

        <Input.Wrapper ml={'auto'} label={'Sort by'}>
          <Select data={['Last Experience']} value={'Last Experience'} />
        </Input.Wrapper>
      </Flex>
      <Card mt={16} shadow="xs">
        <Flex justify="space-between" align="center">
          <Title size="16px">Accounts</Title>
          <Button onClick={open}>Add Participant</Button>
        </Flex>
        <Table mt={20}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Sex</Table.Th>
              <Table.Th>Last Experience</Table.Th>
              <Table.Th>Edit</Table.Th>
              <Table.Th>Delete</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Card>
      <NewParticipant
        disclosure={[opened, { open, close, toggle }]}
        onCreateParticipant={handleCreateParticipant}
        initialValues={editParticipant} // Pass initial values if editing
      />
    </>
  );
}
