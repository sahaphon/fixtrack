import React, { useState, useEffect, useRef } from 'react'
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Tooltip, Dropdown, Row, DatePicker } from 'antd'
import serviceEva from '../../service/ServiceEva'
import {
  FolderViewOutlined,
  MoreOutlined,
  CloseCircleTwoTone,
  CheckCircleTwoTone,
  SnippetsOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import numeral from 'numeral'
import EVADashboard from '../Eva/EvaDashboard'
import dayjs from 'dayjs'
const { RangePicker } = DatePicker
const Dashboard = () => {
  const storage = window.sessionStorage
  const [filterDate, setFilterDate] = useState([
    dayjs().format('DD/MM/YYYY'),
    dayjs().format('DD/MM/YYYY'),
  ])
  const onDateChange = (dates, dateStrings) => {
    setFilterDate(dateStrings)
    storage.setItem('dashboard_date', JSON.stringify(dateStrings))
  }

  useEffect(() => {
    let saved_date = JSON.parse(storage.getItem('dashboard_date'))
    if (saved_date) {
      setFilterDate(saved_date)
    } else {
      storage.setItem(
        'dashboard_date',
        JSON.stringify([dayjs().format('DD/MM/YYYY'), dayjs().format('DD/MM/YYYY')]),
      )
    }
  }, [])
  return (
    <>
      <Card style={{ borderRadius: 5 }}>
        <RangePicker
          style={{ marginBottom: '5px' }}
          defaultValue={[dayjs(), dayjs()]}
          value={[dayjs(filterDate[0], 'DD/MM/YYYY'), dayjs(filterDate[1], 'DD/MM/YYYY')]}
          onChange={onDateChange}
          format={'DD/MM/YYYY'}
        />
        <EVADashboard filterDate={filterDate} />
      </Card>
    </>
  )
}

export default Dashboard
