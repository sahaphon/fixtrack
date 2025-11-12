import Cookies from 'js-cookie'
import { fetch } from '../fetch'
import { MASTER } from '../config'

const ServiceRepair = () => {

  const getAllRepairOrders = async ({ limit, offset, type_search, search, filter }) => {
    const res = await fetch('POST', '/repair/', { limit, offset, type_search, search, filter })
    return res
  }

  const getRepairOrderDetail = async (repair_order_id) => {
    const res = await fetch('POST', `/repair/orders/get`, { repair_order_id })
    return res
  }

  const getBadgeCount = async () => {
        try {
            const res = await fetch('POST', '/repair/badge')
            return res
        } catch (e) {
            return false
        }
    }

  return {
    getAllRepairOrders,
    getRepairOrderDetail,
    getBadgeCount,
  }
}   

export { ServiceRepair }