import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
    CCloseButton,
    CSidebar,
    CSidebarBrand,
    CSidebarFooter,
    CSidebarHeader,
    CSidebarToggler,
    CImage,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import logo from '../assets/images/logo-sidebar.png'
import sygnet from '../assets/images/logo-sidebar-small.png'
import navigation from '../_nav'

const AppSidebar = () => {
    const dispatch = useDispatch()
    const unfoldable = useSelector((state) => state.sidebarUnfoldable)
    const sidebarShow = useSelector((state) => state.sidebarShow)
    const [navigations, setNavigations] = useState([])

    useEffect(() => {
        loadData()
        // if (Cookies.get(MASTER)) {
        // }
    }, [])

    const loadData = async () => {
        // const nav = await fetch('post', '/menus/nav/', {
        //   user_id: Cookies.get(MASTER),
        // })
        // if (nav) {
        //   const newNav = mapNavFuntion(nav)
        //   setNavigation(newNav)
        // }
        
        // Use navigation directly since it's already in the correct CoreUI format
        setNavigations(navigation)
    }

    return (
        <CSidebar
            className="border-end"
            colorScheme="dark"
            position="fixed"
            narrow={!unfoldable ? true : false}
            visible={sidebarShow}
            onVisibleChange={(visible) => {
                dispatch({ type: 'set', sidebarShow: visible })
            }}
        >
            <CSidebarHeader className="border-bottom">
                <CSidebarBrand className="d-none d-md-flex" to="/">
                    <CImage src={logo} className="sidebar-brand-full" alt="MASTER" height={40} />
                    <CImage
                        src={sygnet}
                        className="sidebar-brand-narrow"
                        alt="MASTER"
                        height={35}
                    />
                </CSidebarBrand>
                <CCloseButton
                    className="d-lg-none"
                    dark
                    onClick={() => dispatch({ type: 'set', sidebarShow: false })}
                />
            </CSidebarHeader>
            <AppSidebarNav items={navigations} />
            <CSidebarFooter className="border-top d-none d-lg-flex">
                <CSidebarToggler
                    onClick={() =>
                        dispatch({
                            type: 'set',
                            sidebarUnfoldable: !unfoldable,
                        })
                    }
                />
            </CSidebarFooter>
        </CSidebar>
    )
}

export default React.memo(AppSidebar)
