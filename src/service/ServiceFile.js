import { fetch } from '../fetch'
import Cookies from 'js-cookie'
import { MASTER } from '../config'

const ServiceFile = () => {
    const getMenuPermission = async (params) => {
        const res = await fetch('POST', '/permission/menu', params)
        return res
    }

    const getAllMenu = async () => {
        const res = await fetch('GET', '/menus/')
        return res
    }

    const getMenu = async ({ offset, limit, search }) => {
        const res = await fetch('POST', '/menus/get', { offset, limit, search })
        return res
    }

    const getMenuDetail = async (menu_id) => {
        const res = await fetch('GET', `/menus/${menu_id}`)
        return res
    }

    const addMenu = async (params) => {
        const res = await fetch('POST', '/menus/add', {
            ...params,
            created_by: Cookies.get(MASTER),
        })

        return res
    }

    const updateMenu = async (params) => {
        const res = await fetch('POST', '/menus/update', {
            ...params,
            edit_by: Cookies.get(MASTER),
        })
        return res
    }

    const deleteMenu = async ({ menu_id }) => {
        const res = await fetch('POST', '/menus/delete', { menu_id })
        return res
    }

    return {
        getMenuPermission,
        getMenu,
        addMenu,
        getMenuDetail,
        updateMenu,
        deleteMenu,
        getAllMenu,
    }
}

export { ServiceFile }
