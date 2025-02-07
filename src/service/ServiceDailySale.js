import { fetch } from '../fetch'
import { MASTER } from '../config'
import Cookies from 'js-cookie'

const ServiceDailySale = () => {
    const getDailySale = async ({ type_search, offset, limit, search }) => {
        const res = await fetch('POST', '/shopee/get_daily_sales', {
            type_search,
            offset,
            limit,
            search,
            platform: 'shopee',
        })
        return res
    }

    const getDailySaleDetail = async (params) => {
        const res = await fetch('POST', `/shopee/get_daily_sales_detail`, params)
        return res
    }

    // const getSearchEmpId = async (params) => {
    //     const res = await fetch('POST', '/users/get_emp', params)
    //     return res
    // }

    // const addUser = async (params) => {
    //     const res = await fetch('POST', '/users/add', params)

    //     return res
    // }

    // const updateUser = async (params) => {
    //     const res = await fetch('POST', '/users/update', params)
    //     return res
    // }

    // const deleteUser = async (params) => {
    //     const res = await fetch('POST', '/users/delete', params)
    //     return res
    // }

    // const changeStatusUser = async (params) => {
    //     const res = await fetch('POST', '/users/change/status', params)
    //     return res
    // }

    return {
        getDailySale,
        getDailySaleDetail,
        // getUserDetail,
        // getSearchEmpId,
        // addUser,
        // updateUser,
        // deleteUser,
        // changeStatusUser,
    }
}

export { ServiceDailySale }
