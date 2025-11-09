import React, { useEffect, useState, useRef } from 'react'
import {
  useParams,
  useLoaderData,
  useNavigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom'
import { Table, Card, Input, Row, Col, Button, Form, Checkbox, Radio, Space } from 'antd'
import {
  ArrowRightOutlined,
  ReloadOutlined,
  SaveOutlined,
  UnlockTwoTone,
  LockTwoTone,
  MoreOutlined,
  SmallDashOutlined,
  PlusOutlined,
} from '@ant-design/icons'

import { alertConfirm } from '../../components/Alert/Alert'
import Btn from '../../components/Button/BtnComponent'
import { getUserProfile } from '../../service/ServiceLogin'
import TableComponentForwardRef from '../../components/Table/TableComponentForwardRef'
import Cookies from 'js-cookie'
import numeral from 'numeral'
import moment from 'moment'
import { ServiceFile } from '../../service/ServiceFile'
import { ServiceUser } from '../../service/ServiceUser'
import { MASTER } from '../../config'
import { useTableHeight } from '../../utilities/useTableHeight'

import AddDepartmentModal from './AddDepartmentModal'
import AddDivisionModal from './AddDivisionModal'
import AddRoleModal from './AddRoleModal'

const tailLayout = {
  wrapperCol: { offset: 1, span: 24 },
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

const unlock = <UnlockTwoTone twoToneColor="#52c41a" />
const lock = <LockTwoTone twoToneColor="#eb2f96" />

const UserDetail = () => {

  const formRef = useRef()
  const history = useNavigate()
  const location = useLocation()
  const type_page = location.pathname.split('/')[2]
  const { HeightForm } = useTableHeight()

  const [searchParams] = useSearchParams()
  const id = searchParams.get('docno')

  const { getMenu, addMenu, getMenuDetail, updateMenu, getAllMenu } = ServiceFile()
  const { getAllUser, getUserDetail, getSearchEmpId, addUser, updateUser } = ServiceUser()
  const inputFile = useRef(null)


  const resetTexbox = [
    { name: ['level'], value: 1 },
    { name: ['name'], value: '' },
    { name: ['emp_id'], value: '' },
    { name: ['dept', 'code'], value: '' },
    { name: ['dept', 'name'], value: '' },
    { name: ['role', 'code'], value: '' },
    { name: ['role', 'name'], value: '' },
  ]

  const [Valid, setValid] = useState('')
  const [Fields, setFields] = useState(resetTexbox)
  const [empIDValid, setEmpIDValid] = useState(false)
  const [LoadingTable, setLoadingTable] = useState(false)
  const [btnLoading, setbtnLoading] = useState(false)
  const [Data, setData] = useState([])

  const [ActionOpen, setActionOpen] = useState(false)
  const [ActionView, setActionView] = useState(false)
  const [ActionAdd, setActionAdd] = useState(false)
  const [ActionEdit, setActionEdit] = useState(false)
  const [ActionDelete, setActionDelete] = useState(false)
  const [ActionPrint, setActionPrint] = useState(false)
  const [ActionCalculate, setCalculate] = useState(false)
  const [ActionConfirm, setConfirm] = useState(false)
  const [ActionCancel, setCancel] = useState(false)

  const [openModal, setOpenModal] = useState(false)
  const [openDivisionModal, setOpenDivisionModal] = useState(false)
  const [openRoleModal, setOpenRoleModal] = useState(false)
  const [typeService, setTypeService] = useState('Department')

  const [bgColor, setBgColor] = useState('#7094db');

  const columns = [
    {
      title: () => <div className="font-weight-bold">#</div>,
      dataIndex: 'docDate',
      key: 'docDate',
      width: 50,
      align: 'center',
      render: (text, record, index) => <b>{numeral(index + 1).format('0,0')}</b>,
    },
    {
      title: () => <div className="font-weight-bold">รหัสแฟ้ม</div>,
      dataIndex: 'menu_id',
      key: 'menu_id',
      width: 80,
      align: 'center',
      render: (text, record, index) => text,
    },
    {
      title: () => <div className="text-center font-weight-bold">ชื่อแฟ้ม</div>,
      dataIndex: 'menu_name',
      key: 'menu_name',
      width: 350,
      render: (text, record, index) => text,
    },
    {
      title: () => <div className="font-weight-bold">เปิดใช้งาน</div>,
      dataIndex: 'open_count',
      key: 'open_count',
      width: 80,
      align: 'center',
      render: (text, record, index) => numeral(text).format('0,0'),
    },
    {
      title: () => <div className="font-weight-bold">เข้าใช้ล่าสุด</div>,
      dataIndex: 'last_login',
      key: 'last_login',
      width: 100,
      align: 'center',
      render: (text, record, index) => (text ? moment.utc(text).format('DD/MM/YYYY HH:mm') : null),
    },
    {
      title: () => {
        return (
          <div className="text-center font-weight-bold">
            เปิด <br />
            <Checkbox
              disabled={Data.length === 0 ? true : false}
              name="action_open"
              checked={ActionOpen}
              onChange={(e) => {
                setActionOpen(e.target.checked)
                setPermissAll(e.target.name, e.target.checked)
              }}
            />
          </div>
        )
      },
      onCell: (record, rowIndex) => ({
        onClick: () => {
          setPermiss('open', record.action_open, rowIndex)()
        },
      }),
      dataIndex: 'action_open',
      key: 'action_open',
      width: 80,
      align: 'center',
      render: (text, record, index) => (text ? unlock : lock),
    },
    {
      title: () => {
        return (
          <div className="text-center font-weight-bold">
            มุมมอง <br />
            <Checkbox
              disabled={Data.length === 0 ? true : false}
              name="action_view"
              checked={ActionView}
              onChange={(e) => {
                setActionView(e.target.checked)
                setPermissAll(e.target.name, e.target.checked)
              }}
            />
          </div>
        )
      },
      onCell: (record, rowIndex) => ({
        onClick: () => {
          setPermiss('view', record.action_view, rowIndex)()
        },
      }),
      dataIndex: 'action_view',
      key: 'action_view',
      width: 80,
      align: 'center',
      render: (text, record, index) => (text ? unlock : lock),
    },
    {
      title: () => {
        return (
          <div className="text-center font-weight-bold">
            เพิ่ม <br />
            <Checkbox
              disabled={Data.length === 0 ? true : false}
              name="action_add"
              checked={ActionAdd}
              onChange={(e) => {
                setActionAdd(e.target.checked)
                setPermissAll(e.target.name, e.target.checked)
              }}
            />
          </div>
        )
      },
      onCell: (record, rowIndex) => ({
        onClick: () => {
          setPermiss('add', record.action_add, rowIndex)()
        },
      }),
      dataIndex: 'action_add',
      key: 'action_add',
      width: 80,
      align: 'center',
      render: (text, record, index) => (text ? unlock : lock),
    },
    {
      title: () => {
        return (
          <div className="text-center font-weight-bold">
            แก้ไข <br />
            <Checkbox
              disabled={Data.length === 0 ? true : false}
              name="action_edit"
              checked={ActionEdit}
              onChange={(e) => {
                setActionEdit(e.target.checked)
                setPermissAll(e.target.name, e.target.checked)
              }}
            />
          </div>
        )
      },
      onCell: (record, rowIndex) => ({
        onClick: () => {
          setPermiss('edit', record.action_edit, rowIndex)()
        },
      }),
      dataIndex: 'action_edit',
      key: 'action_edit',
      width: 80,
      align: 'center',
      render: (text, record, index) => (text ? unlock : lock),
    },
    {
      title: () => {
        return (
          <div className="text-center font-weight-bold">
            ลบ <br />
            <Checkbox
              disabled={Data.length === 0 ? true : false}
              name="action_delete"
              checked={ActionDelete}
              onChange={(e) => {
                setActionDelete(e.target.checked)
                setPermissAll(e.target.name, e.target.checked)
              }}
            />
          </div>
        )
      },
      onCell: (record, rowIndex) => ({
        onClick: () => {
          setPermiss('delete', record.action_delete, rowIndex)()
        },
      }),
      dataIndex: 'action_delete',
      key: 'action_delete',
      width: 80,
      align: 'center',
      render: (text, record, index) => (text ? unlock : lock),
    },

    {
      title: () => {
        return (
          <div className="text-center font-weight-bold">
            พิมพ์ <br />
            <Checkbox
              disabled={Data.length === 0 ? true : false}
              name="action_print"
              checked={ActionPrint}
              onChange={(e) => {
                setActionPrint(e.target.checked)
                setPermissAll(e.target.name, e.target.checked)
              }}
            />
          </div>
        )
      },
      onCell: (record, rowIndex) => ({
        onClick: () => {
          setPermiss('print', record.action_print, rowIndex)()
        },
      }),
      dataIndex: 'action_print',
      key: 'action_print',
      width: 80,
      align: 'center',
      render: (text, record, index) => (text ? unlock : lock),
    },
     {
      title: () => {
        return (
          <div className="text-center font-weight-bold">
            คำนวณ <br />
            <Checkbox
              disabled={Data.length === 0 ? true : false}
              name="action_calculate"
              checked={ActionCalculate}
              onChange={(e) => {
                setCalculate(e.target.checked)
                setPermissAll(e.target.name, e.target.checked)
              }}
            />
          </div>
        )
      },
      onCell: (record, rowIndex) => ({
        onClick: () => {
          setPermiss('confirm', record.action_confirm, rowIndex)()
        },
      }),
      dataIndex: 'action_calculate',
      key: 'action_calculate',
      width: 80,
      align: 'center',
      render: (text, record, index) => (text ? unlock : lock),
    },
    {
      title: () => {
        return (
          <div className="text-center font-weight-bold">
            ยืนยัน <br />
            <Checkbox
              disabled={Data.length === 0 ? true : false}
              name="action_confirm"
              checked={ActionConfirm}
              onChange={(e) => {
                setConfirm(e.target.checked)
                setPermissAll(e.target.name, e.target.checked)
              }}
            />
          </div>
        )
      },
      onCell: (record, rowIndex) => ({
        onClick: () => {
          setPermiss('confirm', record.action_confirm, rowIndex)()
        },
      }),
      dataIndex: 'action_confirm',
      key: 'action_confirm',
      width: 80,
      align: 'center',
      render: (text, record, index) => (text ? unlock : lock),
    },
    {
      title: () => {
        return (
          <div className="text-center font-weight-bold">
            ยกเลิก <br />
            <Checkbox
              disabled={Data.length === 0 ? true : false}
              name="action_cancel"
              checked={ActionCancel}
              onChange={(e) => {
                setCancel(e.target.checked)
                setPermissAll(e.target.name, e.target.checked)
              }}
            />
          </div>
        )
      },
      onCell: (record, rowIndex) => ({
        onClick: () => {
          setPermiss('cancel', record.action_cancel, rowIndex)()
        },
      }),
      dataIndex: 'action_cancel',
      key: 'action_cancel',
      width: 80,
      align: 'center',
      render: (text, record, index) => (text ? unlock : lock),
    },
  ]

  useEffect(() => {
    admin()
  }, [])

  const admin = async () => {
    const data = await getUserProfile()
    if (data === undefined) history('/')
    if (data.user_level === 'A') {
      switch (type_page) {
        case 'edit':
          loadMenu()
          break
        case 'copy':
          copyUserMenu()
          break
        default:
          await defaultMenu()
      }
    } else {
      history('/')
    }
  }

  const defaultMenu = async () => {
    setLoadingTable(true)
    const data = await getAllMenu()
    if (data !== undefined) {
      const result = data.map((value) => {
        return {
          ...value,
          open_count: 0,
          last_used_date: null,
          action_open: false,
          action_view: false,
          action_add: false,
          action_edit: false,
          action_delete: false,
          action_print: false,
          action_calculate: false,
          action_confirm: false,
          action_cancel: false,
        }
      })
      setData(result)
    }

    setLoadingTable(false)
  }

  const loadMenu = async () => {
    if (id === undefined) return

    setLoadingTable(true)
    const data = await getUserDetail(id)

    if (data !== undefined) {
      setFields([
        { name: ['level'], value: data.user_level === 'A' ? 2 : 1 },
        { name: ['name'], value: data.name },
        { name: ['emp_id'], value: data.emp_id },
        { name: ['dept', 'code'], value: data.department_id },
        { name: ['dept', 'name'], value: data.department_name },
        { name: ['division', 'code'], value: data.division_id },
        { name: ['division', 'name'], value: data.division_name },
        { name: ['role', 'code'], value: data.role_id },
        { name: ['role', 'name'], value: data.role_name },
      ])

      setData(data.menu)
    }

    setLoadingTable(false)
  }

  const copyUserMenu = async () => {
    if (id === undefined) return

    setLoadingTable(true)
    const data = await getUserDetail(id)
    // console.log('copy', data)
    if (data !== undefined) {
      setFields([
        { name: ['level'], value: data.user_level === 'A' ? 2 : 1 },
        { name: ['name'], value: '' },
        { name: ['emp_id'], value: '' },
        { name: ['dept', 'code'], value: '' },
        { name: ['dept', 'name'], value: '' },
        { name: ['role', 'code'], value: '' },
        { name: ['role', 'name'], value: '' },
      ])

      setData(data.menu)
    }

    setLoadingTable(false)
  }

  const refresh = async () => {
    tableRef.current.refresh()
  }

  const setPermiss = (field, bln, index) => (e) => {
    const newArray = Data[index]

    switch (field) {
      case 'open':
        newArray.action_open = !bln
        break

      case 'view':
        newArray.action_view = !bln
        break

      case 'add':
        newArray.action_add = !bln
        break

      case 'edit':
        newArray.action_edit = !bln
        break

      case 'delete':
        newArray.action_delete = !bln
        break

      case 'print':
        newArray.action_print = !bln
        break

      case 'calculate':
        newArray.action_calculate = !bln
        break

      case 'confirm':
        newArray.action_confirm = !bln
        break

      case 'cancel':
        newArray.action_cancel = !bln
        break

      default:
    }

    const arr = [...Data]
    arr.splice(index, 1, newArray)
    setData(arr)
  }

  const setPermissAll = (field, bln) => {
    const newArray = [...Data]
    newArray.forEach((r, i) => {
      switch (field) {
        case 'action_open':
          r.action_open = bln
          break

        case 'action_view':
          r.action_view = bln
          break

        case 'action_add':
          r.action_add = bln
          break

        case 'action_edit':
          r.action_edit = bln
          break

        case 'action_delete':
          r.action_delete = bln
          break

        case 'action_print':
          r.action_print = bln
          break

        case 'action_calculate':
          r.action_calculate = bln
          break

        case 'action_confirm':
          r.action_confirm = bln
          break

        case 'action_cancel':
          r.action_cancel = bln
          break

        case 'all':
          r.action_open = bln
          r.action_view = bln
          r.action_add = bln
          r.action_edit = bln
          r.action_delete = bln
          r.action_print = bln
          r.action_calculate = bln
          r.action_confirm = bln
          r.action_cancel = bln
          break

        default:
      }
    })
    setData(newArray)
  }

  const search_user = async (event) => {
    const param = { emp_id: formRef.current?.getFieldValue('emp_id') }
    const data = await getSearchEmpId(param)
    if (data !== undefined) {
      setEmpIDValid(true)
      setFields([
        { name: ['name'], value: data.name_th + ' ' + data.surname_th },
        { name: ['position'], value: data.position },
        { name: ['dept', 'code'], value: data.department_id },
        { name: ['dept', 'name'], value: data.department_description },
      ])
    } else {
      setEmpIDValid(false)
    }
  }

  const handleReset = async () => {
    setFields(resetTexbox)
    setValid(Valid === 'error' ? Valid : '')
    setActionOpen(false)
    setActionView(false)
    setActionAdd(false)
    setActionEdit(false)
    setActionDelete(false)
    setActionPrint(false)
    setCalculate(false)
    setConfirm(false)
    setCancel(false)
    setPermissAll('all', false)
    if (id === null) {
      defaultMenu()
    } else {
      copyUserMenu()
    }
  }

  const handleFinish = async (values) => {
    console.log('handleFinish', values)

    const params = {
      user_level: values.level === 1 ? 'U' : 'A',
      menu: Data,
    }

    switch (type_page) {
      case 'edit':
        alertConfirm({
          alert_Title: 'คุณต้องการแก้ไข',
          alert_text: `ข้อมูลผู้ใช้งาน ${id} ใช่ หรือไม่ ?`,
          onConfirm: async () => {
            params.emp_id = id
            setbtnLoading(true)
            return await updateUser(params).finally(() => setbtnLoading(false))
          },
          success: {
            success_text: 'แก้ไขข้อมูลร้อยแล้ว',
            callback: async () => {
              history('/user')
              await handleReset()
            },
          },
        })
        break
      case 'add':
      case 'copy':
        alertConfirm({
          alert_Title: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่',
          onConfirm: async () => {
            params.emp_id = values.emp_id.toUpperCase()
            setbtnLoading(true)
            return await addUser(params).finally(() => setbtnLoading(false))
          },
          success: {
            success_text: 'บันทึกเรียบร้อยแล้ว',
            callback: async () => await handleReset(),
          },
        })
        break
      default:
    }
  }

  const handleFinishFailed = (errorInfo) => {
    const user = errorInfo.values.emp_id
    setValid(user === '' ? 'error' : Valid)
    window.scrollTo(0, 0)
  }

  const handleSelectDataModal = (record) => {
      console.log('Selected record:', record);

      switch (record.type) {
        case 'Department':
          setFields([
            { name: ['dept', 'code'], value: record.dep_code },
            { name: ['dept', 'name'], value: record.dep_name },
          ])
          // setOpenModal(false)
          break;
        case 'Division':
          setFields([
            { name: ['division', 'code'], value: record.division_id },
            { name: ['division', 'name'], value: record.division_name },
          ])
          // setOpenDivisionModal(false)
          break;
        case 'Role':
          console.log('Selecting Role:');
          setFields([
            { name: ['role', 'code'], value: record.role_id },
            { name: ['role', 'name'], value: record.role_name_th },
          ])
          // setOpenRoleModal(false)
          break;
      }
  }

  return (
    <Card style={{ paddingBottom: '10px' }}>
      <Form
        name="basic"
        ref={formRef}
        fields={Fields}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        {...layout}
      >
        <Row>
          <Col md={12}>
            <Form.Item
              name="level"
              label="Level"
              className="mb-1"
              rules={[
                {
                  required: true,
                  message: 'Please pick an item!',
                },
              ]}
              {...tailLayout}
            >
              <Radio.Group>
                <Radio value={1}>User</Radio>
                <Radio value={2}>Administrator</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item 
                name="name" 
                label="ชื่อ-สกุล" 
                className="mb-0" {...tailLayout}
                rules={[
                  {
                    required: true,
                    message: 'โปรดระบุชื่อ-สกุล !',
                  },
                ]} 
            >
              <Input
                disabled={type_page === 'view' ? true : false}
                placeholder="ชื่อ-สกุล"
                style={{ color: 'black' }}
                autoComplete={`off`}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Item
              name="emp_id"
              label="เลขประจำตัว"
              className="mb-0"
              validateStatus={Valid}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'โปรดระบุรหัสพนักงาน !',
                },
              ]}
              {...tailLayout}
            >
              <Input
                placeholder="เลขประจำตัวข้าราชการ / พนักงาน"
                maxLength={5}
                autoComplete={`off`}
                disabled={type_page === 'edit' ? true : false}
                onChange={(e) => {
                  setFields([
                    { name: ['name'], value: '' },
                    { name: ['position'], value: '' },
                    { name: ['dept', 'code'], value: '' },
                    { name: ['dept', 'name'], value: '' },
                  ])
                }}
                onPressEnter={(e) => {
                  search_user(e)
                  e.preventDefault()
                }}
              />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item label="ฝ่าย/แผนก" className="mb-1" {...tailLayout}>
              <Space.Compact style={{ width: '100%' }}>
                 <Button
                    style={{ 
                      width: '15%', 
                      marginRight: '3px', 
                      color:'white',
                      backgroundColor:'green', 
                      borderRadius: '6px',
                    }}
                    onClick={() => 
                       setOpenModal(true)
                    }
                  >
                    <PlusOutlined />
                    เลือก
                  </Button>
                <Form.Item 
                    name={['dept', 'code']} 
                     rules={[
                        {
                          required: true,
                          message: 'โปรดระบุรหัสฝ่าย/แผนก !',
                        },
                      ]}
                    noStyle
                >
                  <Input
                    style={{
                      width: '15%',
                      color: 'black',
                    }}
                    disabled={type_page === 'view' ? true : false}
                    placeholder="รหัส"
                    autoComplete={`off`}
                    // suffix={<MoreOutlined />}
                  />
                </Form.Item>
                <Form.Item name={['dept', 'name']} noStyle>
                  <Input
                    style={{
                      width: '70%',
                      color: 'black',
                    }}
                    disabled
                    placeholder="ชื่อแผนก"
                    autoComplete={`off`}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={12}></Col>
          <Col md={12}>
           <Form.Item label="สังกัด/กอง" className="mb-1" {...tailLayout}>
              <Space.Compact style={{ width: '100%' }}>
                <Button
                    style={{ 
                      width: '15%', 
                      marginRight: '3px', 
                      color:'white',
                      backgroundColor:'green', 
                      borderRadius: '6px' }}
                    onClick={() => 
                       setOpenDivisionModal(true)
                    }
                  >
                    <PlusOutlined />
                    เลือก
                  </Button>
                <Form.Item
                  name={['division', 'code']} noStyle
                  rules={[
                    {
                      required: true,
                      message: 'โปรดระบุรหัสสังกัด/กอง !',
                    },
                  ]}
                >
                  <Input
                    style={{
                      width: '15%',
                      color: 'black',
                    }}
                    disabled={type_page === 'view' ? true : false}
                    placeholder="รหัส"
                    autoComplete={`off`}
                  />
                </Form.Item>
                <Form.Item name={['division', 'name']} noStyle>
                  <Input
                    style={{
                      width: '70%',
                      color: 'black',
                    }}
                    disabled
                    placeholder="ชื่อสังกัด/กอง"
                    autoComplete={`off`}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col md={12}></Col>
          <Col md={12}>
            <Form.Item name="role" label="ระดับ/ตำแหน่ง" className="mb-0" {...tailLayout}>
              <Space.Compact style={{ width: '100%' }}>
                  <Button
                    style={{ 
                      width: '15%', 
                      marginRight: '3px', 
                      color:'white',
                      backgroundColor:'green', 
                      borderRadius: '6px',
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#228b22'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'green'}
                    onClick={() => 
                      setOpenRoleModal(true)
                    }
                  >
                    <PlusOutlined />
                    เลือก
                  </Button>
                  <Form.Item 
                    name={['role', 'code']} 
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: 'โปรดระบุรหัสตำแหน่ง !',
                      },
                    ]}
                  >
                    <Input
                      disabled={type_page === 'view' ? true : false}
                      style={{ 
                        width: '15%',
                        color: 'black'
                       }}
                      placeholder="รหัส"
                      autoComplete={`off`}
                    />
                  </Form.Item>
                  <Form.Item name={['role', 'name']} noStyle>
                    <Input
                      disabled
                      style={{ 
                        width: '70%',
                        color: 'black',
                        backgroundColor: '#f5f5f5'
                       }}
                      placeholder="ตำแหน่ง"
                      autoComplete={`off`}
                    />
                  </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              rowKey={'menu_id'}
              loading={{
                spinning: LoadingTable,
                size: 'large',
                tip: 'กำลังโหลด...',
              }}
              dataSource={Data}
              columns={columns}
              scroll={{ x: 1200, y: HeightForm() }}
              size={'small'}
              bordered={true}
              tableLayout={'fixed'}
              pagination={false}
              locale={{ emptyText: 'ไม่มีข้อมูล' }}
              footer={() => {
                return (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      padding: '5px',
                    }}
                  >
                    <Form.Item className="mb-0">
                      <Button
                        type={'primary'}
                        htmlType="submit"
                        loading={btnLoading}
                        icon={
                          <SaveOutlined
                            style={{
                              display: 'inline-grid',
                            }}
                          />
                        }
                      >
                        บันทึก
                      </Button>
                    </Form.Item>
                    <Form.Item className="mb-0">
                      <Button
                        type={'danger'}
                        className="ml-2"
                        onClick={handleReset}
                        disabled={btnLoading}
                        icon={
                          <ReloadOutlined
                            style={{
                              display: 'inline-grid',
                            }}
                          />
                        }
                      >
                        Reset
                      </Button>
                    </Form.Item>
                    <Form.Item className="mb-0">
                      <Button
                        className="ml-2"
                        disabled={btnLoading}
                        onClick={() => history('/user')}
                        icon={
                          <ArrowRightOutlined
                            style={{
                              display: 'inline-grid',
                            }}
                          />
                        }
                      >
                        กลับ
                      </Button>
                    </Form.Item>
                  </div>
                )
              }}
            />
          </Col>
        </Row>
      </Form>
      {openModal && (
          <AddDepartmentModal
            typeService={typeService}
            visible={openModal}
            setOpenModal={setOpenModal}
            onSelectData={handleSelectDataModal}
          />
      )}
      {openDivisionModal && (
          <AddDivisionModal
            visible={openDivisionModal}
            setOpenDivisionModal={setOpenDivisionModal}
            onSelectData={handleSelectDataModal}
          />
      )
      }
      { openRoleModal && (
          <AddRoleModal
            visible={openRoleModal}
            setOpenRoleModal={setOpenRoleModal}
            onSelectData={handleSelectDataModal}
          />
       )
      }
    </Card>
  )
}

export default UserDetail
