import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Title, Card, Input, Select, Flex, Button } from '@mantine/core';
import { BarChart } from '@mantine/charts';
import { Note } from './Note';

export function EditExperience() {
  const sampleData = [
    { time: '0s', value: 0 },
    { time: '10s', value: 10 },
    { time: '20s', value: 30 },
    { time: '30s', value: 50 },
    { time: '40s', value: 70 },
    { time: '50s', value: 90 },
    { time: '60s', value: 60 },
    { time: '70s', value: 80 },
    { time: '80s', value: 40 },
    { time: '90s', value: 20 },
    { time: '100s', value: 30 },
    { time: '110s', value: 50 },
    { time: '120s', value: 70 },
  ];

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

  const barChartData = [
    { question: 'q1', Itay: 2, Ohad: 3 },
    { question: 'q2', Itay: 1, Ohad: 4 },
    { question: 'q3', Itay: 4, Ohad: 2 },
    { question: 'q4', Itay: 3, Ohad: 1 },
    { question: 'q5', Itay: 5, Ohad: 2 },
    { question: 'q6', Itay: 4, Ohad: 1 },
    { question: 'q7', Itay: 3, Ohad: 1 },
    { question: 'q8', Itay: 4, Ohad: 5 },
    { question: 'q9', Itay: 5, Ohad: 5 },
    { question: 'q10', Itay: 3, Ohad: 5 },
  ];

  // Adjusted y-axis ticks to go from 0 to 5
  const yAxisTicks = Array.from({ length: 6 }, (_, i) => i);

  return (
    <>
      <Title mt={10} mb={20} size="20px">
        Ohad Beahr & Itay Aharoni - 27/3/24
      </Title>
      <Flex direction={'column'}>
        <Card w="70%" mr={5} mb={20}>
          <Title size="16px" order={2}>
            Synchronization Over Time
          </Title>
          <Flex align="center" mb={10}>
            <Input.Wrapper ml="auto" label="Mode">
              <Select
                data={selectOptions}
                value={mode}
                onChange={(value) => handleModeChange(value)}
              />
            </Input.Wrapper>
            <Input.Wrapper ml={10} label="Synchronization Algorithm">
              <Select
                data={algoOptions}
                value={syncAlgo}
                onChange={(value) => handleSyncAlgoChange(value)}
              />
            </Input.Wrapper>
          </Flex>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={sampleData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
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
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card w="70%">
          <BarChart
            h={400}
            data={barChartData}
            xAxisLabel="Question"
            yAxisLabel="Score"
            withLegend
            legendProps={{ verticalAlign: 'bottom' }}
            series={[
              { name: 'Itay', color: 'violet.6' },
              { name: 'Ohad', color: 'blue.6' },
            ]}
            dataKey={'question'}
          >
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
              ticks={yAxisTicks}
              label={{
                value: 'Score',
                angle: -90,
                position: 'insideLeft',
                dx: -30,
                style: { textAnchor: 'middle' },
              }}
            />
          </BarChart>
        </Card>
      </Flex>
      <Card w="30%">
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
    </>
  );
}
