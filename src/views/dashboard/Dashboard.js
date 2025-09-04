import React, { useState, useEffect, useRef } from 'react'
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Tooltip, Dropdown, Row } from 'antd'
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

const Dashboard = () => {
  return (
    <>
      <Card style={{ borderRadius: 5 }}>
        <EVADashboard />
      </Card>
    </>
  )
}

export default Dashboard
