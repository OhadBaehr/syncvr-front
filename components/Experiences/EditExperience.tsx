'use client'
import React, { useContext, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Label
} from 'recharts';
import { Title, Card, Input, Select, Flex, Button } from '@mantine/core';
import { Note } from './Note';
import { StoreContext } from '@/store/context';
import { ExperienceType } from '@/constants';
import { redirect, useParams, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import axios from 'axios';
import { INote } from '@/types';
import { useDisclosure } from '@mantine/hooks';
import { EditNote } from './EditNote';
import { showNotification } from '@mantine/notifications';


export function EditExperience() {
  const searchParams = useParams();
  const { uniqueId } = searchParams
  const [{ experiences, experiencesLoading }] = useContext(StoreContext);
  const [mode, setMode] = useState(ExperienceType.Hands);
  const disclosure = useDisclosure(false);
  const [opened, { open, close, toggle }] = disclosure

  const [notes, setNotes] = useState<INote[]>([]);
  const [editNote, setEditNote] = useState<INote | undefined>(undefined)

  useSWR<INote[]>(`/api/notes?uniqueId=${uniqueId}`, (url: string) => axios.get(url).then(res => res.data), {
    onSuccess: (data) => {
      setNotes(data);
    }
  });

  const thisExperience = experiences.find(experience => experience.uniqueId === uniqueId)

  if (!thisExperience) return

  const {
    date,
    selectedParticipants
  } = thisExperience



  const handleModeChange = (value: ExperienceType) => {
    setMode(value);
  };


  const selectOptions = [ExperienceType.Hands, ExperienceType.Pendulum].map((option) => ({
    label: option,
    value: option,
    disabled: option === mode,
  }));

  // const algoOptions = ['Pearson', 'Spearman', 'Third'].map((option) => ({
  //   label: option,
  //   value: option,
  //   disabled: option === syncAlgo,
  // }));

  function onEditNote(note: INote) {
    setEditNote(note)
    open()
  }

  function onDeleteNote(note: INote) {
    axios.delete(`/api/notes?noteId=${note.noteId}`).then(() => {
      setNotes(prev => prev.filter(note => note.noteId !== note.noteId))
      showNotification({ message: 'Note deleted successfully!', color: 'green' });
    }).catch(() => {
      showNotification({ message: 'Failed to delete note. Please try again.', color: 'red' });
    })
  }

  const dateStr = new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) + ', ' + new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
  return (
    <>
      <Title mt={10} mb={20} size="20px">
        {`${selectedParticipants[0].name} & ${selectedParticipants[1].name} - ${dateStr}`}
      </Title>
      <Flex wrap="wrap" gap={24}>
        <Flex flex={1} direction="column">
          <Card mr={5} mb={20}>
            <Title size="16px" order={2}>
              Synchronization Over Time
            </Title>
            <Flex align="center" mb={10}>
              <Input.Wrapper ml="auto" label="Mode">
                <Select data={selectOptions} value={mode} onChange={(mode => handleModeChange(mode as ExperienceType))} />
              </Input.Wrapper>
              {/* <Input.Wrapper ml={10} label="Synchronization Algorithm">
                <Select data={algoOptions} value={syncAlgo} onChange={handleSyncAlgoChange} />
              </Input.Wrapper> */}
            </Flex>
            {/* <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={synclevel} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  interval={0}
                  label={{
                    value: 'Time',
                    position: 'insideBottom',
                    offset: -10,
                    dy: 10,
                    style: { textAnchor: 'middle' },
                  }}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  label={{
                    value: 'Level of synchronization',
                    angle: -90,
                    position: 'insideLeft',
                    dx: -30,
                    style: { textAnchor: 'middle' },
                  }}
                />
                <Tooltip />
                <Area type="monotone" dataKey="level" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer> */}
          </Card>
          <Card>
            <Title size="16px" order={2}>
              Interpersonal Connection Forms
            </Title>
            {/* <ResponsiveContainer width="100%" height={500}>
              <BarChart data={personalForms} margin={{ bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="question"
                  label={{
                    value: 'Question',
                    offset: 0,
                    position: 'insideBottom',
                    dy: 20,
                  }}
                  tickFormatter={(value) => `q${value.slice(1)}`}
                />
                <YAxis
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  label={{
                    value: 'Score',
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' },
                  }}
                />
                <Tooltip />
                <Legend verticalAlign="top" align="right" height={36} />
                <Bar dataKey="answer1" fill="#8884d8" name="Itay" />
                <Bar dataKey="answer2" fill="#82ca9d" name="Ohad" />
              </BarChart>
            </ResponsiveContainer> */}
          </Card>
        </Flex>
        <Card miw={440}>
          <Flex justify="space-between" align="center" style={{ marginBottom: '10px' }}>
            <Title size="16px" order={2}>
              Notes
            </Title>
          </Flex>
          {notes?.map(note => <Note onDelete={onDeleteNote} onEdit={onEditNote} key={note.noteId} note={note} />)}
          <Flex justify="center">
            <Button onClick={() => {
              setEditNote(undefined)
              open()
            }} w="90%">Add Note</Button>
          </Flex>
        </Card>
        <EditNote initialValues={editNote} disclosure={disclosure} uniqueId={uniqueId as string} setNotes={setNotes} />
      </Flex>
    </>
  );
}
