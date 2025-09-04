import { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, TextInput, NumberInput, Group, ActionIcon, Text, Alert, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { motion } from 'framer-motion';
import type { PassengerType } from '../types';

interface AddPassengerModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialCabinNumber?: number;
  initialCabinName?: string;
  modalTitle?: string;
}

interface FormPassenger {
  firstName: string;
  surname: string;
  type: PassengerType;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function AddPassengerModal({ opened, onClose, onSuccess, initialCabinNumber, initialCabinName, modalTitle }: AddPassengerModalProps) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      cabinNumber: '' as number | '',
      cabinName: '',
      passengers: [{ firstName: '', surname: '', type: 'ADULT' }] as FormPassenger[],
    },
    validate: {
      cabinNumber: (value: number | '') => (value === '' || value < 0 || value > 11) ? 'Cabin number must be 0-11' : null,
      cabinName: (value: string) => (value.trim().length < 2 ? 'Cabin name must have at least 2 letters' : null),
      passengers: {
        firstName: (value: string) => (value.trim().length < 2 ? 'First name is required' : null),
        surname: (value: string) => (value.trim().length < 2 ? 'Surname is required' : null),
      },
    },
  });

  useEffect(() => {
    if (opened) {
      form.setValues({
        cabinNumber: initialCabinNumber ?? '',
        cabinName: initialCabinName ?? '',
        passengers: [{ firstName: '', surname: '', type: 'ADULT' }],
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, initialCabinNumber, initialCabinName]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setError(null);
      const fullApiUrl = `${API_BASE_URL}/cabins/${values.cabinNumber}/passengers`;
      await axios.post(fullApiUrl, {
        cabinName: values.cabinName,
        passengers: values.passengers,
      });
      onSuccess();
      handleClose();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data);
      } else {
        setError('An unexpected error occurred. Is the cabin occupied?');
      }
    }
  };

  const handleClose = () => {
    form.reset();
    setError(null);
    onClose();
  };

  const passengerFields = form.values.passengers.map((_, index: number) => (
    <Group key={index} mt="xs" grow wrap="nowrap" align="flex-start">
      <TextInput
        placeholder="First Name"
        withAsterisk
        style={{ flex: 3 }}
        {...form.getInputProps(`passengers.${index}.firstName`)}
      />
      <TextInput
        placeholder="Surname"
        withAsterisk
        style={{ flex: 3 }}
        {...form.getInputProps(`passengers.${index}.surname`)}
      />
      <Select
        style={{ flex: 2 }}
        withAsterisk
        data={['ADULT', 'CHILD']}
        {...form.getInputProps(`passengers.${index}.type`)}
      />
      {form.values.passengers.length > 1 && (
        <ActionIcon color="red" mt={4} onClick={() => form.removeListItem('passengers', index)}>
          -
        </ActionIcon>
      )}
    </Group>
  ));

  return (
    <Modal opened={opened} onClose={handleClose} title={modalTitle || "Add Passenger(s) to Cabin"} size="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <NumberInput
          label="Cabin Number"
          placeholder="Enter cabin number (0-11)"
          withAsterisk
          min={0}
          max={11}
          allowDecimal={false}
          {...form.getInputProps('cabinNumber')}
          disabled={initialCabinNumber !== undefined}
        />
        <TextInput
          label="Cabin Name (Booking Name)"
          placeholder="e.g., Smith Family"
          withAsterisk
          mt="md"
          {...form.getInputProps('cabinName')}
          disabled={initialCabinName !== undefined}
        />
        <Text size="sm" fw={500} mt="lg">Passengers (1-3 allowed)</Text>
        {passengerFields}

        {form.values.passengers.length < 3 && (
          <motion.div whileHover={{ scale: 1.02 }}>
            <Button
              variant="light"
              fullWidth
              mt="md"
              onClick={() => form.insertListItem('passengers', { firstName: '', surname: '', type: 'ADULT' })}
            >
              + Add Another Passenger
            </Button>
          </motion.div>
        )}
        
        {error && <Alert color="red" title="Submission Error" mt="md">{error}</Alert>}

        <Group justify="flex-end" mt="xl">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="default" onClick={handleClose}>Cancel</Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="submit">Add to Cabin</Button>
          </motion.div>
        </Group>
      </form>
    </Modal>
  );
}