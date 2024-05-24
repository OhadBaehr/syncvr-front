'use client';
import { ActionIcon, Card, Flex, Group, Text, Title } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';

export function Note() {
    return (
        <Card w="100%">
            <Flex mb={5} justify="space-between">
                <Title size="14px" style={{ textDecoration: 'underline' }}>01/04/24 - 16:28, Researcher Michal Rinott:</Title>
                <Group style={{ marginLeft: 'auto' }} gap="xs">
                    <ActionIcon variant="subtle" size="sm">
                        <IconPencil color="blue" />
                    </ActionIcon>
                    <ActionIcon variant="subtle" size="sm">
                        <IconTrash color="red" />
                    </ActionIcon>
                </Group>
            </Flex>
            <Text style={{ fontSize: '12px' }}>The analysis is not accurate, it seems like they’ve connected more than 70%.</Text>
        </Card>
    );
}
