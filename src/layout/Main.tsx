import { AppShell, Navbar, Header, Aside, Text, Footer } from '@mantine/core';

interface MainLayoutProps {
  children: JSX.Element;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 100 }} height={500} p="xs">
          <Text>Home</Text>
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Text>Dexscreen watchlist</Text>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
};

export default MainLayout;
