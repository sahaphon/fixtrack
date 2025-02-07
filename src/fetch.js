import Axios from 'axios'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
import { BASE_URL, MASTER, TOKEN, PROGRAM } from './config'
import { replaceNullObj, removeCookie } from './utilities/utilitiesFunction'

const alertError = (message, auth = true) => {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        showConfirmButton: true,
        confirmButtonText: 'Ok',
    }).then(() => {
        if (auth === false) {
            removeCookie()
            window.location.replace(`/${PROGRAM}/login`)
        }
    })
}

const fetchLogin = async (params) => {
    try {
        const res = await Axios({
            method: 'POST',
            url: BASE_URL + '/login',
            data: params,
        })
        const { data } = res
        if (data.success) {
            return replaceNullObj(data.response)
        } else {
            if (data.message === 'You are not authenticated') {
                return alertError(data.message, false)
            }
            return alertError(data.message)
        }
    } catch (err) {
        alertError(err)
    }
}

const fetch = async (
    method = 'GET',
    path,
    params = {},
    config = {},
    fallBack = async () => {},
    headers = {},
) => {
    try {
        await fallBack(BASE_URL + path)
        const { data } = await Axios({
            method: method,
            url: BASE_URL + path,
            data: params,
            headers: {
                authorization: Cookies.get(MASTER) + ':' + Cookies.get(TOKEN),
                ...headers,
            },
            ...config,
        })
        console.log('fetch', data)
        if (data.success) {
            return replaceNullObj(data.response)
        } else {
            console.log(path)
            if (data.message === 'You are not authenticated') {
                return alertError(data.message, false)
            }
            return alertError(data.message)
        }
    } catch (err) {
        console.error(path, params)
        alertError(err)
    }
}
const fetch2 = async (
    method = 'GET',
    path,
    params = {},
    config = {},
    fallBack = async () => {},
) => {
    try {
        await fallBack(BASE_URL + path)
        const { data } = await Axios({
            method: method,
            url: BASE_URL + path,
            data: params,
            headers: {
                authorization: Cookies.get(MASTER) + ':' + Cookies.get(TOKEN),
                'Content-Type': 'multipart/form-data',
            },
            ...config,
        })

        if (data.success) {
            return replaceNullObj(data.response)
        } else {
            if (data.message === 'You are not authenticated') {
                return alertError(data.message, false)
            }
            return alertError(data.message)
        }
    } catch (err) {
        alertError(err)
    }
}

const fetchImage = (type, id) => {
    return `${BASE_URL}/files/${type}/${id}`
}
const getImage = (type, id) => {
    return `${BASE_URL}/get_picture/${type}/${id}`
}

export { fetch, fetchLogin, fetchImage, fetch2, getImage }
