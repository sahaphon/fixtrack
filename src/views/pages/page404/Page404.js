import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CButton,
    CCol,
    CContainer,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMagnifyingGlass, cilArrowCircleLeft } from '@coreui/icons'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { THEME_PROGRAM } from '../../../config'
import './Page404.css'

const Page404 = () => {
    const Navigate = useNavigate()
    return (
        <div className="overlay-page">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={6}>
                        <div className="clearfix">
                            <h1 className="float-start display-3 me-4">404</h1>
                            <h4 className="pt-3">Oops! You{"'"}re lost.</h4>
                            <p className="text-body-secondary float-start">
                                The page you are looking for was not found.
                            </p>
                        </div>
                        <CInputGroup className="input-prepend">
                            <CInputGroupText>
                                <CIcon icon={cilMagnifyingGlass} />
                            </CInputGroupText>
                            <CFormInput type="text" placeholder="What are you looking for?" />
                            <CButton color="info">Search</CButton>
                        </CInputGroup>

                        <br />
                        <div style={{ textAlign: 'center' }}>
                            <u
                                style={{
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    color: THEME_PROGRAM,
                                    fontSize: '16px',
                                    marginLeft: '-10px',
                                }}
                                onClick={() => Navigate(`/`)}
                            >
                                <ArrowLeftOutlined
                                    style={{
                                        display: 'inline-grid',
                                        marginRight: '8px',
                                        fontSize: '16px',
                                    }}
                                />
                                <span>{`กลับหน้าหลัก`}</span>
                            </u>
                        </div>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default Page404
