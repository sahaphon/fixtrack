import { legacy_createStore as createStore } from 'redux'

const initialState = {
    sidebarShow: true,
    theme: 'light',
    themeAntd: 'light',
    userType: 'U',
    customer: {},
    api_path: '',
    focusedID: '',
    admin: false,
    helmet: '',
    user_data: {},
    role: '',
}

const changeState = (state = initialState, { type, ...rest }) => {
    switch (type) {
        case 'set':
            return { ...state, ...rest }
        default:
            return state
    }
}

const store = createStore(changeState)
export default store
