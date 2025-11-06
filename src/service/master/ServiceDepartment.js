import { fetch } from '../../fetch'
import { MASTER } from '../../config'
import Cookies from 'js-cookie'

const ServiceDepartment = () => {

  const getDepartment = async ({ limit, offset, type_search, search }) => {
    const res = await fetch('POST', '/departments/', { limit, offset, type_search, search })
    return res
  }

  const getDepartmentDetail = async (department_id) => {
    const res = await fetch('POST', `/departments/get`, { department_id })
    return res
  }

  const addDepartment = async (params) => {
    const res = await fetch('POST', '/departments/add', {
      ...params,
      created_by: Cookies.get(MASTER),
    })

    return res
  }

  const updateDepartment = async (params) => {
    const res = await fetch('POST', '/departments/update', {
      ...params,
      edit_by: Cookies.get(MASTER),
    })
    return res
  }

  const deleteDepartment = async (params) => {
    const res = await fetch('POST', '/departments/delete', params)
    return res
  }

  return {
    getDepartment,
    getDepartmentDetail,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  }
}   

export { ServiceDepartment }