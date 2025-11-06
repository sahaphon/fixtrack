import React from 'react'
import CIcon from '@coreui/icons-react'
import * as iconsTest from '@coreui/icons'
import _ from 'lodash'
import { CNavGroup, CNavItem } from '@coreui/react'

const mapNavFuntion = (nav) => {
    if (!Array.isArray(nav)) {
        console.error('mapNavFuntion: nav is not an array!', nav)
        return []
    }
    
    let _nav = nav
        // Show only have to and have children have to
        .filter(function f(e) {
            return e.to || (e._children && (e._children = e._children.filter(f)).length)
        })
        .map((v) => {
            let temp = {
                component: v._children ? CNavGroup : CNavItem,
                name: v.name,
                to: v.to,
                icon: <CIcon icon={iconsTest[v.icon]} customClassName="nav-icon" />,
                items:
                    v._children &&
                    v._children.map((m) => ({
                        component: CNavItem,
                        name: m.name,
                        to: m.to,
                        icon: <CIcon icon={iconsTest[m.icon]} customClassName={'nav-icon'} />,
                    })),
            }
            if (!temp.items) {
                temp = _.omit(temp, ['items'])
            }
            return temp
        })

    return _nav
}

export default mapNavFuntion
