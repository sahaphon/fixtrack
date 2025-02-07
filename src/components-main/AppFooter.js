import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = ({ userID, lastLogin }) => {
    return (
        <CFooter className="px-4">
            <div>
                <span style={{ fontWeight: 'bold' }}>Login : </span>
                <span>{userID}</span> &nbsp;&nbsp;
                <span className="ml-1" style={{ fontWeight: 'bold' }}>
                    เข้าสู่ระบบล่าสุด :{' '}
                </span>
                <span>{lastLogin}</span>
            </div>
            <div className="ms-auto">
                <span className="ml-1" style={{ fontWeight: 'bold' }}>
                    Ver. 0.0.0 {/* Ver. {version} */}
                </span>
                &nbsp;
                <span className="mr-1">Powered by IT ADDA &copy; 2025</span>
            </div>
        </CFooter>
    )
}

export default React.memo(AppFooter)
