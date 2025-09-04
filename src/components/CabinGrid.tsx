import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { Cabin } from '../types';
import { SimpleGrid, Card, Text, Badge, Loader, Alert, Title, Stack, Group, Button, TextInput } from '@mantine/core';
import { AddPassengerModal } from './AddPassengerModal';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface CabinGridProps {
  onDataChange: () => void;
}

interface ModalState {
  open: boolean;
  cabinNumber?: number;
  guestName?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function CabinGrid({ onDataChange }: CabinGridProps) {
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>({ open: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [highlightedCabins, setHighlightedCabins] = useState<number[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchCabins = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/cabins`);
      setCabins(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to connect to the server. Is it running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCabins();
  }, [fetchCabins]);

  const handleVacateCabin = async (cabinNumber: number) => {
    if (!confirm(`Are you sure you want to vacate Cabin ${cabinNumber}?`)) return;
    try {
      setLoading(true);
      const response = await axios.delete(`${API_URL}/cabins/${cabinNumber}/passengers`);
      const waitingListGuestMatch = response.data.match(/successfully. (.+) is next on the waiting list/);

      if (waitingListGuestMatch && waitingListGuestMatch[1]) {
        setModalState({
          open: true,
          cabinNumber: cabinNumber,
          guestName: waitingListGuestMatch[1]
        });
      } else {
        alert(response.data);
        onDataChange();
      }
    } catch (err) {
      alert('Error: Could not vacate the cabin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchMessage('Please enter a name to search.');
      setHighlightedCabins([]);
      return;
    }
    setSearchLoading(true);
    setSearchMessage(null);
    setHighlightedCabins([]);
    try {
      const response = await axios.get(`${API_URL}/passengers/find`, {
        params: { name: searchQuery },
      });
      const foundCabins: Cabin[] = response.data;
      const cabinNumbers = foundCabins.map(cabin => cabin.cabinNumber);
      setHighlightedCabins(cabinNumbers);
      setSearchMessage(`✅ Found ${cabinNumbers.length} matching cabin(s).`);
    } catch (err) {
      setSearchMessage(`❌ Passenger '${searchQuery}' not found.`);
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleModalSuccess = () => {
    setModalState({ open: false });
    onDataChange();
  };
  
  const handleAddPassengerClick = (cabinNumber: number) => {
    setModalState({
        open: true,
        cabinNumber: cabinNumber
    });
  };

  if (loading && cabins.length === 0) return <Loader size="xl" />;
  if (error) return <Alert color="red" title="Error">{error}</Alert>;

  return (
    <>
      <AddPassengerModal
        opened={modalState.open}
        onClose={() => setModalState({ open: false })}
        onSuccess={handleModalSuccess}
        initialCabinNumber={modalState.cabinNumber}
        initialCabinName={modalState.guestName}
        modalTitle={modalState.guestName ? `Add ${modalState.guestName} from Waiting List` : "Add Passenger(s) to Cabin"}
      />

      <Group justify="space-between" mb="xl">
        <Title order={2}>Cabin Overview</Title>
      </Group>

      <Card withBorder p="md" mb="xl">
        <Group>
          <TextInput
            placeholder="Search by full name, surname, or booking name..."
            style={{ flex: 1 }}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleSearch} loading={searchLoading}>Find Cabin</Button>
          </motion.div>
        </Group>
        {searchMessage && <Text mt="sm" size="sm">{searchMessage}</Text>}
      </Card>
      
      {loading && <Loader size="sm" mb="md" />}

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
        {cabins.map((cabin, index) => (
          <motion.div
            key={cabin.cabinNumber}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card
              shadow="sm" p="lg" radius="md" withBorder
              onClick={cabin.cabinName === 'e' ? () => handleAddPassengerClick(cabin.cabinNumber) : undefined}
              style={{
                borderColor: highlightedCabins.includes(cabin.cabinNumber) ? '#40C057' : undefined,
                borderWidth: highlightedCabins.includes(cabin.cabinNumber) ? '2px' : '1px',
                cursor: cabin.cabinName === 'e' ? 'pointer' : 'default',
                height: '100%'
              }}
            >
              <Group justify="space-between">
                <Text fw={500}>Cabin {cabin.cabinNumber}</Text>
                <Badge color={cabin.cabinName === 'e' ? 'green' : 'blue'} variant="light">
                  {cabin.cabinName === 'e' ? 'Empty' : 'Occupied'}
                </Badge>
              </Group>

              {cabin.cabinName !== 'e' ? (
                <Stack gap="xs" mt="md">
                  <Title order={5}>{cabin.cabinName}</Title>
                  <Text size="sm" c="dimmed">Passengers:</Text>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {cabin.passengers.map((p, index) => (
                      <li key={index}><Text size="sm">{p.firstName} {p.surname}</Text></li>
                    ))}
                  </ul>
                  
                  <Group justify="space-between" mt="sm" p="xs" style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                      <Text size="sm" fw={500}>Cabin Total:</Text>
                      <Text size="sm" fw={700}>
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cabin.passengers.reduce((total, p) => total + p.expenses, 0))}
                      </Text>
                  </Group>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button color="red" variant="outline" size="xs" mt="md" onClick={() => handleVacateCabin(cabin.cabinNumber)}>
                      Vacate Cabin
                    </Button>
                  </motion.div>
                </Stack>
              ) : (
                <Stack h={100} align="center" justify="center" gap="xs">
                  <Text c="dimmed">Available</Text>
                  <Text c="dimmed" size="sm">Click to add passenger</Text>
                </Stack>
              )}
            </Card>
          </motion.div>
        ))}
      </SimpleGrid>
    </>
  );
}