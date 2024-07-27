import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Flex,
  Divider,
  MultiSelect,
  Checkbox,
  Group,
  NumberInput,
  Text,
  ActionIcon,
  rem,
  Button,
  Modal,
  ColorPicker,
  Box,
  Menu,
  SegmentedControl,
  Slider,
  InputDescription,
  Input,
  Badge,
} from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { IconClock } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Row } from '../Layout/Row';
import { Column } from '../Layout/Column';
import axios from 'axios';
import { StoreContext } from '@/store/context';
import { showNotification } from '@mantine/notifications';
import { create } from 'lodash';
import { Participant, ScheduledExperience } from '@/types';

import { v4 as uuid } from 'uuid';
import { ExperienceType } from '@/constants';
import { useUserWithFallback } from '@/lib/useUserWithFallback';

function Swatch({ color = '#2e2e2e', setColor }: { color: string; setColor: (color: string) => void }) {
  return (
    <Menu>
      <Menu.Target>
        <Box style={{ width: 24, height: 24, background: color, borderRadius: 300, border: "1px solid rgba(70,70,70, 0.3)", cursor: 'pointer' }}>
        </Box>
      </Menu.Target>
      <Menu.Dropdown>
        <ColorPicker value={color} onChange={setColor} format="rgb" swatches={['#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']} />
      </Menu.Dropdown>
    </Menu>
  );
}


interface ConfigurationProps {
  loading: boolean
  disclosure: ReturnType<typeof useDisclosure>
  onCreateSchedule: (schedule: ScheduledExperience) => void
  initialValues: ScheduledExperience | undefined
}

export function Configuration({ loading, onCreateSchedule, initialValues, disclosure }: ConfigurationProps) {
  const defaultValues = {
    selectedParticipants: [],
    phaseDuration: '60s',
    historyLength: 40,
    rateOfTesting: 40,
    highSyncColor: 'rgb(93, 190, 232)',
    midSyncColor: 'rgb(224, 175, 52)',
    lowSyncColor: 'rgb(227, 52, 52)',
    date: null,
    highSync: 70,
    lowSync: 40,
    experienceType: ['hands'],
    pendulumRotation: '180deg',
  }

  const [opened, { close }] = disclosure;
  const [{ participants, scheduled }] = useContext(StoreContext);
  const { user } = useUserWithFallback()
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>(defaultValues.selectedParticipants);
  const [phaseDurationStr, setPhaseDurationStr] = useState(defaultValues.phaseDuration);
  const [historyLength, setHistoryLength] = useState(defaultValues.historyLength);
  const [rateOfTesting, setRateOfTesting] = useState(defaultValues.rateOfTesting);
  const [highSyncColor, setHighSyncColor] = useState(defaultValues.highSyncColor);
  const [midSyncColor, setMidSyncColor] = useState(defaultValues.midSyncColor);
  const [lowSyncColor, setLowSyncColor] = useState(defaultValues.lowSyncColor);
  const [time, setTime] = useState('12:00');

  const [highSync, setHighSync] = useState(defaultValues.highSync);
  const [lowSync, setLowSync] = useState(defaultValues.lowSync);
  const [date, setDate] = useState<Date | null>(defaultValues.date);
  const [experienceType, setExperienceType] = useState<string[]>(defaultValues.experienceType);
  const [pendulumRotationStr, setPendulumRotationStr] = useState(defaultValues.pendulumRotation);

  const hourRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialValues) {
      setSelectedParticipants(initialValues.selectedParticipants)
      setPhaseDurationStr(initialValues.phaseDuration.toString() + 's')
      setHistoryLength(initialValues.historyLength)
      setRateOfTesting(initialValues.rateOfTesting)
      setHighSyncColor(initialValues.highSyncColor)
      setMidSyncColor(initialValues.midSyncColor)
      setLowSyncColor(initialValues.lowSyncColor)
      setTime(new Date((initialValues.date)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).split(' ')[0])
      setHighSync(initialValues.highSync)
      setLowSync(initialValues.lowSync)
      setDate(new Date(initialValues.date))
      setExperienceType(initialValues.experienceType)
      setPendulumRotationStr(initialValues.pendulumRotation.toString() + 'deg')
    } else {
      setSelectedParticipants(defaultValues.selectedParticipants);
      setPhaseDurationStr(defaultValues.phaseDuration);
      setHistoryLength(defaultValues.historyLength);
      setRateOfTesting(defaultValues.rateOfTesting);
      setHighSyncColor(defaultValues.highSyncColor);
      setMidSyncColor(defaultValues.midSyncColor);
      setLowSyncColor(defaultValues.lowSyncColor);
      setTime('12:00');
      setHighSync(defaultValues.highSync);
      setLowSync(defaultValues.lowSync);
      setDate(null);
      setExperienceType(defaultValues.experienceType);
      setPendulumRotationStr(defaultValues.pendulumRotation);
    }
  }, [initialValues])

  const handleSelect = (value: string[]) => {
    setSelectedParticipants(value.map((email) => participants.find((participant) => participant.email === email)!));
  };


  function getAvaliableScheduleId() {
    console.log(scheduled)
    let id = 1
    for (let i = 0; i < scheduled.length; i++) {
      if (scheduled.find((schedule) => schedule.sessionId === id.toString())) {
        id++
      }
    }
    return id.toString()
  }

  const handlePhaseDurationChange = (value: string) => {
    setPhaseDurationStr(value);
  };

  const handleHistoryLengthChange = (value: number) => {
    setHistoryLength(value);
  };

  const handleRateOfTestingChange = (value: string | number) => {
    setRateOfTesting(Number(value));
  };

  const handleHighSync = (value: number | string) => {
    setHighSync(Number(value));
  };

  const handleLowSync = (value: number | string) => {
    setLowSync(Number(value));
  };

  const handleExperienceTypeChange = (value: string[]) => {
    setExperienceType(value);
  };

  const handlePendulumRotationChange = (value: string) => {
    setPendulumRotationStr(value);
  };

  const pickerControl = (
    <ActionIcon variant="subtle" color="gray" onClick={() => hourRef.current?.showPicker()}>
      <IconClock style={{ width: rem(16), height: rem(16) }} />
    </ActionIcon>
  );

  const handleSubmit = () => {
    if (!user) return

    if (selectedParticipants.length !== 2) {
      showNotification({ message: 'Please select exactly 2 participants.', color: 'red' });
      return;
    }

    if (!date) {
      showNotification({ message: 'Please select a date and time.', color: 'red' });
      return;
    }

    if (!experienceType.length) {
      showNotification({ message: 'Please select at least one experience type.', color: 'red' });
      return;
    }

    // Extract the time from hourRef
    const timeValue = hourRef.current?.value;
    if (!timeValue) {
      showNotification({ message: 'Please select a time.', color: 'red' });
      return;
    }

    // Combine date and time
    const [hours, minutes] = timeValue.split(':').map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours);
    combinedDate.setMinutes(minutes);

    const experienceData = {
      uniqueId: initialValues?.uniqueId ?? uuid(),
      sessionId: initialValues?.sessionId ?? getAvaliableScheduleId(),
      createdByEmail: user.email as string,
      createdBy: user.name as string,
      selectedParticipants,
      phaseDuration: Number(phaseDurationStr.split('s')[0]),
      historyLength,
      rateOfTesting,
      highSync,
      lowSync,
      date: combinedDate,
      experienceType: experienceType as ExperienceType[],
      pendulumRotation: Number(pendulumRotationStr.split('deg')[0]),
      highSyncColor,
      midSyncColor,
      lowSyncColor,
    };

    onCreateSchedule(experienceData)
  };

  return (
    <Modal title="Experience Configuration" size="lg" onClose={close} opened={opened}>
      <Divider mb={10} />
      <Row gap={36}>
        <Column gap={16}>
          <MultiSelect
            required
            description="Select 2 participants for the experience"
            label="Participants"
            data={participants.map((participant) => ({ value: participant.email, label: participant.name }))}
            placeholder="Select 2 participants"
            searchable
            value={selectedParticipants.map((participant) => participant.email)}
            onChange={handleSelect}
            nothingFoundMessage="Nothing found..."
            maxValues={2}
            hidePickedOptions
            mb={12}
          />
          <Input.Wrapper label={'Phase duration'} description={'How long each phase (Hands, Pendulum) will last'}>
            <SegmentedControl mt={6} data={['30s', '45s', '60s', '75s', '90s']} value={phaseDurationStr} onChange={handlePhaseDurationChange} />

          </Input.Wrapper>
          <Column mt={'auto'} gap={2}>
            <Text size="sm" fw={500}>
              History length
            </Text>
            <InputDescription>How many data points the calculation has</InputDescription>
            <Row gap={8} align={'center'}>
              <Slider w={'100%'} value={historyLength} onChange={handleHistoryLengthChange} min={10} max={80} />
              <Badge w={40}>{historyLength}</Badge>
            </Row>
          </Column>
          <Column gap={2}>
            <Input.Wrapper label={"Rate of sampling"} description={'How often synchronization is being analyzed'}>
              <NumberInput mt={2} min={25} max={80} value={rateOfTesting} onChange={handleRateOfTestingChange} suffix='ms' />
            </Input.Wrapper>
          </Column>
          <Column w={280}>
            <Text size="sm" fw={500} mb={5} mt={10}>
              Thresholds
            </Text>
            <InputDescription>Color and range of synchronization levels</InputDescription>
            <Flex mt={8} align="center" justify="space-between" mb={10}>
              <Flex align="center">
                <Swatch color={highSyncColor} setColor={setHighSyncColor} />
                <Text style={{ whiteSpace: 'nowrap' }} ml={10} size="sm" fw={500}>
                  High Synchronization
                </Text>
              </Flex>
              <NumberInput
                value={highSync}
                onChange={handleHighSync}
                min={lowSync + 1}
                max={100}
                styles={{ input: { width: 60 } }}
              />
            </Flex>
            <Divider mb={12} />
            <Flex align="center" justify="space-between" mb={10}>
              <Flex align="center">
                <Swatch color={midSyncColor} setColor={setMidSyncColor} />
                <Text style={{ whiteSpace: 'nowrap' }} ml={10} size="sm" fw={500}>
                  Medium Synchronization
                </Text>
              </Flex>
              <Text style={{ whiteSpace: 'nowrap' }} ml={8} mr={13} size="sm" fw={500}>
                {lowSync} - {highSync}
              </Text>
            </Flex>
            <Divider mb={12} />
            <Flex align="center" justify="space-between" mb={10}>
              <Flex align="center">
                <Swatch color={lowSyncColor} setColor={setLowSyncColor} />
                <Text style={{ whiteSpace: 'nowrap', textAlign: 'right' }} ml={10} size="sm" fw={500}>
                  Low Synchronization
                </Text>
              </Flex>
              <NumberInput
                value={lowSync}
                onChange={handleLowSync}
                min={0}
                max={highSync - 1}
                styles={{ input: { width: 60 } }}
              />
            </Flex>
          </Column>
        </Column>
        <Column w="100%" gap={16}>
          <Checkbox.Group
            mb={12}
            defaultValue={['hands']}
            label="Select experience's type"
            description="You can select 2 options"
            withAsterisk
            value={experienceType}
            onChange={handleExperienceTypeChange}
          >
            <Row mt={4} align={'center'} gap={8}>
              <Checkbox value="hands" label="Hands movement" />
              <Checkbox value="pendulum" label="Pendulum" />
            </Row>
          </Checkbox.Group>
          <Column gap={2}>
            <Text size="sm" fw={500}>
              Pendulum rotation
            </Text>
            <InputDescription>Back and forth or spinning Pendulum</InputDescription>
            <SegmentedControl mt={2} data={['180deg', '360deg']} value={pendulumRotationStr} onChange={handlePendulumRotationChange} />
          </Column>
          <Column>
            <Input.Wrapper required label={'Select Time'} description={'Experience will be available for up to 3 hours.'}>
              <DatePicker
                minDate={new Date()}
                mt={4}
                firstDayOfWeek={0}
                value={date}
                onChange={(date) => {
                  setDate(date)
                  if (date && date.toDateString() === new Date().toDateString()) {
                    setTime(new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' }))
                  }
                }}
              />
              <TimeInput
                ref={hourRef}
                value={time}
                onChange={(e) => setTime(e.currentTarget.value)}
                rightSection={pickerControl}
                withSeconds={false}
                minTime={date && date.toDateString() === new Date().toDateString() ? new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '00:00'}
              />
            </Input.Wrapper>
          </Column>
          <Button disabled={loading} mt={'auto'} onClick={handleSubmit}>{initialValues ? "Save changes" : "Create Experience"}</Button>
        </Column>
      </Row>
    </Modal>
  );
}
