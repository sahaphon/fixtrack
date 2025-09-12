import React, { useState, useEffect, useRef } from 'react'
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Tooltip, Dropdown, Col, Row, Progress, Flex } from 'antd'
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

const success_color = '#52c41a'

const MachineCard = ({ machine, data }) => {
  const Navigate = useNavigate()
  const [calData, setCalData] = useState({ oee: 0, a: 0, p: 0, q: 0 })
  useEffect(() => {
    if (data) {
      let _calData = {
        ...data,
        a: (data.run_time / data.hours / 60) * 100,
        p: (data.qty / (data.active_hours * 144)) * 100,
        q: ((data.qty - data.waste_qty) / data.qty) * 100,
        good: data.qty - data.waste_qty,
      }
      setCalData({ ..._calData, oee: (_calData.a * _calData.p * _calData.q) / 10000 })
    }
  }, [data])

  return (
    <>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 12 }}
        lg={{ span: 12 }}
        xl={{ span: 8 }}
        xxl={{ span: 6 }}
        onClick={() => Navigate(`/dashboard/eva/detail`, { state: { machine: machine } })}
      >
        <Card style={{ borderRadius: 5, background: 'transparent !important' }}>
          <Flex gap={'small'} align="center" direction="column" wrap>
            <Flex
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '50px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flex: 2,
                  justifyContent: 'center' /* Centers content horizontally */,
                  alignItems: 'center' /* Centers content vertically */,
                  fontSize: 30,
                }}
              >
                {machine}
              </div>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'center' /* Centers content horizontally */,
                  alignItems: 'center' /* Centers content vertically */,
                }}
              >
                {/* {data.status} */}
              </div>
            </Flex>
            <Progress
              type="dashboard"
              percent={calData.oee}
              style={{ marginRight: 10 }}
              gapDegree={30}
              size={90}
              strokeColor={calData.oee > 70 ? '#B7EB8F' : '#FF4D4F'}
              format={(percent) => numeral(percent).format('0,0') + '%'}
            />
            <Flex style={{ flex: 1 }} vertical gap="small">
              <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'inline', gap: 5 }}>
                A
                <Progress
                  percent={calData.a}
                  size={['default', 10]}
                  strokeColor={calData.a > 90 ? '#B7EB8F' : '#FF4D4F'}
                  format={(percent) => numeral(percent).format('0,0.00') + '%'}
                />
              </div>
              <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', gap: 5 }}>
                P
                <Progress
                  percent={calData.p}
                  size={['default', 10]}
                  strokeColor={calData.p > 80 ? '#B7EB8F' : '#FF4D4F'}
                  format={(percent) => numeral(percent).format('0,0.00') + '%'}
                />
              </div>
              <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', gap: 5 }}>
                Q
                <Progress
                  percent={calData.q}
                  size={['default', 10]}
                  strokeColor={calData.q > 96 ? '#B7EB8F' : '#FF4D4F'}
                  format={(percent) => numeral(percent).format('0,0.00') + '%'}
                />
              </div>
            </Flex>
            <Flex gap="large">
              <Flex
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start',
                  width: '90px',
                }}
              >
                <div>เป้า: {calData.active_hours * 144 ?? 0}</div>
                <div>ยอด:{calData.qty ?? 0}</div>
              </Flex>
              <Flex
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start',
                  width: '90px',
                }}
              >
                <div>ของดี: {calData.good ?? 0}</div>
                <div>ยอดโอน:{calData.wip_qty ?? 0}</div>
              </Flex>
              <Flex
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start',
                  width: '90px',
                }}
              >
                <div>ของเสีย: {calData.waste_qty ?? 0}</div>
                <div>ยอดโอน:{calData.waste_bar_qty ?? 0}</div>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </Col>
    </>
  )
}

export default MachineCard
