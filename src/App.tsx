import { AppShell, Container, Grid, Stack } from '@mantine/core';
import { AppHeader } from './components/Header';
import { CabinGrid } from './components/CabinGrid';
import { WaitingList } from './components/WaitingList';
import { ShipStats } from './components/ShipStats';
import { DataManagement } from './components/DataManagement';
import { useState } from 'react';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataChange = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>

      <AppShell.Main>
        <Container fluid>
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <CabinGrid key={`grid-${refreshKey}`} onDataChange={handleDataChange} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack>
                <ShipStats key={`stats-${refreshKey}`} />
                <WaitingList key={`list-${refreshKey}`} />
                <DataManagement onDataChange={handleDataChange} />
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;