import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { Form, Input, Button, Image, Avatar } from 'antd'
import {
  LoadingOutlined,
  UserOutlined,
  LockOutlined,
  CodeOutlined,
  ShopOutlined,
  DashboardOutlined,
} from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { fetchLogin } from '../../../fetch'
import Cookies from 'js-cookie'
import { MASTER, TOKEN, THEME_PROGRAM } from '../../../config'

const Login = ({ loadedRoute }) => {
  const [Loading, setLoading] = useState(false)
  const history = useNavigate()
  const dispatch = useDispatch()
  const inputRef = React.useRef(null)
  const inputRef1 = React.useRef(null)

  const onFinish = async (values) => {
    // console.log("value",values)
    const { username, password } = values
    const user = username.toUpperCase()
    setLoading(true)
    const data = await fetchLogin({ user_id: user, password: password })
    console.log('data', data)
    if (data) {
      setLoading(false)
      Cookies.set(MASTER, user)
      Cookies.set(TOKEN, data.access_token)
      dispatch({
        type: 'set',
        admin: data.user_level === 'A' ? true : false,
        department_id: data.department_id,
        user_data: {
          name_th: data.name_th,
          surname_th: data.surname_th,
          name_eng: data.name_eng,
          surname_eng: data.surname_eng,
          emp_id: data.emp_id,
          user_level: data.user_level,
          department_id: data.department_id,
          department_description: data.department_description,
        },
      })
      loadedRoute(true)
      history('/')
    }
    setLoading(false)
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="5">
            <CCard
              className="p-2 w3-animate-opacity"
              style={{
                borderRadius: '10px',
              }}
            >
              <CCardBody>
                <Form name="basic" initialValues={{ remember: true }} onFinish={onFinish}>
                  <Form.Item className={'text-center mb-1 w3-animate-right'}>
                    <Avatar
                      size={80}
                      style={{
                        backgroundColor: THEME_PROGRAM,
                      }}
                      icon={<DashboardOutlined style={{ display: 'inline-grid' }} />}
                    />
                  </Form.Item>
                  <Form.Item className={'text-center font-weight-bold w3-animate-right'}>
                    <b
                      style={{
                        fontSize: '17px',
                      }}
                    >
                      OEE
                    </b>
                  </Form.Item>
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: 'โปรดระบุผู้ใช้งาน!',
                      },
                    ]}
                    className="w3-animate-right"
                  >
                    <Input
                      autoFocus
                      prefix={
                        <div
                          style={{
                            display: 'contents',
                            color: THEME_PROGRAM,
                          }}
                        >
                          <UserOutlined />
                          {'  |'}
                        </div>
                      }
                      autoComplete={`off`}
                      placeholder="User name"
                      style={{ borderRadius: '7px' }}
                      tabIndex={1}
                      ref={inputRef}
                      onPressEnter={() => inputRef1.current.focus()}
                      id="userID"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'โปรดระบุ รหัสผ่าน!',
                      },
                    ]}
                    className="w3-animate-right"
                  >
                    <Input.Password
                      prefix={
                        <div
                          style={{
                            display: 'contents',
                            color: THEME_PROGRAM,
                          }}
                        >
                          <LockOutlined />
                          {'  |'}
                        </div>
                      }
                      placeholder="Password"
                      style={{ borderRadius: '7px' }}
                      ref={inputRef1}
                      tabIndex={2}
                      id="password"
                    />
                  </Form.Item>

                  <Form.Item className="w3-animate-right">
                    <Button
                      style={{
                        background: THEME_PROGRAM,
                        border: 'none',
                        marginTop: '10px',
                      }}
                      type="primary"
                      htmlType="submit"
                      disabled={Loading}
                      block
                    >
                      {Loading ? (
                        <div>
                          <LoadingOutlined />
                          {'  กำลังโหลด...'}
                        </div>
                      ) : (
                        <div className="font-weight-bold">{'เข้าสู่ระบบ'}</div>
                      )}
                    </Button>
                  </Form.Item>
                </Form>
              </CCardBody>
              <span
                style={{
                  marginTop: '-15px',
                  marginBottom: '10px',
                  textAlign: 'right',
                  marginRight: '20px',
                  fontSize: '12px',
                  fontWeight: '400',
                  color: '#595959',
                }}
                // >{`Ver. ${version}`}</span>
              >{`Ver. ${123}`}</span>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
