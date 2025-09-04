import React, { useState, useEffect, useRef, use } from 'react'
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Tooltip, Dropdown, Row, Collapse } from 'antd'
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
import MachineCard from '../dashboard/MachineCard'
import FilterComponent from '../../components/Table/Filter'
import Btn from '../../components/Button/BtnComponent'
import HeadCard from '../dashboard/HeadCard'
import { start } from '@popperjs/core'

const LineCollapse = ({ line, line_data }) => {
  return (
    <Collapse
      items={[
        {
          key: `EVA - ${line}`,
          label: <HeadCard name={`${line}`} data={line_data} />,
          children: line_data ? (
            <Row gutter={[16, 16]}>
              {line_data.machine_data.map((e) => (
                <MachineCard key={e.machine} machine={e.machine} data={e} />
              ))}
            </Row>
          ) : null,
        },
      ]}
    />
  )
}

const EVADashboard = () => {
  const { getDashboard } = serviceEva()
  const { permission } = useLoaderData()

  const Navigate = useNavigate()
  const tableRef = useRef()
  const storage = window.sessionStorage

  const [filterVisibility, setFilterVisibility] = useState(false)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    let data = await getDashboard({ filter: { date: ['2025-08-18', '2025-08-22'] } })
    setData(
      data.reduce(
        (acc, cur) => ({
          qty: (acc.qty || 0) + cur.qty,
          hours: (acc.hours || 0) + cur.hours,
          waste_qty: (acc.waste_qty || 0) + cur.waste_qty,
          run_time: (acc.run_time || 0) + cur.run_time,
          lost_time: (acc.lost_time || 0) + cur.lost_time,
          down_time: (acc.down_time || 0) + cur.down_time,
          waste_bar_qty: (acc.waste_bar_qty || 0) + cur.waste_bar_qty,
          wip_qty: (acc.wip_qty || 0) + cur.wip_qty,
          lineData: acc.lineData
            ? {
                ...acc.lineData,

                [cur.machine[0]]: {
                  qty: (acc.lineData[cur.machine[0]].qty || 0) + cur.qty,
                  hours: (acc.lineData[cur.machine[0]].hours || 0) + cur.hours,
                  waste_qty: (acc.lineData[cur.machine[0]].waste_qty || 0) + cur.waste_qty,
                  run_time: (acc.lineData[cur.machine[0]].run_time || 0) + cur.run_time,
                  lost_time: (acc.lineData[cur.machine[0]].lost_time || 0) + cur.lost_time,
                  down_time: (acc.lineData[cur.machine[0]].down_time || 0) + cur.down_time,
                  waste_bar_qty:
                    (acc.lineData[cur.machine[0]].waste_bar_qty || 0) + cur.waste_bar_qty,
                  wip_qty: (acc.lineData[cur.machine[0]].wip_qty || 0) + cur.wip_qty,
                  machine_data: [...acc.lineData[cur.machine[0]].machine_data, cur],
                },
              }
            : {
                [cur.machine[0]]: {
                  qty: cur.qty,
                  hours: cur.hours,
                  waste_qty: cur.waste_qty,
                  run_time: cur.run_time,
                  lost_time: cur.lost_time,
                  down_time: cur.down_time,
                  waste_bar_qty: cur.waste_bar_qty,
                  wip_qty: cur.wip_qty,
                  machine_data: [cur],
                },
              },
        }),
        {},
      ),
    )
    setIsLoading(false)
  }

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <>
      <Collapse
        items={[
          {
            key: 'EVA',
            label: <HeadCard name={'EVA'} data={data} />,
            children: data.lineData
              ? Object.entries(data.lineData).map(([key, value]) => (
                  <LineCollapse key={key} line={key} line_data={value} />
                ))
              : null,
            // extra: (
            // <Btn.Filter
            //   style={{ marginLeft: 'auto' }}
            //   onClick={() => {
            //     setFilterVisibility(true)
            //   }}
            // >
            //   Filter
            // </Btn.Filter>
            // ),
          },
        ]}
      />
      <FilterComponent visible={{ get: filterVisibility, set: setFilterVisibility }} />
    </>
  )
}

export default EVADashboard
