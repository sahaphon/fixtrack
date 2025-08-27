import { Card, Col, DatePicker, Form, Row, Select, Table } from 'antd'
import React, { useState, useEffect, useRef } from 'react'
import serviceEva from '../../service/ServiceEva'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import dayjs from 'dayjs'

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
    },
  ]
  for (let i = 0; i < 12; i++) {
    columns.push({
      title: () => (
        <label
          style={{ fontWeight: 'bold' }}
        >{`${start_date.add(1, 'hours').format('HH:mm')}-${end_date.add(1, 'hours').format('HH:mm')}`}</label>
      ),
      dataIndex: `${i}`,
      key: `${i}`,
      width: 30,
      align: 'center',
    })
  }
  columns.push({
    title: () => <label style={{ fontWeight: 'bold' }}>{'รวม'}</label>,
    dataIndex: `total`,
    key: `total`,
    width: 30,
    align: 'center',
  })

  const handleLoadData = async () => {
    setIsLoading(true)
    const res = await getDetail({ machine, shift, date: date.format('DD/MM/YYYY') })
    setDataTable(res.map((e) => ({ ...e, key: e.topic })))
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexDirection: 'row' }}>
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
