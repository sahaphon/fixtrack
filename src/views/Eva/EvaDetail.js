import { Card, Col, DatePicker, Form, Row, Select, Table, Tooltip } from 'antd'
import React, { useState, useEffect, useRef } from 'react'
import serviceEva from '../../service/ServiceEva'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import dayjs from 'dayjs'

const lost_topic = [
  'แก้เม็ด',
  'รอเม็ด',
  'ปิดเครื่อง',
  'เปลี่ยนเม็ด',
  'ซ่อมเครื่อง',
  'ซ่อมโมลด์',
  'เปลี่ยนโมลด์',
  'ฉีดเก็บSize',
]
const lost_tpoic_detail = ['ซ่อมเครื่อง', 'ซ่อมโมลด์', 'เปลี่ยนโมลด์', 'ฉีดเก็บSize']
const lost_detail_value = {
  ซ่อมโมลด์: { 1: 'ซ้าย', 2: 'ขวา', 3: 'ซ้าย+ขวา' },
  เปลี่ยนโมลด์: { 1: 'ซ้าย', 2: 'ขวา', 3: 'ซ้าย+ขวา' },
  ฉีดเก็บSize: { 1: 'ซ้าย', 2: 'ขวา', 3: 'ซ้าย+ขวา' },
}

const EVADetail = () => {
  const location = useLocation()
  const data = location.state

  const { getDetail, getAllMachine } = serviceEva()

  const [dataTable, setDataTable] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [machine, setMachine] = useState(data.machine)
  const [machineOptions, setMachineOptions] = useState([])
  const [shift, setShift] = useState(data.shift)
  const [date, setDate] = useState(dayjs(data.data_date))

  const start_date = moment(date).hours(shift === 'A' ? 6 : 18)
  const end_date = moment(date).hours(shift === 'A' ? 7 : 19)

  const columns = [
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'เวลา'}</label>,
      dataIndex: 'topic',
      key: 'topic',
      width: 30,
      align: 'center',
      render: (text, record) => {
        // Conditionally highlight the cell based on the 'amount' value

        return {
          props: {
            style: {},
          },
          children: <div>{text}</div>,
        }
      },
    },
  ]
  for (let i = 0; i < 12; i++) {
    columns.push({
      title: () => (
        <label
          style={{ fontWeight: 'bold' }}
        >{`${start_date.add(1, 'hours').format('HH:mm')} - ${end_date.add(1, 'hours').format('HH:mm')}`}</label>
      ),
      dataIndex: `${i}`,
      key: `${i}`,
      width: 30,
      align: 'center',
      render: (text, record) => {
        // Conditionally highlight the cell based on the 'amount' value
        const cellStyle = {
          background: 'rgb(221.7, 90.3, 90.3)',
        }

        return lost_topic.includes(record.topic)
          ? {
              props: {
                style: text ? cellStyle : {},
              },
              children: (
                <Tooltip
                  placement="top"
                  title={text ? (text.length > 0 ? `${text[0].down} นาที` : '') : ''}
                >
                  <div style={{ color: '#080a0c' }}>
                    {lost_tpoic_detail.includes(record.topic)
                      ? text
                        ? text.map((item, index) => (
                            <div key={index}>
                              {`${item.station} ${record.topic in lost_detail_value ? lost_detail_value[record.topic][item.value] : ''}`}
                              <br />
                            </div>
                          ))
                        : null
                      : text === 1
                        ? ''
                        : null}
                  </div>
                </Tooltip>
              ),
            }
          : {
              props: {
                style: {},
              },
              children: <div>{text}</div>,
            }
      },
    })
  }
  columns.push({
    title: () => <label style={{ fontWeight: 'bold' }}>{'รวม'}</label>,
    dataIndex: `total`,
    key: `total`,
    width: 30,
    align: 'center',
    render: (text, record) => {
      // Conditionally highlight the cell based on the 'amount' value

      return {
        props: {
          style: {},
        },
        children: <div>{text}</div>,
      }
    },
  })

  const handleLoadData = async () => {
    setIsLoading(true)
    const res = await getDetail({ machine, shift, date: date.format('DD/MM/YYYY') })
    const _data = res.map((e) => ({ ...e, key: e.topic }))
    setDataTable(_data)
    setIsLoading(false)
  }

  const loadAllMachine = async () => {
    const res = await getAllMachine()
    setMachineOptions(res.map((e) => ({ label: e.machine, value: e.machine })))
  }

  useEffect(() => {
    loadAllMachine()
  }, [])

  useEffect(() => {
    handleLoadData()
  }, [machine, shift, date])

  return (
    <>
      <Card style={{ borderRadius: 5 }}>
        <div style={{ marginBottom: 20 }}>
          <Form>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, flexDirection: 'row' }}>
              <div>เครื่องฉีด Eva</div>
              <Form.Item label="เครื่องจักร">
                <Select
                  value={machine}
                  options={machineOptions}
                  style={{ width: 100 }}
                  onChange={(value) => setMachine(value)}
                />
              </Form.Item>
              <Form.Item label="กะ">
                <Select
                  options={[
                    { label: 'กลางวัน', value: 'A' },
                    { label: 'กลางคืน', value: 'B' },
                  ]}
                  value={shift}
                  onChange={(value) => setShift(value)}
                  style={{ width: 100, marginLeft: 20 }}
                />
              </Form.Item>
              <Form.Item label="วันที่">
                <DatePicker
                  value={date}
                  onChange={(value) => setDate(value)}
                  format={'DD/MM/YYYY'}
                />
              </Form.Item>
            </div>
          </Form>
        </div>
        <Table dataSource={dataTable} loading={isLoading} columns={columns} pagination={false} />
      </Card>
    </>
  )
}
export default EVADetail
