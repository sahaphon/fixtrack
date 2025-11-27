import { fetch } from '../../fetch'
import { MASTER } from '../../config'
import Cookies from 'js-cookie'

const ServiceFireStation = () => {

  const getAllFireStation = async () => {
    try {
      const res = await fetch('POST', '/firestation/')
      return res
    } catch (e) {
      return false
    }
  } 

  const getFireStation = async ({ limit, offset, type_search, search }) => {
    const res = await fetch('POST', '/firestation/get', { limit, offset, type_search, search })
    return res
  }

//   const getFireStationDetail = async (fire_station_id) => {
//     const res = await fetch('POST', `/fire_stations/get`, { fire_station_id })
//     return res
//  }

//   const addFireStation = async (params) => {
//     const res = await fetch('POST', '/fire_stations/add', {
//       ...params,
//       created_by: Cookies.get(MASTER),
//     })

//     return res
//   }

//   const updateFireStation = async (params) => {
//     const res = await fetch('POST', '/fire_stations/update', {
//       ...params,
//       edit_by: Cookies.get(MASTER),
//     })
//     return res
//   }

//   const deleteFireStation = async (params) => {
//     const res = await fetch('POST', '/fire_stations/delete', params)
//     return res
//   }

  return {
    getAllFireStation,
    getFireStation,
    // addFireStation,
    // updateFireStation,
    // deleteFireStation,
  }
}

export { ServiceFireStation }