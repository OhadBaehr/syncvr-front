import { INote } from "@/types";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button, Input, Modal, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { Dispatch, SetStateAction, useRef } from "react";
import { v4 as uuid } from "uuid";
import { showNotification } from "@mantine/notifications";

interface EditNoteProps {
    initialValues?: INote | undefined
    disclosure: ReturnType<typeof useDisclosure>
    uniqueId: string
    setNotes: Dispatch<SetStateAction<INote[]>>
}

export function EditNote({ disclosure, initialValues, uniqueId, setNotes }: EditNoteProps) {
    const { user } = useUser();
    const [opened, { close }] = disclosure;
    const textRef = useRef<HTMLTextAreaElement>(null)

    function handleSave() {
        if (initialValues) {
            axios.put(`/api/notes`, {
                content: textRef.current?.value,
                date: new Date(),
                noteId: initialValues.noteId,
            }).then(() => {
                setNotes(prev => prev.map(note => note.noteId === initialValues.noteId ? { ...note, content: textRef.current!.value } : note))
                showNotification({ message: 'Note updated successfully!', color: 'green' });
            }).catch(() => {
                showNotification({ message: 'Failed to update note. Please try again.', color: 'red' });
            })
        } else {
            axios.post('/api/notes', {
                content: textRef.current?.value,
                date: new Date(),
                noteId: uuid(),
                author: {
                    name: user!.name,
                    email: user!.email
                },
                uniqueId
            }).then(() => {
                setNotes(prev => [...prev, {
                    author: {
                        name: user!.name as string,
                        email: user!.email as string
                    },
                    uniqueId,
                    content: textRef.current!.value,
                    date: new Date().getTime().toString(),
                    noteId: uuid(),
                }])
                showNotification({ message: 'Note created successfully!', color: 'green' });
            }).catch(() => {
                showNotification({ message: 'Failed to create note. Please try again.', color: 'red' });
            })
        }
        close()
    }
    return (
        <Modal title={`${initialValues ? 'New Note' : "Note Update"} `} onClose={close} opened={opened}>
            <Textarea ref={textRef} defaultValue={initialValues?.content} styles={{ input: { minHeight: 400 } }} placeholder="What are your findings?" />
            <Button onClick={handleSave} w={'100%'} mt={8}>
                Save
            </Button>
        </Modal>
    )
}