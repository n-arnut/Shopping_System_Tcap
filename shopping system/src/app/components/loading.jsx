import React from 'react';
import { Alert, Flex, Spin } from 'antd';
const contentStyle = {
  padding: 50,
  background: 'rgba(241, 239, 239, 0.93)',
  borderRadius: 4,
};
const content = <div style={contentStyle} />;
const Loading = () => (
    <Spin tip="Loading">{content}</Spin>
);
export default Loading;