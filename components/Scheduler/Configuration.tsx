import React, { useState } from 'react';
import {
  Card,
  Flex,
  Title,
  Divider,
  Grid,
  MultiSelect,
  Radio,
  Checkbox,
  Group,
  NumberInput,
  Text,
  ActionIcon,
  rem,
  Button
} from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { IconClock } from '@tabler/icons-react';
export function Configuration() {
  const participants = ['Itay', 'Ohad', 'Moran'];

  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [duration, setDuration] = useState('120');
  const [highSync, sethighSync] = useState(70);
  const [lowSync, setlowSync] = useState(40);
  const [dates, setDates] = useState<Date[]>([]);
  const handleSelect = (value) => {
    if (selectedParticipants.length < 2) {
      setSelectedParticipants(value);
    }
  };

  const handleDurationChange = (value) => {
    setDuration(value);
  };

  const handleHighSync = (value) => {
    sethighSync(value);
  };

  const handleLowSync = (value) => {
    setlowSync(value);
  };

  const middleRangeStart = Math.min(highSync, lowSync) + 1;
  const middleRangeEnd = Math.max(highSync, lowSync) - 1;

  return (
    <Flex justify="center" align="center" style={{ height: '100vh' }}>
      <Card w={'50%'} mt={16} shadow="xs">
        <Title size={'20px'} mb={10}>
          Experience Configuration
        </Title>
        <Divider mb={10} />
        <Grid>
          <Grid.Col span={4}>
            <MultiSelect
              label="Participants"
              data={participants}
              placeholder="Select 2 participants"
              searchable
              value={selectedParticipants}
              onChange={handleSelect}
              nothingFoundMessage="Nothing found..."
              maxValues={2}
              hidePickedOptions
              mb={12}
            />
            <Radio.Group
              mb={12}
              value={duration}
              onChange={setDuration}
              name="favoriteFramework"
              label="Select experience's duration"
              withAsterisk
            >
              <Radio mt={5} value="30" label="30s" />
              <Radio mt={5} value="60" label="60s" />
              <Radio mt={5} value="90" label="90s" />
              <Radio mt={5} value="120" label="120s" />
            </Radio.Group>
            <Checkbox.Group
              mb={12}
              defaultValue={['Hands']}
              label="Select experience's type"
              description="You can select 2 options"
              withAsterisk
            >
              <Group>
                <Checkbox mt={5} value="hands" label="Hands movement" />
                <Checkbox value="pandulum" label="Pendulum" />
              </Group>
            </Checkbox.Group>
            <div>
              <Text size="sm" fw={500} mb={5} mt={10}>
                Thresholds
              </Text>

              <Flex align="center" justify="space-between" mb={10}>
                <Flex align="center">
                  <ActionIcon
                    size="lg"
                    loading
                    variant="outline"
                    loaderProps={{
                      type: 'dots',
                      color: 'green',
                      size: 'md',
                    }}
                    styles={() => ({
                      root: {
                        borderColor: 'transparent',
                        backgroundColor: 'transparent',
                        '&[data-loading]': {
                          '&::after': {
                            borderColor: 'transparent',
                          },
                        },
                      },
                    })}
                  />
                  <Text ml={10} size="sm" fw={500}>
                    High Synchronization
                  </Text>
                </Flex>
                <NumberInput
                  value={highSync}
                  onChange={handleHighSync}
                  min={51}
                  max={100}
                  styles={{ input: { width: 60 } }}
                />
              </Flex>

              <Flex align="center" justify="space-between" mb={10}>
                <Flex align="center">
                  <ActionIcon
                    size="lg"
                    loading
                    variant="outline"
                    loaderProps={{
                      type: 'dots',
                      color: 'yellow',
                      size: 'md',
                    }}
                    styles={() => ({
                      root: {
                        borderColor: 'transparent',
                        backgroundColor: 'transparent',
                        '&[data-loading]': {
                          '&::after': {
                            borderColor: 'transparent',
                          },
                        },
                      },
                    })}
                  />
                  <Text ml={10} size="sm" fw={500}>
                    Medium Synchronization
                  </Text>
                </Flex>
                <Text mr={13} size="sm" fw={500}>
                  {middleRangeStart} - {middleRangeEnd}
                </Text>
              </Flex>

              <Flex align="center" justify="space-between" mb={10}>
                <Flex align="center">
                  <ActionIcon
                    size="lg"
                    loading
                    variant="outline"
                    loaderProps={{
                      type: 'dots',
                      color: 'red',
                      size: 'md',
                    }}
                    styles={() => ({
                      root: {
                        borderColor: 'transparent',
                        backgroundColor: 'transparent',
                        '&[data-loading]': {
                          '&::after': {
                            borderColor: 'transparent',
                          },
                        },
                      },
                    })}
                  />
                  <Text ml={10} size="sm" fw={500}>
                    Low Synchronization
                  </Text>
                </Flex>
                <NumberInput
                  value={lowSync}
                  onChange={handleLowSync}
                  min={0}
                  max={50}
                  styles={{ input: { width: 60 } }}
                />
              </Flex>
            </div>
          </Grid.Col>
          <Grid.Col span={8}>
            <DatePicker
              //   style={{ width: '100%' }}
              firstDayOfWeek={0}
              type="multiple"
              value={dates}
              onChange={setDates}
            />
            <TimeInput
              label="Select Time"
              //leftSection={<IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            />
            <Button>Create Experienece</Button>
          </Grid.Col>
        </Grid>
      </Card>
    </Flex>
  );
}
