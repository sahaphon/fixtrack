import { fetch } from '../../fetch.js'
import { MASTER } from '../../config'
import Cookies from 'js-cookie'

const ServiceRole = () => {

  const getRole = async ({ limit, offset, type_search, search }) => {
    const res = await fetch('POST', '/role/', { limit, offset, type_search, search })
    return res
  }

//   const getPositionDetail = async (position_id) => {
//     const res = await fetch('POST', `/positions/get`, { position_id })
//     return res
//   }

//   const addPosition = async (params) => {
//     const res = await fetch('POST', '/positions/add', {
//       ...params,
//       created_by: Cookies.get(MASTER),
//     })

//     return res
//   }

//   const updatePosition = async (params) => {
//     const res = await fetch('POST', '/positions/update', {
//       ...params,
//       edit_by: Cookies.get(MASTER),
//     })
//     return res
//   }

//   const deletePosition = async (params) => {
//     const res = await fetch('POST', '/positions/delete', params)
//     return res
//   }

  return {
    getRole,
    // getPositionDetail,
    // addPosition,
    // updatePosition,
    // deletePosition,
  }
}

export { ServiceRole }
    