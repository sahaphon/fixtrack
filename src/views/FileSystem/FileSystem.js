import React, { useEffect, useState, useRef } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, Image, Avatar } from 'antd'
import {
  LoadingOutlined,
  UserOutlined,
  LockOutlined,
  CodeOutlined,
  ShopOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

import { alertConfirm } from '../../components/Alert/Alert'
import Btn from '../../components/Button/BtnComponent'
import { getUserProfile } from '../../service/ServiceLogin'
import TableComponentForwardRef from '../../components/Table/TableComponentForwardRef'
import { ServiceFile } from '../../service/ServiceFile'

const FileSystem = () => {
  const history = useNavigate()
  const tableRef = useRef()
  const { deleteMenu, getMenu } = ServiceFile()

  const [Data, setData] = useState([])
  const [TotalPage, setTotalPage] = useState(0)
  const [LoadingTable, setLoadingTable] = useState(false)
  const [openModalAddMenu, setOpenModalAddMenu] = useState(false)

  const columns = [
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'รหัสแฟ้ม'}</label>,
      dataIndex: 'menu_id',
      key: 'menu_id',
      sorter: (a, b) => a.menu_id.localeCompare(b.menu_id),
      width: 90,
      align: 'center',
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'ชื่อแฟ้มระบบงาน'}</label>,
      dataIndex: 'menu_name',
      key: 'menu_name',
      sorter: (a, b) => a.menu_name.localeCompare(b.menu_name),
      width: 500,
    },
  ]

  const items = [
    {
      label: 'แก้ไข',
      key: 'edit',
      icon: <EditOutlined />,
    },
    {
      type: 'divider',
    },
    {
      label: 'ลบ',
      key: 'delete',
      icon: <DeleteOutlined />,
    },
  ]

  useEffect(() => {
    admin()
  }, [])

  const admin = async () => {
    const data = await getUserProfile()
    if (data === undefined) history('/')
    if (data?.user_level !== 'A') {
      history('/')
    }
  }

  const loadData = async (type, search, offset, limit) => {
    setLoadingTable(true)
    const res = await getMenu({
      offset: offset,
      limit: limit,
      search: search,
      type_search: type,
    })

    if (res !== undefined) {
      const data = res.result.map((value) => {
        return { ...value, key: value.menu_id }
      })
      setData(data)
      setTotalPage(res.total)
    }

    setLoadingTable(false)
  }

  const handleMenuClick = (record, key) => {
    switch (key) {
      case 'edit':
        history(`/menu/edit?docno=${record.menu_id}`, { send_data: record })
        break
      case 'delete':
        handleDelete(record)
        break
      default:
    }
  }

  const handleDelete = async (record) => {
    alertConfirm({
      alert_Title: 'คุณต้องการลบรายการ',
      alert_text: `รหัส ${record.menu_id} ชื่อแฟ้ม ${record.menu_name} ใช่หรือไม่ ?`,
      onConfirm: async () => {
        const params = {
          menu_id: record.menu_id,
        }

        return await deleteMenu(params).finally(() => {})
      },
      success: {
        success_text: 'ลบข้อมูลเรียบร้อยแล้ว',
        callback: async () => {
          refresh()
        },
      },
    })
  }

  const refresh = async () => {
    tableRef.current.refresh()
  }

  const searchOption = [
    {
      label: 'รหัสเมนู',
      value: 'menu_id',
      placeholder: 'ค้นหา รหัสเมนู',
    },
    {
      label: 'ชื่อเมนู',
      value: 'menu_name',
      placeholder: 'ค้นหา ชื่อเมนู',
    },
  ]

  return (
    <Card>
      <TableComponentForwardRef
        ref={tableRef}
        searchList={searchOption}
        rowKey={'key'}
        className={'file-system-table'}
        dataSource={Data}
        columns={columns}
        tableLayout={'fixed'}
        onSearch={loadData}
        total={TotalPage}
        isLoading={LoadingTable}
        style={{ marginTop: 10 }}
        menuItems={items}
        handleMenuClick={handleMenuClick}
        selectStyle={{
          width: '150px',
        }}
        MenuBtn={() => {
          return (
            <Btn.Add
              disabled={false}
              style={{ marginLeft: 10 }}
              onClick={() => history(`/menu/add`)}
            />
          )
        }}
      />
    </Card>
  )
}

export default FileSystem
