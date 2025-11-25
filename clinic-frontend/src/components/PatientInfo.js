import React from 'react'
import propTypes from "prop-types";
import axios from 'axios'
import "../App.css"
import { Spin, Descriptions, Alert } from 'antd';
import { URL_REGISTRATION } from '../constants/urls';


export default function PatientInfo(props) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [items, setItems] = React.useState([])

  const fetchData = async (id) => {
    try {
      setLoading(true)
      const resp = await axios.get(`${URL_REGISTRATION.GET_PATIENT}${id}`)
      setItems(Object.keys(resp.data)
      .filter(field => field !== 'id')
      .map(field => ({
        key: field,
        label: field,
        children: resp.data[field]
      })))
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

  React.useEffect(() => {
    if(props.patientId != null) {
      fetchData(props.patientId)
    }
  }, [props.patientId])

  return (
    <Spin spinning={loading}>
      { error == null ?
        <Descriptions title='Patient Info' items={items} size='small' bordered /> :
        <Alert {...error} />
      }
    </Spin>
  );
}

PatientInfo.defaultProps = {
  patientId: null,
}

PatientInfo.prototype = {
  patientId: propTypes.number,
}
