import { fetchLogin, fetch } from "../fetch";
import { MASTER, TOKEN } from "../config";
import Cookies from "js-cookie";

export const checkLogin = async ({ user_id, password }) => {
    try {
        const res = await fetchLogin({ user_id, password });
        if (res) {
            // Cookies.set(MASTER, res.emp_id)
            Cookies.set(MASTER, user_id);
            Cookies.set(TOKEN, res.access_token);
            return res;
        }
    } catch (e) {
        return false;
    }
};

export const getUserProfile = async () => {
    try {
        const user_id = Cookies.get(MASTER);
        if (!user_id) {
            return false;
        }
        const res = await fetch("POST", "/users/profile", { user_id });
        if (res) {
            return res;
        }
    } catch (e) {
        return false;
    }
};
export const getNavMenu = async () => {
    try {
        const user_id = Cookies.get(MASTER);
        if (!user_id) {
            return false;
        }
        const res = await fetch("POST", "/menus/nav", { user_id });
        if (res) {
            return res;
        }
    } catch (e) {
        return false;
    }
};
