import React, { useState, useEffect, useRef } from 'react'
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Tooltip, Dropdown } from 'antd'
import serviceEva from '../../service/ServiceEva'
import {
  FolderViewOutlined,
  MoreOutlined,
  CloseCircleTwoTone,
  CheckCircleTwoTone,
  SnippetsOutlined,
} from '@ant-design/icons'
import TableComponentForwardRef from '../../components/Table/TableComponentForwardRef'
import Btn from '../../components/Button/BtnComponent'
import moment from 'moment'
import numeral from 'numeral'
import { ESearchType } from '../../components/Table/Search'

const EVATable = () => {
  const { getAllMachine, getOEE } = serviceEva()
  const { permission } = useLoaderData()

  const Navigate = useNavigate()
  const tableRef = useRef()
  const storage = window.sessionStorage

  const [Data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [LoadingTable, setLoadingTable] = useState(false)
  const [total, setTotal] = useState(0)

  const searchTypeList = [
    {
      value: 'machine',
      label: 'เครื่องจักร',
      type: ESearchType.TEXT,
    },
    {
      value: 'date',
      label: 'วันที่',
      type: ESearchType.DATE,
    },
  ]

  const items = (record) => {
    return [
      {
        label: 'มุมมอง',
        key: 'view',
        icon: <FolderViewOutlined />,
        // disabled: permission.view
      },
    ]
  }

  const columns = [
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'เครื่อง'}</label>,
      dataIndex: 'machine',
      key: 'machine',
      width: 30,
      align: 'center',
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'กะ'}</label>,
      dataIndex: 'shift',
      key: 'shift',
      width: 30,
      align: 'center',
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'วันที่'}</label>,
      dataIndex: 'data_date',
      key: 'data_date',
      width: 70,
      align: 'center',
      render: (text, record) => (text ? moment.utc(text).format('DD/MM/YYYY') : ''),
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'OEE'}</label>,
      dataIndex: 'oee',
      key: 'oee',
      width: 70,
      align: 'center',
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'อัตราการเดินเครื่อง'}</label>,
      dataIndex: 'availability',
      key: 'availability',
      width: 70,
      align: 'center',
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'ประสิทธิภาพ'}</label>,
      dataIndex: 'performance',
      key: 'performance',
      width: 70,
      align: 'center',
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'คุณภาพ'}</label>,
      dataIndex: 'quality',
      key: 'quality',
      width: 70,
      align: 'center',
    },
  ]

  const loadData = async (type, search, offset, limit) => {
    setIsLoading(true)

    const res = await getOEE({
      limit: limit,
      offset: offset,
      search: search,
      type_search: type,
      filter: {},
    })
    console.log('data', res)

    if (res != undefined) {
      const data = res.result.map((value, index) => {
        return {
          ...value,
          key: value.machine + value.data_date + value.shift,
          performance: numeral((value.qty * 100) / (value.active_hours * 144)).format('0.00') + '%',
          quality: numeral(((value.qty - value.waste_qty) * 100) / value.qty).format('0.00') + '%',
          availability:
            numeral((value.run_time * 100) / (value.active_hours * 60)).format('0.00') + '%',
          oee:
            numeral(
              (value.qty / (value.active_hours * 144)) *
                ((value.qty - value.waste_qty) / value.qty) *
                (value.run_time / (value.active_hours * 60)) *
                100,
            ).format('0.00') + '%',
        }
      })
      setData(data)
      setTotal(res.total)
      console.log('res', res)
    }
    setIsLoading(false)
  }

  const handleMenuClick = (record, key) => {
    switch (key) {
      case 'view':
        console.log('record', record)
        Navigate('/eva/detail', { state: record })
        break
      default:
    }
  }

  const refresh = () => {
    tableRef.current.refresh()
  }

  return (
    <>
      <Card style={{ borderRadius: 5 }}>
        <TableComponentForwardRef
          autoFocus={true}
          ref={tableRef}
          rowKey={'key'}
          className="EvaTable"
          dataSource={Data}
          columns={columns}
          scroll={{ y: 600 }}
          tableLayout={'fixed'}
          onSearch={loadData}
          total={total}
          searchList={searchTypeList}
          isLoading={isLoading}
          createdColumn={false}
          editColumn={false}
          // searchStyle={{ marginBottom: 20 }}
          style={{ marginTop: 20 }}
          handleMenuClick={handleMenuClick}
        />
      </Card>
    </>
  )
}

export default EVATable
