import { useState } from 'react';
import axios from 'axios';
import { Card, Title, Group, Button, FileInput, Text, Alert } from '@mantine/core';
import { motion } from 'framer-motion';
import type { Cabin } from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface DataManagementProps {
  onDataChange: () => void;
}

export function DataManagement({ onDataChange }: DataManagementProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_URL}/cabins`);
      const cabins: Cabin[] = response.data;

      const jsonString = JSON.stringify(cabins, null, 2);

      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cruise_ship_data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Export failed:', err);
      setError('Could not export data.');
    }
  };

  const handleImport = async (file: File | null) => {
    if (!file) return;

    setError(null);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result;
        if (typeof content !== 'string') throw new Error('File content is not valid.');
        
        const newCabins: Cabin[] = JSON.parse(content);

        await axios.post(`${API_URL}/cabins/load`, newCabins);

        onDataChange();

      } catch (err) {
        console.error('Import failed:', err);
        setError('Import failed. Ensure the file is a valid exported JSON.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card withBorder p="md" radius="md">
      <Title order={3} mb="md">Data Management</Title>
      {error && <Alert color="red" title="Error" mb="md">{error}</Alert>}
      
      <Group grow>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" onClick={handleExport}>
            Export Data (Save)
          </Button>
        </motion.div>
        
        <FileInput
          placeholder="Select file..."
          onChange={handleImport}
          accept="application/json"
          disabled={loading}
        />
      </Group>
      <Text size="xs" c="dimmed" mt="xs">
        Click to select an exported .json file to import (load).
      </Text>
    </Card>
  );
}