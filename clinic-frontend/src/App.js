import React from 'react'
import "./App.css"
import axios from 'axios'
import { FormOutlined, CommentOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import RegistrationView from './views/RegistrationView';
import ExaminationView from './views/ExaminationView';

const { Header, Content } = Layout;
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL

function App() {
  const DEFAULT_VIEW = 'reg'

  const MENUS = [
    {
      label: 'Registration',
      key: 'reg',
      icon: <FormOutlined />,
      component: <RegistrationView/>,
    },
    {
      label: 'Examination',
      key: 'exam',
      icon: <CommentOutlined />,
      component: <ExaminationView/>,
      },
  ]

  const [currentView, setCurrentView] = React.useState(DEFAULT_VIEW)

  const renderContent = () => {
    const menu = MENUS.find(m => m.key === currentView)
    return menu ? menu.component : null
  }

  return (
    <Layout className="layout">
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[DEFAULT_VIEW]}
          items={MENUS}
          onSelect={item => setCurrentView(item.key)}
        />
      </Header>
      <Content className="center-screen">
        {renderContent()}
      </Content>
    </Layout>
  );
}

export default App;
