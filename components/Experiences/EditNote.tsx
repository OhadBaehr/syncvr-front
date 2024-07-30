import { INote } from "@/types";
import { Button, Input, Modal, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { showNotification } from "@mantine/notifications";
import { useUserWithFallback } from "@/lib/useUserWithFallback";

interface EditNoteProps {
    initialValues?: INote | undefined
    disclosure: ReturnType<typeof useDisclosure>
    uniqueId: string
    setNotes: Dispatch<SetStateAction<INote[]>>
}

export function EditNote({ disclosure, initialValues, uniqueId, setNotes }: EditNoteProps) {
    const { user } = useUserWithFallback();
    const [opened, { close }] = disclosure;
    const [content, setContent] = useState(initialValues?.content || '');

    function handleSave() {
        if (!content) return showNotification({ message: 'Note cannot be empty.', color: 'red' })
        if (initialValues) {
            axios.put(`/api/notes`, {
                content,
                date: new Date(),
                noteId: initialValues.noteId,
            }).then(() => {
                setNotes(prev => prev.map(note => note.noteId === initialValues.noteId ? { ...note, content } : note))
                showNotification({ message: 'Note updated successfully!', color: 'green' });
            }).catch(() => {
                showNotification({ message: 'Failed to update note. Please try again.', color: 'red' });
            })
        } else {
            const noteId = uuid()
            axios.post('/api/notes', {
                content,
                date: new Date(),
                noteId: noteId,
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
                    content,
                    date: new Date().toString(),
                    noteId: noteId,
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
            <Textarea onChange={(e) => setContent(e.target.value)} defaultValue={initialValues?.content} styles={{ input: { minHeight: 400 } }} placeholder="What are your findings?" />
            <Button onClick={handleSave} w={'100%'} mt={8}>
                Save
            </Button>
        </Modal>
    )
}