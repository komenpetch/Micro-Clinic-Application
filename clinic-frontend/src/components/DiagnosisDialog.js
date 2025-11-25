import React from 'react'
import propTypes from "prop-types";
import axios from 'axios'
import "../App.css"
import { Modal, Form, Input, InputNumber, Alert } from 'antd';
import { URL_EXAMINATION } from '../constants/urls';
import PatientInfo from './PatientInfo';

const { TextArea } = Input;


export default function DiagnosisDialog(props) {
  const [examForm] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [diagnosis, setDiagnosis] = React.useState(null)

  React.useEffect(() => {
    if(props.open && props.patient.id) {
      fetchDiagnosis()
    }
  }, [props.open])

  const fetchDiagnosis = async () => {
    examForm.resetFields()
    try {
      setLoading(true)
      setError(null)
      const resp = await axios.get(`${URL_EXAMINATION.DIAGNOSIS}${props.patient.id}`)
      setDiagnosis(resp.data)
      examForm.setFieldsValue({...resp.data})
    } catch (error) {
      console.log(error)
      setError({
        message: `HTTP Error with code : ${error.code}`,
        description: error.response.data ? JSON.stringify(error.response.data) : 'Please see logs'
      })
    } finally {
      setLoading(false)
    }
  }

  const submitDiagnosis = async (values) => {
    if(diagnosis != null) {
      props.onClose()
      return;
    }

    try {
      setLoading(true)
      setError(null)
      const data = { ...values, patient_id: props.patient.id}
      await axios.post(URL_EXAMINATION.DIAGNOSIS, data)
      props.onClose()
    } catch (error) {
      console.log(error)
      setError({
        message: `HTTP Error with code : ${error.code}`,
        description: error.response.data ? JSON.stringify(error.response.data) : 'Please see logs'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal 
      title='Doctor Diagnosis' 
      confirmLoading={loading}
      onOk={examForm.submit}
      onCancel={() => props.onClose()}
      width={700}
      {...props}>
      <PatientInfo patientId={props.patient ? props.patient.id : null}/>
      <Form form={examForm} onFinish={submitDiagnosis} style={{padding: '20px'}}>
        <Form.Item
          name="note"
          label="Diagnosis Note"
          rules={[{ required: true }]}>
          <TextArea disabled={diagnosis != null}/>
        </Form.Item>
        <Form.Item
          name="doctor_fee"
          label="Doctor Fee"
          rules={[{ required: true }]}>
          <InputNumber disabled={diagnosis != null} />
        </Form.Item>
      </Form>
      {error != null && 
        <Alert {...error} />
      }
    </Modal>
  );
}

DiagnosisDialog.defaultProps = {
  patient: null,
  onClose: () => null,
}

DiagnosisDialog.prototype = {
  patient: propTypes.any,
  onClose: propTypes.func,
  // Other properties from antd modal
}
