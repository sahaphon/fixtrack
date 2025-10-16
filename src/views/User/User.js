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
  CloseCircleTwoTone,
  CheckCircleTwoTone,
  CrownTwoTone,
  CopyOutlined,
  SyncOutlined,
} from '@ant-design/icons'

import { alertConfirm } from '../../components/Alert/Alert'
import moment from 'moment'
import numeral from 'numeral'
import Btn from '../../components/Button/BtnComponent'
import { getUserProfile } from '../../service/ServiceLogin'
import TableComponentForwardRef from '../../components/Table/TableComponentForwardRef'
import { ServiceUser } from '../../service/ServiceUser'

const User = () => {
  const history = useNavigate()
  const tableRef = useRef(null)
  const { getUser, deleteUser, changeStatusUser } = ServiceUser()

  const [Data, setData] = useState([])
  const [TotalPage, setTotalPage] = useState(0)
  const [LoadingTable, setLoadingTable] = useState(false)
  const [openModalAddMenu, setOpenModalAddMenu] = useState(false)

  const searchOption = [
    { value: 'user_id', label: 'ชื่อผู้ใช้งาน', placeholder: 'ค้นหา ชื่อผู้ใช้งาน' },
    { value: 'emp_id', label: 'รหัสพนักงาน', placeholder: 'ค้นหา รหัสพนักงาน' },
    { value: 'name', label: 'ชื่อพนักงาน', placeholder: 'ค้นหา ชื่อ นามสกุล' },
    { value: 'department_id', label: 'รหัสแผนก', placeholder: 'ค้นหา รหัสแผนก' },
    { value: 'department_name', label: 'แผนก', placeholder: 'ค้นหา ชื่อแผนก' },
  ]

  const columns = [
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'Level'}</label>,
      key: 'Level',
      children: [
        {
          title: () => <label style={{ fontWeight: 'bold' }}>{''}</label>,
          dataIndex: 'user_level',
          key: 'user_level1',
          width: 50,
          align: 'center',
          render: (text, record) =>
            text === 'A' ? (
              <CrownTwoTone twoToneColor="#D4AF37" style={{ display: 'inline-grid' }} />
            ) : (
              <UserOutlined style={{ display: 'inline-grid' }} />
            ),
        },
        {
          title: () => <label style={{ fontWeight: 'bold' }}>{'สถานะ'}</label>,
          dataIndex: 'user_level',
          key: 'user_level2',
          sorter: (a, b) => a.user_level.localeCompare(b.user_level),
          width: 100,
          render: (text, record) => (text === 'A' ? 'Admin' : 'User'),
        },
      ],
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'User ID'}</label>,
      dataIndex: 'emp_id',
      key: 'emp_id',
      sorter: (a, b) => a.emp_id.localeCompare(b.emp_id),
      width: 100,
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'ชื่อ-นามสกุล'}</label>,
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      width: 300,
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'Level'}</label>,
      dataIndex: 'level_manager',
      key: 'level_manager',
      sorter: (a, b) => a.level_manager.localeCompare(b.level_manager),
      width: 70,
      align: 'center',
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'ตำแหน่ง'}</label>,
      dataIndex: 'position',
      key: 'position',
      sorter: (a, b) => {
        if (a.position !== null && b.position !== null) {
          a.position.localeCompare(b.position)
        }
      },
      width: 180,
      render: (text, record) => (text ? (text === 'null' ? '' : text) : ''),
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'แผนก'}</label>,
      dataIndex: 'department_description',
      key: 'department_name',
      sorter: (a, b) => {
        if (a.department_name !== null && b.department_name !== null) {
          a.department_name.localeCompare(b.department_name)
        }
      },
      width: 380,
      render: (text, record) => (text ? (text === 'null' ? '' : text) : ''),
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'สิทธ์เข้าใช้งาน'}</label>,
      key: 'permiss',
      children: [
        {
          title: () => <label style={{ fontWeight: 'bold' }}>{''}</label>,
          dataIndex: 'is_active',
          key: 'status_user1',
          width: 50,
          align: 'center',
          render: (text, record) =>
            text ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            ) : (
              <CloseCircleTwoTone twoToneColor="#eb2f96" />
            ),
        },
        {
          title: () => <label style={{ fontWeight: 'bold' }}>{'สถานะ'}</label>,
          dataIndex: 'is_active',
          key: 'status_user2',
          width: 120,
          render: (text, record) => (text ? 'อนุญาต' : 'ไม่อนุญาต'),
        },
      ],
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'เข้าใช้งานล่าสุด'}</label>,
      dataIndex: 'last_login',
      key: 'last_login',
      width: 150,
      align: 'center',
      sorter: (a, b) => moment(a.last_login).unix() - moment(b.last_login).unix(),
      render: (text, record) => (text ? moment.utc(text).format('DD/MM/YYYY HH:mm') : ''),
    },
  ]

  const items = [
    {
      label: 'แก้ไข',
      key: 'edit',
      icon: <EditOutlined />,
    },
    {
      label: 'คัดลอก',
      key: 'copy',
      icon: <CopyOutlined />,
    },
    {
      type: 'divider',
    },
    {
      label: 'เปลี่ยนสิทธิ์เข้าใช้งาน',
      key: 'status',
      icon: <SyncOutlined />,
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
    const data = await getUser({
      offset: offset,
      limit: limit,
      search: search,
      type_search: type,
    })

    if (data !== undefined) {
      setData(
        data.result.map((item) => ({
          ...item,
          full_name: item.name_eng + '  ' + item.surname_eng,
        })),
      )
      setTotalPage(data.total)
    }

    setLoadingTable(false)
  }

  const handleMenuClick = (record, key) => {
    switch (key) {
      case 'edit':
        history(`/user/edit?docno=${record.emp_id}`, { send_data: record })
        break
      case 'copy':
        history(`/user/copy?docno=${record.emp_id}`, { send_data: record })
        break
      case 'delete':
        handleDelete(record)
        break
      case 'status':
        handleChangeStatus(record)
        break
      default:
    }
  }

  const handleDelete = async (record) => {
    alertConfirm({
      alert_Title: 'คุณต้องการลบรายการ',
      alert_text: `ผู้ใช้งาน พนักงานรหัส ${record.emp_id}ใช่หรือไม่ ?`,
      onConfirm: async () => {
        const params = {
          emp_id: record.emp_id,
        }

        return await deleteUser(params).finally(() => {})
      },
      success: {
        success_text: 'ลบข้อมูลเรียบร้อยแล้ว',
        callback: async () => {
          refresh()
        },
      },
    })
  }

  const handleChangeStatus = async (record) => {
    alertConfirm({
      alert_Title: 'คุณต้องการเปลี่ยนสิทธิ์เข้าใช้งาน',
      alert_text: 'พนักงานรหัส ' + record.emp_id + ' ใช่หรือไม่ ?',
      onConfirm: async () => {
        const params = {
          emp_id: record.emp_id,
          is_active: !record.is_active,
        }

        return await changeStatusUser(params).finally(() => {})
      },
      success: {
        success_text:
          !record.is_active === true
            ? 'อนุญาติให้ใช้งานเรียบร้อยแล้ว'
            : 'ไม่อนุญาติให้ใช้งานเรียบร้อยแล้ว',
        callback: async () => {
          refresh()
        },
      },
    })
  }

  const refresh = async () => {
    tableRef.current.refresh()
  }

  return (
    <Card>
      <TableComponentForwardRef
        ref={tableRef}
        searchList={searchOption}
        rowKey={'emp_id'}
        className={'user-table'}
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
              onClick={() => history(`/user/add`)}
            />
          )
        }}
      />
    </Card>
  )
}

export default User
