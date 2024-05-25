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
} from 'recharts';
import { Title, Card, Input, Select, Flex, Button } from '@mantine/core';
import { Note } from './Note';
import { StoreContext } from '@/store/context';

export function EditExperience() {
  const [store] = useContext(StoreContext);
  const { synclevel, personalForms } = store;

  const [mode, setMode] = useState('Hands');
  const [syncAlgo, setSyncAlgo] = useState('Pearson');

  const handleModeChange = (value) => {
    setMode(value);
  };

  const handleSyncAlgoChange = (value) => {
    setSyncAlgo(value);
  };

  const selectOptions = ['Hands', 'Pendulum'].map((option) => ({
    label: option,
    value: option,
    disabled: option === mode,
  }));

  const algoOptions = ['Pearson', 'Spearman', 'Third'].map((option) => ({
    label: option,
    value: option,
    disabled: option === syncAlgo,
  }));

  return (
    <>
      <Title mt={10} mb={20} size="20px">
        Ohad Beahr & Itay Aharoni - 27.3.24
      </Title>
      <Flex wrap="wrap" gap={24}>
        <Flex flex={1} direction="column">
          <Card mr={5} mb={20}>
            <Title size="16px" order={2}>
              Synchronization Over Time
            </Title>
            <Flex align="center" mb={10}>
              <Input.Wrapper ml="auto" label="Mode">
                <Select
                  data={selectOptions}
                  value={mode}
                  onChange={handleModeChange}
                />
              </Input.Wrapper>
              <Input.Wrapper ml={10} label="Synchronization Algorithm">
                <Select
                  data={algoOptions}
                  value={syncAlgo}
                  onChange={handleSyncAlgoChange}
                />
              </Input.Wrapper>
            </Flex>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                data={synclevel}
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
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
            </ResponsiveContainer>
          </Card>
          <Card>
          <Title size="16px" order={2} mb={20}>
              Interpersonal Connection Forms
            </Title>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={personalForms}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="question"
                  label={{
                    value: 'Question',
                    position: 'insideBottom',
                    offset: -10,
                    dy: 10,
                    style: { textAnchor: 'middle' },
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
                    dx: -30,
                    style: { textAnchor: 'middle' },
                  }}
                />
                <Tooltip />
                <Bar dataKey="answer1" fill="#8884d8" name="Itay" />
                <Bar dataKey="answer2" fill="#82ca9d" name="Ohad" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Flex>
        <Card>
          <Flex justify="space-between" align="center" style={{ marginBottom: '10px' }}>
            <Title size="16px" order={2}>
              Notes
            </Title>
            <Button variant="transparent" color="gray" style={{ marginRight: 0, fontSize: '12px' }}>
              View All Notes
            </Button>
          </Flex>
          <Note />
          <Note />
          <Note />
          <Flex justify="center">
            <Button w="90%">Add Note</Button>
          </Flex>
        </Card>
      </Flex>
    </>
  );
}
