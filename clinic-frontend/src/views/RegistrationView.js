import React from 'react'
import axios from 'axios'
import "../App.css"
import { Typography, Button, Form, InputNumber, Input, Select, Spin, notification } from 'antd';
import { URL_REGISTRATION } from '../constants/urls';
import NotificationToast from '../components/NotificationToast';

const { Title } = Typography;

const VISIT_TYPES = ['OPD', 'ER']
const GENDERS = ['MALE', 'FEMALE']

function RegistrationView() {
  const [regForm] = Form.useForm()
  const [notiApi, notiContextHolder] = notification.useNotification();
  const [loading, setLoading] = React.useState(false)

  const generateOptions = lst => lst.map(v => ({ key: v, value: v, label: v }))

  const onFinish = async (values) => {
    try {
      setLoading(true)
      const resp = await axios.post(URL_REGISTRATION.NEW_PATIENT, { ...values })
      notiApi.success({
        message: "New patient registered !",
        description: `Successfully register new patient ${resp.data['name']}`,
        placement: "bottomRight"
      })
      regForm.resetFields()
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

  return (
    <div>
      {notiContextHolder}
        <Typography>
          <Title level={2}>Registration</Title>
        </Typography>
        <NotificationToast />
        <Spin spinning={loading} tip='loading...'>
          <Form
            form={regForm}
            layout="inline"
            onFinish={onFinish} >
            <Form.Item
              name="name"
              label="Patient Name"
              rules={[{ required: true }]}>
              <Input></Input>
            </Form.Item>
            <Form.Item
              name="age"
              label="Age"
              rules={[{ required: true }]}>
              <InputNumber />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Gender">
              <Select
                placeholder="Gender"
                options={generateOptions(GENDERS)}
                allowClear
              >
              </Select>
            </Form.Item>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, },]}>
              <Select
                placeholder="Visit Type"
                options={generateOptions(VISIT_TYPES)}
              >
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Spin>
    </div>
  );
}

export default RegistrationView;
