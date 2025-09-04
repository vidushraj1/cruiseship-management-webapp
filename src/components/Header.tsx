import { Group, Title } from '@mantine/core';

export function AppHeader() {
  return (
    <header>
      <Group p="md" style={{ borderBottom: '1px solid #444' }}>
        <Title order={3}>🚢 Cruise Ship Management</Title>
      </Group>
    </header>
  );
}