import { fetch } from '../fetch'
import { MASTER } from '../config'
import Cookies from 'js-cookie'

const ServiceUser = () => {
  const getAllUser = async () => {
    const res = await fetch('POST', '/users/get_all')
    return res
  }

  const getUser = async ({ type_search, offset, limit, search }) => {
    const res = await fetch('POST', '/users/', { type_search, offset, limit, search })
    return res
  }

  const getUserDetail = async (user_id) => {
    const res = await fetch('POST', `/users/get`, { user_id })
    return res
  }

  const getSearchEmpId = async (params) => {
    const res = await fetch('POST', '/users/get_emp', params)
    return res
  }

  const addUser = async (params) => {
    const res = await fetch('POST', '/users/add', {
      ...params,
      created_by: Cookies.get(MASTER),
    })

    return res
  }

  const updateUser = async (params) => {
    const res = await fetch('POST', '/users/update', {
      ...params,
      edit_by: Cookies.get(MASTER),
    })
    return res
  }

  const deleteUser = async (params) => {
    const res = await fetch('POST', '/users/delete', params)
    return res
  }

  const changeStatusUser = async (params) => {
    const res = await fetch('POST', '/users/change/status', {
      ...params,
      edit_by: Cookies.get(MASTER),
    })
    return res
  }

  return {
    getAllUser,
    getUser,
    getUserDetail,
    getSearchEmpId,
    addUser,
    updateUser,
    deleteUser,
    changeStatusUser,
  }
}

export { ServiceUser }
