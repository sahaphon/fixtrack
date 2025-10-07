import React, { useState, useEffect, useRef } from 'react'
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Tooltip, Dropdown, Col, Row, Progress, Flex, Tag } from 'antd'
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
import { _ } from 'ajv'
import { NUM_FORMAT } from '../../config'

const success_color = '#52c41a'

const HeadCard = ({ name, data }) => {
  const [calData, setCalData] = useState({ oee: 0, a: 0, p: 0, q: 0 })
  useEffect(() => {
    if (data) {
      let _calData = {
        ...data,
        a: (1 - data.down_time / data.active_hours / 60) * 100,
        p: (data.qty / data.target) * 100,
        q: ((data.qty - data.waste_qty) / data.qty) * 100,
        good: data.qty - data.waste_qty,
      }
      setCalData({ ..._calData, oee: (_calData.a * _calData.p * _calData.q) / 10000 })
    }
  }, [data])

  return (
    <Flex
      style={{ borderRadius: 5, backgroundColor: 'transparent' }}
      gap={'large'}
      align="center"
      direction="column"
      wrap
    >
      <Flex
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '90px',
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
          {name}
        </div>
      </Flex>
      <Progress
        type="dashboard"
        percent={calData.oee}
        gapDegree={30}
        size={90}
        strokeColor={calData.oee > 70 ? '#B7EB8F' : '#FF4D4F'}
        format={(percent) => numeral(percent).format('0,0') + '%'}
      />
      <Flex style={{ flex: 1, maxWidth: '400px' }} vertical gap="small">
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

      <Flex style={{ flexDirection: 'column', alignItems: 'start' }}>
        <Row gutter={[16, 16]}>
          <Col>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'start',
              }}
            >
              ยอด: {numeral(calData.qty).format(NUM_FORMAT.D0)} /{' '}
              {numeral(calData.active_hours * 144).format(NUM_FORMAT.D0)}
            </div>
          </Col>
          <Col style={{ flexDirection: 'row', display: 'flex', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'start',
              }}
            >
              ของดี: {numeral(calData.good).format(NUM_FORMAT.D0)} (
              <div>{numeral(calData.good - calData.wip_qty).format(NUM_FORMAT.D0)}</div>)
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'start',
                color: calData.waste_qty - calData.waste_bar_qty !== 0 ? 'red' : 'green',
              }}
            >
              ของเสีย: {numeral(calData.waste_qty).format(NUM_FORMAT.D0)} (
              <div>{numeral(calData.waste_qty - calData.waste_bar_qty).format(NUM_FORMAT.D0)}</div>)
            </div>
          </Col>
        </Row>
      </Flex>
    </Flex>
  )
}

export default HeadCard
