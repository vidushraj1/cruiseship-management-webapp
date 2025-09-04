import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Card, Title, Text, Group, Button, Loader, Alert, Modal, List } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { motion } from 'framer-motion';
import type { Passenger } from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export function ShipStats() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [orderedPassengers, setOrderedPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const [expensesResponse, passengersResponse] = await Promise.all([
        axios.get(`${API_URL}/expenses/total`),
        axios.get(`${API_URL}/passengers/ordered`)
      ]);
      setTotalExpenses(expensesResponse.data);
      setOrderedPassengers(passengersResponse.data);
      setError(null);
    } catch (err) {
      setError('Could not load ship statistics.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;

  const formattedExpenses = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalExpenses);

  return (
    <>
      <Modal opened={modalOpened} onClose={closeModal} title="All Passengers (Alphabetical Order)" size="md">
        {orderedPassengers.length > 0 ? (
          <List spacing="xs" size="sm">
            {orderedPassengers.map((p, index) => (
              <List.Item key={index}>
                <Group justify="space-between">
                  <Text>{p.firstName} {p.surname} ({p.type})</Text>
                  <Text size="sm" c="green" fw={500}>${p.expenses.toFixed(2)}</Text>
                </Group>
              </List.Item>
            ))}
          </List>
        ) : (
          <Text c="dimmed">There are currently no passengers on board.</Text>
        )}
      </Modal>

      <Card withBorder p="md" radius="md">
        <Title order={3} mb="md">Ship Statistics</Title>
        <Group justify="space-between">
          <Text fw={500}>Total Revenue:</Text>
          <Text fw={700} size="lg" c="green">{formattedExpenses}</Text>
        </Group>
        <motion.div whileHover={{ scale: 1.02 }} style={{marginTop: '20px'}}>
            <Button
              variant="light"
              fullWidth
              onClick={openModal}
              disabled={orderedPassengers.length === 0}
            >
              View All Passengers
            </Button>
        </motion.div>
      </Card>
    </>
  );
}