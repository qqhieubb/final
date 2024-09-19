// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Layout } from 'antd';
import AppHeader from '../components/Layout/Header';
import Body from '../components/Layout/Body';
import AppFooter from '../components/Layout/Footer';

const { Content } = Layout;

const Home = () => {
  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: '0 50px' }}>
        <Body />
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default Home;
