import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components-main/index'
import { Helmet } from 'react-helmet'
import { PROGRAM } from '../config'

const DefaultLayout = () => {
    return (
        <div>
            <Helmet>
                {/* <title>
                    {PROGRAM.toUpperCase()} {store.helmet && `- ${store.helmet}`}
                </title> */}
                <title>{PROGRAM.toUpperCase()}</title>
            </Helmet>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <AppContent />
                </div>
                <AppFooter />
            </div>
        </div>
    )
}

export default DefaultLayout
