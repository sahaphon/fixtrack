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

const Page404 = () => {
    const Navigate = useNavigate()
    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
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
                                    color: '#1d39c4',
                                    fontSize: '16px',
                                    marginLeft: '-10px',
                                }}
                                onClick={() => Navigate(`/`)}
                            >
                                <CIcon
                                    icon={cilArrowCircleLeft}
                                    style={{ display: 'inline-grid', marginRight: '10px' }}
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
