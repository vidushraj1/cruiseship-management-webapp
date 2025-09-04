import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Card, Title, Text, List, Group, TextInput, Button, Loader, Alert } from '@mantine/core';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export function WaitingList() {
  const [list, setList] = useState<string[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);

  const fetchWaitingList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/waiting-list`);
      setList(response.data);
    } catch (err) {
      setError('Could not load the waiting list.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWaitingList();
  }, [fetchWaitingList]);

  const handleAddToList = async () => {
    if (!newName.trim()) {
      alert('Please enter a name.');
      return;
    }

    setAddLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/waiting-list`, { guestName: newName });
      setNewName('');
      await fetchWaitingList();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data);
      } else {
        alert('An unexpected error occurred.');
      }
      console.error(err);
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <Card withBorder p="md" radius="md">
      <Title order={3} mb="md">Waiting List</Title>
      {list.length > 0 ? (
        <List type="ordered">
          {list.map((name, index) => (
            <List.Item key={index}>{name}</List.Item>
          ))}
        </List>
      ) : (
        <Text c="dimmed">The waiting list is currently empty.</Text>
      )}

      <Group mt="xl">
        <TextInput
          placeholder="Guest name to add..."
          style={{ flex: 1 }}
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
          onKeyDown={(event) => event.key === 'Enter' && handleAddToList()}
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={handleAddToList} loading={addLoading}>
            Add to List
          </Button>
        </motion.div>
      </Group>
      <Text size="xs" c="dimmed" mt="xs">
        Note: You can only add to the list when all cabins are full.
      </Text>
    </Card>
  );
}