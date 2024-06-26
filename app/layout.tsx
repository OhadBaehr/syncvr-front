import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/notifications/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from '../theme';
import { StoreContext, StoreContextProvider } from '@/store/context';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Notifications } from '@mantine/notifications';
import { Participant, ScheduledExperience } from '@/types';
import axios from 'axios';
import useSWR from 'swr';
import { InitialDataProvider } from '@/components/Providers/InitialDataProvider';
import { Dashboard } from '@/components/Templates/Dashboard';

export const metadata = {
  title: 'SyncVR',
  description: 'SyncVR Dashboard',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <UserProvider>
        <body>
          <StoreContextProvider>
            <InitialDataProvider >
              <MantineProvider theme={theme}>
                <Dashboard>
                  {children}
                </Dashboard>
                <Notifications />
              </MantineProvider>
            </InitialDataProvider>
          </StoreContextProvider>
        </body>
      </UserProvider>
    </html>
  );
}