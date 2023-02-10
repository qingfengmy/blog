import React, { useState } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { history } from "umi";
import { PageContainer, PageHeaderWrapper } from '@ant-design/pro-layout';
import LaunchperiodComp from './components/datetable/index'

const Launchperiod: React.FC<{}> = () => {
  const [value, setValue] = useState<any>([])
  return (
    <PageContainer
      header={{
        style: { borderBottom: '1px solid #ddd' },
        title: '分时折扣',
        onBack: () => history.push('/'),
      }}
    >
      <LaunchperiodComp value={value} onChange={(launchper: any) => setValue(launchper)} />
    </PageContainer>
  );
};

export default Launchperiod;
