import { fetch } from '../fetch'
import { MASTER } from '../config'
import Cookies from 'js-cookie'

const ServiceAsset = () => {

  const getAssetByLimit = async (params) => {
    const res = await fetch('POST', `/assets/`, {
      ...params
    })
    return res
  }

  return {
    getAssetByLimit,
  }
}  

export { ServiceAsset }