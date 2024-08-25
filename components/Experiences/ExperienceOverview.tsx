'use client'
import React, { useContext, useEffect, useState } from 'react';
import { Title, Card, Input, Select, Flex, Button, Text, Table } from '@mantine/core';
import { Note } from './Note';
import { StoreContext } from '@/store/context';
import { ExperienceType } from '@/constants';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import axios from 'axios';
import { Feedback, INote, Participant } from '@/types';
import { useDisclosure } from '@mantine/hooks';
import { EditNote } from './EditNote';
import { showNotification } from '@mantine/notifications';
import { AreaChart, AreaChartSeries, BarChart } from '@mantine/charts';
import { IconHandStop, IconLollipop, IconPencil, IconTrash } from '@tabler/icons-react';
import { Row } from '../Layout/Row';
import { Circle } from '../Atoms/Circle';
import { formatDate } from '@/lib/utils';


// Specific experience breakdown with charts and notes
export function ExperienceOverview() {
  const searchParams = useParams();
  const { uniqueId } = searchParams
  const [{ experiences, participants }] = useContext(StoreContext);
  const [mode, setMode] = useState(ExperienceType.Hands);
  const disclosure = useDisclosure(false);
  const [_, { open }] = disclosure

  const [notes, setNotes] = useState<INote[]>([]);
  const [editNote, setEditNote] = useState<INote | undefined>(undefined)
  const [feedbackP1, setFeedbackP1] = useState<Feedback | null>(null);
  const [feedbackP2, setFeedbackP2] = useState<Feedback | null>(null);
  const [participant1, setParticipant1] = useState<Participant | undefined>(undefined)
  const [participant2, setParticipant2] = useState<Participant | undefined>(undefined)

  // Fetch all notes for the current experience on component mount
  useSWR<INote[]>(`/api/notes?uniqueId=${uniqueId}`, (url: string) => axios.get(url).then(res => res.data), {
    onSuccess: (data) => {
      setNotes(data);
    }
  });


  // Fetch interpersonal connection form and session syncronization data on component mount
  useSWR<Feedback[]>(`/api/feedback?uniqueId=${uniqueId}`, (url: string) => axios.get(url).then(res => res.data), {
    onSuccess: (data) => {
      setFeedbackP1(data[0]);
      setFeedbackP2(data[1]);
    }
  });


  // Once feedback is received, find the participant details
  useEffect(() => {
    if (feedbackP1) {
      setParticipant1(participants.find(participant => participant.email === feedbackP1.email))
    }
    if (feedbackP2) {
      setParticipant2(participants.find(participant => participant.email === feedbackP2.email))
    }
  }, [feedbackP1, feedbackP2, participants])


  // Get current experience details
  const thisExperience = experiences.find(experience => experience.uniqueId === uniqueId)

  if (!thisExperience) return

  const {
    date,
    selectedParticipants,
    experienceType,
    historyLength,
    rateOfTesting,
    createdBy,
    phaseDuration,
    pendulumRotation,
    lowSync,
    highSync,
    lowSyncColor,
    midSyncColor,
    highSyncColor,
  } = thisExperience


  // Switch betweeen hands and pendulum mode
  const handleModeChange = (value: ExperienceType) => {
    setMode(value);
  };


  // Create dropdown options for mode select (current selection is disabled)
  const selectOptions = [ExperienceType.Hands, ExperienceType.Pendulum].map((option) => ({
    label: option,
    value: option,
    disabled: option === mode,
  }));

  // Open the note editor modal with current note details
  function onEditNote(note: INote) {
    setEditNote(note)
    open()
  }

  // Delete a note, raise error message if deletion fails
  function onDeleteNote(note: INote) {
    axios.delete(`/api/notes?noteId=${note.noteId}`).then(() => {
      setNotes(prev => prev.filter(note => note.noteId !== note.noteId))
      showNotification({ message: 'Note deleted successfully!', color: 'green' });
    }).catch(() => {
      showNotification({ message: 'Failed to delete note. Please try again.', color: 'red' });
    })
  }

  // Normalize feedback data for charting
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

  // Syncronization chart colors for each participant
  const colors = ['indigo.5', 'violet.7',]

  // Create series for syncronization chart
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

  const series = createSeries()


  // Create bar chart data for interpersonal connection form
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


  // Format date for display
  const dateStr = formatDate(date)


  const rows = (
    <Table.Tr flex="col">
      <Table.Td>{createdBy}</Table.Td>
      <Table.Td>
        {dateStr}
      </Table.Td>
      <Table.Td>
        <Row align={'center'} gap={4}>
          <Text size={'sm'}>
            {phaseDuration}s
          </Text>
          {experienceType.includes(ExperienceType.Hands) && <IconHandStop stroke={1.1} />}
          {experienceType.includes(ExperienceType.Pendulum) && (
            <Row>
              <IconLollipop style={{ transform: 'rotate(180deg)' }} stroke={1} />
              <Text fw={500} size={'xs'}>
                {pendulumRotation}°
              </Text>
            </Row>
          )}
        </Row>
      </Table.Td>
      <Table.Td>
        <Text fw={500} size={'sm'}>
          {`${historyLength} x ${rateOfTesting / 1000} ms`}
        </Text>
      </Table.Td>
      <Table.Td>
        <Row align={'center'} gap={4}>
          {lowSync}
          <Circle color={lowSyncColor} />

          <Circle color={midSyncColor} />

          <Circle color={highSyncColor} />
          {highSync}
        </Row>
      </Table.Td>
    </Table.Tr>
  )

  return (
    <>
      <Title mt={10} mb={20} size="20px">
        {`${selectedParticipants[0].name} & ${selectedParticipants[1].name} - ${dateStr}`}
      </Title>

      <Flex wrap="wrap" gap={24}>
        <Flex flex={1} direction="column">
          <Card mb={20}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Created By</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Mode</Table.Th>
                  <Table.Th>History</Table.Th>
                  <Table.Th>Sync Level</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Card>
          <Card mr={5} mb={20}>
            <Title size="16px" order={2}>
              Synchronization Over Time
            </Title>
            <Flex align="center" mb={10}>
              <Input.Wrapper ml="auto" label="Mode">
                <Select data={selectOptions} value={mode} onChange={(mode => handleModeChange(mode as ExperienceType))} />
              </Input.Wrapper>
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
