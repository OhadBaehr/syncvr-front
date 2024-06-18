'use client'
import React, { useContext, useEffect, useState } from 'react';
import { Title, Card, Input, Select, Flex, Button, Box, Text } from '@mantine/core';
import { Note } from './Note';
import { StoreContext } from '@/store/context';
import { ExperienceType } from '@/constants';
import { redirect, useParams, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import axios from 'axios';
import { ChartData, Feedback, INote, Participant } from '@/types';
import { useDisclosure } from '@mantine/hooks';
import { EditNote } from './EditNote';
import { showNotification } from '@mantine/notifications';
import { AreaChart, AreaChartSeries, BarChart } from '@mantine/charts';


export function EditExperience() {
  const searchParams = useParams();
  const { uniqueId } = searchParams
  const [{ experiences, experiencesLoading, participants }] = useContext(StoreContext);
  const [mode, setMode] = useState(ExperienceType.Hands);
  const disclosure = useDisclosure(false);
  const [opened, { open, close, toggle }] = disclosure

  const [notes, setNotes] = useState<INote[]>([]);
  const [editNote, setEditNote] = useState<INote | undefined>(undefined)
  const [feedbackP1, setFeedbackP1] = useState<Feedback | null>(null);
  const [feedbackP2, setFeedbackP2] = useState<Feedback | null>(null);
  const [participant1, setParticipant1] = useState<Participant | undefined>(undefined)
  const [participant2, setParticipant2] = useState<Participant | undefined>(undefined)

  useSWR<INote[]>(`/api/notes?uniqueId=${uniqueId}`, (url: string) => axios.get(url).then(res => res.data), {
    onSuccess: (data) => {
      setNotes(data);
    }
  });


  useSWR<Feedback[]>(`/api/feedback?uniqueId=${uniqueId}`, (url: string) => axios.get(url).then(res => res.data), {
    onSuccess: (data) => {
      setFeedbackP1(data[0]);
      setFeedbackP2(data[1]);
    }
  });

  useEffect(() => {
    if (feedbackP1) {
      setParticipant1(participants.find(participant => participant.email === feedbackP1.email))
    }
    if (feedbackP2) {
      setParticipant2(participants.find(participant => participant.email === feedbackP2.email))
    }
  }, [feedbackP1, feedbackP2, participants])

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


  function normalizeData() {
    if (!feedbackP1 || !participant1?.name) return
    const dataType = mode === ExperienceType.Pendulum ? 'synchronizationPendulum' : 'synchronizationHands'
    const data: (Record<string, string> & { time: string })[] = []

    if (!feedbackP2 || !participant2?.name) {
      for (let i = 0; i < feedbackP1[dataType].length; i++) {
        data.push({ time: feedbackP1[dataType][i].time.toFixed(3), [participant1.name]: feedbackP1[dataType][i].value.toFixed(3) })
      }
    } else {
      const length = Math.min(feedbackP1[dataType].length, feedbackP2[dataType].length)
      for (let i = 0; i < length; i++) {
        data.push({
          time: ((thisExperience?.phaseDuration ?? 0) - ((feedbackP1[dataType][i].time + feedbackP2[dataType][i].time) / 2)).toFixed(1) + 's',
          [participant1.name]: feedbackP1[dataType][i].value.toFixed(3),
          [participant2.name]: feedbackP2[dataType][i].value.toFixed(3)
        })
      }
    }
    return data
  }

  const colors = ['indigo.5', 'violet.7',]
  function createSeries() {
    const series: AreaChartSeries[] = []
    if (feedbackP1) {
      series.push({ name: participant1?.name as string, color: colors[0] })
    }
    if (feedbackP2) {
      series.push({ name: participant2?.name as string, color: colors[1] })
    }
    return series
  }

  function createBarChartData() {
    const p1Answers = feedbackP1?.answers
    const p2Answers = feedbackP2?.answers

    if (!p1Answers || !p2Answers || !participant2 || !participant1) return []
    const data: (Record<string, number> & { value: number })[] = []
    const answersLength = Math.min(p1Answers.length, p2Answers.length)
    for (let i = 0; i < answersLength; i++) {
      data.push({ value: `Q ${i + 1}` as unknown as number, [participant1?.name]: p1Answers[i], [participant2?.name]: p2Answers[i] })
    }
    return data
  }

  const series = createSeries()
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
            <AreaChart
              withLegend
              xAxisLabel='Time (s)'
              yAxisLabel='Level of synchronization'
              h={400}
              data={normalizeData() as Record<string, any>[]} series={series} dataKey={'time'} />
          </Card>
          <Card>
            <Title size="16px" order={2}>
              Interpersonal Connection Forms
            </Title>
            <BarChart
              withLegend
              xAxisLabel='Question Number'
              yAxisLabel='Answer'
              yAxisProps={{ domain: [0, 5] }}
              h={400}
              data={createBarChartData()}
              series={series} dataKey={'value'}
            />
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
      </Flex >
    </>
  );
}
