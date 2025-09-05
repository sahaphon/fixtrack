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
  const [filterDate, setFilterDate] = useState([
    dayjs().format('DD/MM/YYYY'),
    dayjs().format('DD/MM/YYYY'),
  ])
  const onDateChange = (dates, dateStrings) => {
    setFilterDate(dateStrings)
  }
  return (
    <>
      <Card style={{ borderRadius: 5 }}>
        <RangePicker
          style={{ marginBottom: '5px' }}
          defaultValue={[dayjs(), dayjs()]}
          onChange={onDateChange}
          format={'DD/MM/YYYY'}
        />
        <EVADashboard filterDate={filterDate} />
      </Card>
    </>
  )
}

export default Dashboard
