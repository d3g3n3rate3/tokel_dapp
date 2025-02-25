import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';

import { selectKey } from 'store/selectors';
import { login } from 'util/workerHelper';
import { BITGO } from 'vars/defines';

import AssetView from './AssetView';
import Portfolio from './Portfolio/Portfolio';

const DashboardRoot = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex: 1;
  background-color: var(--color-black);
  padding: 18px;
  margin: 0;
`;

const TX_FETCH_INTERVAL_MS = 30 * 1000;

const Dashboard = (): ReactElement => {
  const key = useSelector(selectKey);
  useEffect(() => {
    const txInterval = setInterval(() => ipcRenderer.send(BITGO, login(key)), TX_FETCH_INTERVAL_MS);
    return () => {
      clearInterval(txInterval);
    };
  }, [key]);

  return (
    <DashboardRoot>
      <Portfolio />
      <AssetView />
    </DashboardRoot>
  );
};

export default Dashboard;
