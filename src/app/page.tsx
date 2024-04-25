"use client"
import { MantineProvider } from '@mantine/core';
import { Container } from '@mantine/core';
import Login from '@/app/(public)/login/page';

const HomePage = () => {
  return (
    <MantineProvider>
      <Container size="md">
        <Login/>
      </Container>
    </MantineProvider>
  );
};

export default HomePage;