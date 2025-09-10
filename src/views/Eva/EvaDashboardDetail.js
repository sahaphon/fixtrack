import React, { useState, useEffect, useRef, use } from 'react'
import { useLoaderData, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Dropdown, Row, DatePicker, Flex, Select, Cascader, Spin } from 'antd'
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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
const { RangePicker } = DatePicker

const EvaDashboardDetail = () => {
  const storage = window.sessionStorage
  const { state } = useLocation()

  const [isLoading, setIsLoading] = useState(false)

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

  const [selectedShifts, setSelectedShifts] = useState(['A', 'B'])
  const options = [
    { label: 'กลางวัน', value: 'A' },
    { label: 'กลางคืน', value: 'B' },
  ]
  const handleShiftChange = (value) => {
    setSelectedShifts(value)
  }

  const [selectedMachines, setSelectedMachines] = useState(
    state?.machine ? [state.machine[0], state.machine] : [],
  )
  const [machineList, setMachineList] = useState([])
  const handleMachineChange = (value) => {
    console.log(value)
    setSelectedMachines(value)
  }
  const { getAllMachine } = serviceEva()
  useEffect(() => {
    loadMachineList()
  }, [])
  const loadMachineList = async () => {
    let list = await getAllMachine()
    if (list) {
      setMachineList(
        list.reduce((acc, cur) => {
          if (!acc.find((e) => e.value === cur.machine[0])) {
            acc.push({
              value: cur.machine[0],
              label: cur.machine[0],
              children: [{ value: cur.machine, label: cur.machine }],
            })
          } else {
            let line = acc.find((e) => e.value === cur.machine[0])
            line.children.push({ value: cur.machine, label: cur.machine })
          }
          return acc
        }, []),
      )
    }
  }

  const [target, setTarget] = useState('oee')
  const targetList = [
    { label: 'OEE', value: 'oee' },
    { label: 'Availability', value: 'availability' },
    { label: 'Performance', value: 'performance' },
    { label: 'Quality', value: 'quality' },
    { label: 'Waste', value: 'waste_qty' },
    { label: 'Production', value: 'qty' },
  ]

  function generateRandomRgbColor() {
    const r = Math.floor(Math.random() * 256) // Red component (0-255)
    const g = Math.floor(Math.random() * 256) // Green component (0-255)
    const b = Math.floor(Math.random() * 256) // Blue component (0-255)
    return `rgb(${r}, ${g}, ${b})`
  }
  let color_storage = JSON.parse(storage.getItem('machine_color'))
  if (!color_storage) {
    color_storage = {}
  }
  const addColorToStorage = (machine) => {
    if (!color_storage[machine]) {
      color_storage[machine] = generateRandomRgbColor()
    }
    storage.setItem('machine_color', JSON.stringify(color_storage))
  }

  const [graphData, setGraphData] = useState({ labels: [], datasets: [] })
  const [masterData, setMasterData] = useState([])
  const { getDashboardDetail } = serviceEva()
  useEffect(() => {
    loadGraphData()
  }, [filterDate, selectedShifts, selectedMachines])
  const loadGraphData = async () => {
    setIsLoading(true)
    let res = await getDashboardDetail({
      filter: {
        date: filterDate.map((e) => moment(e, 'DD/MM/YYYY').format('YYYY-MM-DD')),
        shift: selectedShifts,
        machine:
          selectedMachines.length > 0
            ? Array.isArray(selectedMachines[0])
              ? selectedMachines
              : [selectedMachines]
            : [],
      },
    })
    setMasterData(res)
    let data = res.reduce(
      (acc, cur) => {
        if (!acc.labels.includes(cur.data_date)) {
          acc.labels.push(cur.data_date)
        }
        if (!acc.datasets.find((item) => item.label === cur.machine)) {
          let color = color_storage[cur.machine] || addColorToStorage(cur.machine)
          acc.datasets.push({
            label: cur.machine,
            data: [],
            borderColor: color,
            backgroundColor: color,
          })
        }
        acc.datasets.find((item) => item.label === cur.machine).data.push(cur[target])
        return acc
      },
      { labels: [], datasets: [] },
    )
    setGraphData(data)
    setIsLoading(false)
  }
  useEffect(() => {
    let data = masterData.reduce(
      (acc, cur) => {
        if (!acc.labels.includes(cur.data_date)) {
          acc.labels.push(cur.data_date)
        }
        if (!acc.datasets.find((item) => item.label === cur.machine)) {
          let color = color_storage[cur.machine] || addColorToStorage(cur.machine)
          acc.datasets.push({
            label: cur.machine,
            data: [],
            borderColor: color,
            backgroundColor: color,
          })
        }
        acc.datasets.find((item) => item.label === cur.machine).data.push(cur[target])
        return acc
      },
      { labels: [], datasets: [] },
    )
    setGraphData(data)
  }, [target])

  return (
    <>
      <Card style={{ borderRadius: 5 }}>
        <Flex align="center" gap={8} style={{ marginBottom: '10px' }}>
          วันที่ :
          <RangePicker
            defaultValue={[dayjs(), dayjs()]}
            value={[dayjs(filterDate[0], 'DD/MM/YYYY'), dayjs(filterDate[1], 'DD/MM/YYYY')]}
            onChange={onDateChange}
            format={'DD/MM/YYYY'}
          />
          <div style={{ width: 20 }}></div>
          เครื่องจักร :
          <Cascader
            multiple
            style={{ width: '200px' }}
            placeholder="Please select"
            value={selectedMachines}
            onChange={handleMachineChange}
            options={machineList}
          />
          <div style={{ width: 20 }}></div>
          กะ :
          <Select
            mode="multiple"
            allowClear
            style={{ width: '200px' }}
            placeholder="Please select"
            value={selectedShifts}
            onChange={handleShiftChange}
            options={options}
          />
          <div style={{ flex: 1 }} />
          ข้อมูล :
          <Select
            style={{ width: '150px' }}
            placeholder="Please select"
            value={target}
            onChange={(value) => setTarget(value)}
            options={targetList}
          />
        </Flex>
        <Spin spinning={isLoading} tip="Loading..." size="large">
          <Line
            data={graphData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                },
                title: {
                  display: true,
                  text: 'EVA Dashboard Detail',
                },
                scales: {
                  x: {
                    grace: '5%',
                  },
                  y: {
                    type: 'linear',
                    beginAtZero: true,
                    grace: '5%',
                  },
                },
              },
            }}
          />
        </Spin>
      </Card>
    </>
  )
}

export default EvaDashboardDetail
