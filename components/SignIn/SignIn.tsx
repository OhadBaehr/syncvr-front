'use client'
import { ActionIcon, Image, Button, Badge, Card, Container, Flex, Group, Menu, rem, Text, Input, Radio, Checkbox } from '@mantine/core';
import { IconDots, IconFileZip, IconEye, IconTrash, IconBrandGoogle, IconBrandGoogleFilled } from '@tabler/icons-react';
import Link from 'next/link';

export function SignIn() {
    return (

        <Flex style={{ height: "100vh", width: "100vw" }}>
            <Card m={'auto'} w={"100%"} maw={560} shadow="sm" padding="xl" radius="md" withBorder>
                <Flex justify={'center'}>
                    <Button leftSection={<IconBrandGoogleFilled />} w={'100%'} variant='light'>
                        Sign in with Google
                    </Button>
                </Flex >
                <Flex mt={16} direction='column' gap={16}>
                    <Input.Wrapper label="Email" required={true}>
                        <Input placeholder='mail@mail.com' />
                    </Input.Wrapper>
                    <Input.Wrapper label="Password" required={true}>
                        <Input placeholder='Min. 8 characters' type='password' rightSection={
                            <ActionIcon variant='subtle'>
                                <IconEye />
                            </ActionIcon>
                        } />
                    </Input.Wrapper>
                    <Flex justify={'space-between'} align={'center'}>
                        <Checkbox label="Keep me logged in" />
                        <Link style={{ textDecoration: "none" }} href="/forgot-password">
                            <Text size='14px'>
                                Forgot password?
                            </Text>
                        </Link>
                    </Flex>
                    <Button w={'100%'}>
                        Sign in
                    </Button>
                    <Flex gap={8}>
                        <Text size='14px'>
                            Don't have an account?
                        </Text>
                        <Link style={{ textDecoration: "none" }} href="/register">
                            <Text size='14px'>
                                Sign up now!
                            </Text>
                        </Link>
                    </Flex>
                </Flex>
            </Card>
        </Flex>
    )
}
