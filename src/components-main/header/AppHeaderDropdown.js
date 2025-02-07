import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CAvatar,
    CBadge,
    CDropdown,
    CDropdownDivider,
    CDropdownHeader,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
} from '@coreui/react'
import {
    cilBell,
    cilCreditCard,
    cilCommentSquare,
    cilEnvelopeOpen,
    cilFile,
    cilLockLocked,
    cilSettings,
    cilTask,
    cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = ({ userID }) => {
    const navigate = useNavigate()
    // const dispatch = useDispatch()
    // const isAdmin = useSelector((store) => store.admin)

    const logOut = () => {
        // removeCookie()
        navigate('/login')
    }

    return (
        <CDropdown variant="nav-item">
            <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
                <CAvatar src={avatar8} size="md" />
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
                <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
                    ข้อมูลระบบ
                </CDropdownHeader>
                <CDropdownItem href="#">
                    <CIcon icon={cilBell} className="me-2" />
                    ข้อมูลผู้ใช้งาน
                    <CBadge color="info" className="ms-2">
                        42
                    </CBadge>
                </CDropdownItem>
                <CDropdownItem href="#">
                    <CIcon icon={cilEnvelopeOpen} className="me-2" />
                    ข้อมูลระบบงาน
                </CDropdownItem>

                <CDropdownHeader className="bg-body-secondary fw-semibold my-2">
                    ตั้งค่า
                </CDropdownHeader>

                <CDropdownItem href="#">
                    <CIcon icon={cilSettings} className="me-2" />
                    เปลี่ยนรหัสผ่าน
                </CDropdownItem>
                <CDropdownDivider />
                <CDropdownItem onClick={logOut}>
                    <CIcon icon={cilLockLocked} className="me-2" />
                    ออกจากระบบ
                </CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    )
}

export default AppHeaderDropdown
