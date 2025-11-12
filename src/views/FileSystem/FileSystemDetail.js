import React, { useEffect, useState, useRef } from 'react'
import {
  useParams,
  useLoaderData,
  useNavigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom'
import { Table, Card, Input, Row, Col, Button, Form, Checkbox } from 'antd'
import {
  ArrowRightOutlined,
  ReloadOutlined,
  SaveOutlined,
  UnlockTwoTone,
  LockTwoTone,
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

const unlock = <UnlockTwoTone twoToneColor="#52c41a" />
const lock = <LockTwoTone twoToneColor="#eb2f96" />
const FileSystemDetail = () => {
  const history = useNavigate()
  const location = useLocation()
  const type_page = location.pathname.split('/')[2]

  const [searchParams] = useSearchParams()
  const id = searchParams.get('docno')

  const { getMenu, addMenu, getMenuDetail, updateMenu } = ServiceFile()
  const { getAllUser } = ServiceUser()
  const inputFile = useRef(null)

  const [File, setFile] = useState([{ name: ['file'], value: '' }])
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
      title: () => <div className="font-weight-bold">User Login</div>,
      dataIndex: 'user_id',
      key: 'user_id',
      width: 100,
      align: 'left',
      render: (text, record, index) => text,
    },
    {
      title: () => <div className="text-center font-weight-bold">ชื่อ-นามสกุล</div>,
      dataIndex: 'full_name',
      key: 'full_name',
      width: 300,
      render: (text, record, index) => text,
    },
    // {
    //     title: () => <div className="font-weight-bold">เปิดใช้งาน</div>,
    //     dataIndex: 'open_count',
    //     key: 'open_count',
    //     width: 100,
    //     align: 'center',
    //     render: (text, record, index) => numeral(text).format('0,0'),
    // },
    // {
    //     title: () => <div className="font-weight-bold">เข้าใช้ล่าสุด</div>,
    //     dataIndex: 'last_login',
    //     key: 'last_login',
    //     width: 150,
    //     align: 'center',
    //     render: (text, record, index) =>
    //         text ? moment.utc(text).format('DD/MM/YYYY HH:mm') : null,
    // },
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
      width: 75,
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
      width: 75,
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
      width: 75,
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
      width: 75,
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
      width: 75,
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
      width: 75,
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
          setPermiss('calculate', record.action_calculate, rowIndex)()
        },
      }),
      dataIndex: 'action_calculate',
      key: 'action_calculate',
      width: 75,
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
      width: 75,
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
      width: 75,
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
        default:
          await defaultUsers()
      }
    } else {
      history('/')
    }
  }

  const defaultUsers = async () => {
    setLoadingTable(true)
    let data = await getAllUser()
    // console.log('data getAllUser', data)
    if (data !== undefined) {
      data = Array.isArray(data) ? data : [data]
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
          full_name: value.full_name,
        }
      })
      setData(result)
    }

    setLoadingTable(false)
  }

  const loadMenu = async () => {
    if (id === undefined) return

    setLoadingTable(true)
    const data = await getMenuDetail(id)
    if (data !== undefined) {
      setFile([{ name: ['file'], value: data.menu_name }])
      setData(
        data.users.map((item) => ({
          ...item,
          full_name: item.full_name,
        })),
      )
    }

    setLoadingTable(false)
  }

  const handleDelete = async (id, name) => {
    alertConfirm({
      alert_text: 'คุณต้องการลบ',
      alert_Title: 'ชื่อแฟ้ม ' + name + ' ใช่หรือไม่ ?',
      onConfirm: async () => {
        return await deleteMenu({
          menu_id: id,
        })
      },
      success: {
        callback: async () => {
          refresh()
        },
        success_text: 'ลบข้อมูลเรียบร้อยแล้ว',
      },
    })
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

  const handleReset = async () => {
    await defaultUsers()
    setFile([{ name: ['file'], value: '' }])
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
    if (inputFile.current) {
      inputFile.current.focus()
    }
  }

  const handleFinish = async () => {
    const params = {
      menu_name: inputFile.current.input.value,
      users: Data,
    }

    switch (type_page) {
      case 'edit':
        alertConfirm({
          alert_Title: 'คุณต้องการแก้ไข',
          alert_text: `รหัสเมนู ${id} ใช่ หรือไม่ ?`,
          onConfirm: async () => {
            params.menu_id = id
            setbtnLoading(true)
            return await updateMenu(params).finally(() => setbtnLoading(false))
          },
          success: {
            success_text: 'แก้ไขข้อมูลร้อยแล้ว',
            callback: async () => {
              history('/menu')
            },
          },
        })
        break
      case 'add':
        alertConfirm({
          alert_Title: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่',
          onConfirm: async () => {
            setbtnLoading(true)
            return await addMenu(params).finally(() => setbtnLoading(false))
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

  const handleFinishFailed = () => {
    if (inputFile.current) {
      inputFile.current.focus()
    }
    window.scrollTo(0, 0)
  }

  return (
    <Card style={{ paddingBottom: '10px' }}>
      <Form name="basic" fields={File} onFinish={handleFinish} onFinishFailed={handleFinishFailed}>
        <Row>
          <Col>
            <Form.Item
              className="mb-2"
              label="ชื่อแฟ้มข้อมูลระบบงาน"
              name="file"
              rules={[
                {
                  required: true,
                  message: 'โปรดระบุชื่อแฟ้มข้อมูลระบบงาน !',
                },
              ]}
            >
              <Input
                placeholder="ระบุชื่อแฟ้มข้อมูลระบบงาน"
                ref={inputFile}
                style={{ width: 400 }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              rowKey={'emp_id'}
              loading={{
                spinning: LoadingTable,
                size: 'large',
                tip: 'กำลังโหลด...',
              }}
              dataSource={Data}
              columns={columns}
              scroll={{ x: 1200, y: 500 }}
              size={'small'}
              bordered={true}
              tableLayout={'auto'}
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
                        onClick={() => history('/menu')}
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
    </Card>
  )
}

export default FileSystemDetail
