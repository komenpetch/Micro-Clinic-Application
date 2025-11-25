import React from 'react'
import axios from 'axios'
import "../App.css"
import { Typography, notification, Table, Tag, Space, Button } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import DiagnosisDialog from '../components/DiagnosisDialog';
import { URL_EXAMINATION } from '../constants/urls';
import NotificationToast from '../components/NotificationToast';

const { Title } = Typography;

function ExaminationView() {

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Arrive',
      dataIndex: 'created',
      key: 'created',
      render: created => <p>{new Date(created).toLocaleString('en-US') }</p>,
    },
    {
      title: 'Status',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      render: diag => diag ?
        <Tag icon={<CheckCircleOutlined />} color='success'>Done</Tag> : 
        <Tag icon={<ExclamationCircleOutlined />} color='warning'>Waiting</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, row) => (
        <Space size="middle">
          {row.diagnosis ? 
            <Button icon={<InfoCircleOutlined />} onClick={() => showDiagDialog(row)}>View</Button> : 
            <Button type="primary" icon={<EditOutlined />} onClick={() => showDiagDialog(row)}>Edit</Button>}
        </Space>
      )
    },
  ]

  const [notiApi, notiContextHolder] = notification.useNotification();
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState([])
  const [currentDiagnosis, setCurrentDiagnosis] = React.useState(null)

  const fetchQueue = async () => {
    try {
      setLoading(true)
      setData([])
      const resp = await axios.get(URL_EXAMINATION.QUEUE_LIST)
      setData(resp.data)
    } catch (error) {
      console.log(error)
      notiApi.error({
        message: `HTTP Request Error : ${error.code}`,
        description: error.response.data ? JSON.stringify(error.response.data) : 'Please see logs',
        placement: "bottomRight",
        duration: 10,
      });
    } finally {
      setLoading(false)
    }
  }

  const showDiagDialog = (row) => {
    setCurrentDiagnosis(row)
  }

  React.useEffect(() => {
    fetchQueue()
  }, [])

  return (
    <div>
      {notiContextHolder}
      <Typography>
        <Title level={2}>Examination Queue</Title>
      </Typography>
      <NotificationToast onNotify={fetchQueue}/>
      <Table 
        columns={columns} 
        dataSource={data} 
        bordered={true}
        loading={loading}
        pagination={false}
        size='small'
        rowKey='id'
        style={{
          minWidth: '60vw'
        }}
      />
      <DiagnosisDialog 
        patient={currentDiagnosis}
        open={currentDiagnosis != null} 
        onClose={() => {
          setCurrentDiagnosis(null);
          fetchQueue();
        }}/>
    </div>
  )
}

export default ExaminationView;
