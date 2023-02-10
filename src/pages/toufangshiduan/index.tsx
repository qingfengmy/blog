import { PageContainer, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { history } from "umi";
import TimeTable from "./components/time-table";

export default function Index() {
  const [value, setValue] = useState(null);
  return (
    <PageContainer
      header={{
        style: { borderBottom: '1px solid #ddd' },
        title: '投放时段',
        onBack: () => history.push('/'),
      }}
    >
      <TimeTable value={value} onChange={setValue} />
    </PageContainer>
  )
}
