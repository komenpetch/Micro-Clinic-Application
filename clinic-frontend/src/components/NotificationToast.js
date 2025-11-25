import React from 'react';
import useWebSocket from 'react-use-websocket';
import propTypes from "prop-types";
import { SendOutlined } from '@ant-design/icons';
import { notification } from 'antd';

const WEBSOCKET_URL = process.env.REACT_APP_WS_NOTIFICATION_URL
const EXCH_NEW_PATIENT = process.env.REACT_APP_EXCH_NEW_PATIENT
const EXCH_EXAMINED = process.env.REACT_APP_EXCH_EXAMINED

const KEY_EVENT = 'EVENT'
const KEY_DATA = 'DATA'

export default function NotificationToast(props) {
  const [api, contextHolder] = notification.useNotification();
  const { lastMessage } = useWebSocket(WEBSOCKET_URL, {
    shouldReconnect: (closeEvent) => true
  });

  const getNotificationDescription = (data) => {
    const contentObj = JSON.parse(data[KEY_DATA])
    if (data[KEY_EVENT] === EXCH_NEW_PATIENT) {
      return `New Patient ${contentObj.name} coming to ${contentObj.type} department.`
    }
    else if (data[KEY_EVENT] === EXCH_EXAMINED) {
      return `Patient ${contentObj.patient.name} has been diagnosed with ${contentObj.note}`
    }
    else {
      return "Unknown event..."
    }
  }

  const getNotficationTitle = (data) => {
    return data[KEY_EVENT]
  }

  const handleNotificationMessage = (data) => {
    api.open({
      message: getNotficationTitle(data),
      description: getNotificationDescription(data),
      icon: (<SendOutlined />),
    });
    props.onNotify(data)
  }

  React.useEffect(() => {
    if (lastMessage) {
      handleNotificationMessage(JSON.parse(lastMessage.data))
    }
  }, [lastMessage])


  return (<>{contextHolder}</>)
}

NotificationToast.defaultProps = {
  onNotify: (data) => null,
}

NotificationToast.prototype = {
  onNotify: propTypes.func,
}

