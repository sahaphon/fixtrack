import { fetch } from '../../fetch'
import { MASTER } from '../../config'
import Cookies from 'js-cookie'

const ServiceDivision = () => {

  const getAllDivision = async () => {
    const res = await fetch('POST', '/divisions/', {})
    return res
  } 

  const getDivision = async ({ type_search, offset, limit, search }) => {
    const res = await fetch('POST', '/divisions/get', { type_search, offset, limit, search })
    return res
  }

  // const getDivisionDetail = async (division_id) => {
  //   const res = await fetch('POST', `/divisions/get`, { division_id })
  //   return res
  // }

  // const addDivision = async (params) => {
  //   const res = await fetch('POST', '/divisions/add', {
  //     ...params,
  //     created_by: Cookies.get(MASTER),
  //   })

  //   return res
  // }

  // const updateDivision = async (params) => {
  //   const res = await fetch('POST', '/divisions/update', {
  //     ...params,
  //     edit_by: Cookies.get(MASTER),
  //   })
  //   return res
  // }

  // const deleteDivision = async (params) => {
  //   const res = await fetch('POST', '/divisions/delete', params)
  //   return res
  // }

  return {  
    getAllDivision,
    getDivision,
    // getDivisionDetail,
    // addDivision,
    // updateDivision,
    // deleteDivision,
  }
}

export { ServiceDivision }