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
          align: 'center',
          render: (text, record) => (text === 'A' ? 'Admin' : 'User'),
        },
      ],
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'User ID'}</label>,
      dataIndex: 'user_id',
      key: 'user_id',
      sorter: (a, b) => a.user_id.localeCompare(b.user_id),
      width: 100,
      align: 'center',
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'ชื่อ-นามสกุล'}</label>,
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
      width: 260,
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'Level'}</label>,
      dataIndex: 'level_name',
      key: 'level_name',
      sorter: (a, b) => a.level_name.localeCompare(b.level_name),
      width: 200,
      align: 'center',
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'ตำแหน่ง'}</label>,
      dataIndex: 'position_name',
      key: 'position_name',
      sorter: (a, b) => {
        if (a.position_name !== null && b.position_name !== null) {
          a.position_name.localeCompare(b.position_name)
        }
      },
      width: 400,
      render: (text, record) => (text ? (text === 'null' ? '' : text) : ''),
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'ฝ่าย'}</label>,
      dataIndex: 'dep_name',
      key: 'dep_name',
      sorter: (a, b) => {
        if (a.dep_name !== null && b.dep_name !== null) {
          a.dep_name.localeCompare(b.dep_name)
        }
      },
      width: 200,
      render: (text, record) => (text ? (text === 'null' ? '' : text) : ''),
    },
    {
      title: () => <label style={{ fontWeight: 'bold' }}>{'สังกัด/กอง'}</label>,
      dataIndex: 'division_name',
      key: 'division_name',
      sorter: (a, b) => {
        if (a.division_name !== null && b.division_name !== null) {
          a.division_name.localeCompare(b.division_name)
        }
      },
      width: 180,
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
      render: (text, record) => (text ? moment(text).format('DD/MM/YYYY HH:mm') : ''),
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

    console.log('data user: ', data) 
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
        history(`/user/edit?docno=${record.user_id}`, { send_data: record })
        break
      case 'copy':
        history(`/user/copy?docno=${record.user_id}`, { send_data: record })
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
      alert_text: `ผู้ใช้งานรหัส ${record.user_id} ใช่หรือไม่ ?`,
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
      alert_text: 'ผู้ใช้รหัส ' + record.user_id + ' ใช่หรือไม่ ?',
      onConfirm: async () => {
        const params = {
          emp_id: record.user_id,
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
        rowKey={'user_id'}
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
