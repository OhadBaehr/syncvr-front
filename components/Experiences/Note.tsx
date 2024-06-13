'use client';
import { ActionIcon, Card, Flex, Group, Text, Title } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import type { INote } from '@/types';

interface NoteProps {
    note: INote
    onEdit: (note: INote) => void
    onDelete: (note: INote) => void
}

export function Note({ note, onEdit, onDelete }: NoteProps) {

    const { author, content, date } = note;
    const time = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' - ' + new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

    return (
        <Card w="100%">
            <Flex mb={5} justify="space-between">
                <Title size="14px" style={{ textDecoration: 'underline' }}>{`${time}, Researcher ${author.name}:`}</Title>
                <Group style={{ marginLeft: 'auto' }} gap="xs">
                    <ActionIcon onClick={() => onEdit(note)} variant="subtle" size="sm">
                        <IconPencil color="blue" />
                    </ActionIcon>
                    <ActionIcon onClick={() => onDelete(note)} variant="subtle" size="sm">
                        <IconTrash color="red" />
                    </ActionIcon>
                </Group>
            </Flex>
            <Text style={{ fontSize: '12px' }}>{content}</Text>
        </Card>
    );
}
