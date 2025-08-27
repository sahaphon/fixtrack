import { fetch } from '../fetch'
import { MASTER } from '../config'
import Cookies from 'js-cookie'

const serviceEva = () => {
  const getAllMachine = async () => {
    const res = await fetch('POST', '/eva/get_all_machine', {})
    return res
  }

  const getOEE = async ({ type_search, offset, limit, search, filter }) => {
    const res = await fetch('POST', '/eva/', {
      type_search,
      offset,
      limit,
      search,
      filter,
    })
    return res
  }

  const getDetail = async ({ machine, date, shift }) => {
    const res = await fetch('POST', '/eva/get', {
      machine,
      date,
      shift,
    })
    return res
  }

  return {
    getAllMachine,
    getOEE,
    getDetail,
  }
}

export default serviceEva
