import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Select, Button, Divider, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Participant } from '@/types';


interface NewParticipantProps {
    loading: boolean;
    disclosure: ReturnType<typeof useDisclosure>;
    onCreateParticipant: (participant: Participant) => void;
    initialValues?: Participant
}

export function NewParticipant({ loading, disclosure, onCreateParticipant, initialValues }: NewParticipantProps) {
    const [opened, { close }] = disclosure;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [sex, setSex] = useState<string | null>('');
    const [error, setError] = useState<string | null>('');

    // Set initial values if editing (on component mount)
    useEffect(() => {
        if (initialValues) {
            setName(initialValues.name);
            setEmail(initialValues.email);
            setSex(initialValues.sex);
        }
    }, [initialValues]);

    // Create a new participant on button click
    const handleCreateParticipant = () => {
        if (!name || !email || !sex) {
            setError('Please fill out all required fields');
            return;
        }

        const newParticipant = {
            name,
            email,
            sex,
        };
        onCreateParticipant(newParticipant as Participant);
        setName('');
        setEmail('');
        setSex('');
        setError('');
    };

    return (
        <Modal title="New Participant" size="lg" onClose={close} opened={opened}>
            <Divider mb={10} />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Flex direction="column" align='center' justify={'center'}>
                    <TextInput
                        label="Name:"
                        value={name}
                        onChange={(event) => setName(event.currentTarget.value)}
                        placeholder="Enter name"
                        required
                        error={error && !name}
                        mb={10}
                        w="40%"
                    />
                    <TextInput
                        label="Email:"
                        value={email}
                        onChange={(event) => setEmail(event.currentTarget.value)}
                        placeholder="Enter email"
                        type="email"
                        required
                        error={error && !email}
                        mb={10}
                        w="40%"
                    />
                    <Select
                        label="Sex:"
                        value={sex}
                        onChange={(value) => setSex(value)}
                        data={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                        ]}
                        w="40%"
                        placeholder="Select sex"
                        required
                        error={error && !sex}
                        mb={10}
                    />
                    {error && (
                        <Flex justify="center" mb={10} style={{ color: 'red' }}>
                            {error}
                        </Flex>
                    )}
                    <Flex justify="center" mt={25}>
                        <Button onClick={handleCreateParticipant}>
                            {initialValues ? 'Update Participant' : 'Create Participant'}
                        </Button>
                    </Flex>
                </Flex>
            )}
        </Modal>
    );
}
