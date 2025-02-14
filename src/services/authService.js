import { clearAuth, setMyProfile, setNotification, setrefreshToken, setUser } from "../redux/slice/authSlice";
import { clearDashboard } from "../redux/slice/dashboardSlice";
import { setIsAuthenticated } from "../redux/slice/globalSlice";
import { store } from "../redux/store";
;
import { ROUTES } from "../utils/apiRoutes";
import baseService from "./baseService";

export const userRegister = async (userData) => {
    try {
        const res = await baseService.post(ROUTES.AUTH.REGISTER, userData);
        store.dispatch(setUser(res.data.data))
        return res.data;
    } catch (err) {
        return err;
    }
};
export const verifyOtp = async (Data, edit) => {
    const socialAuth = localStorage.getItem("socialAuth")
    const loginManully = localStorage.getItem("loginManully")

    try {
        const res = await baseService.post(ROUTES.AUTH.VERIFYOTP, Data);
        if (res) {
            if (socialAuth && res?.data?.status) {
                store.dispatch(setIsAuthenticated(true));
                localStorage.removeItem("socialAuth")
            }
            else if (loginManully && res?.data?.status) {
                store.dispatch(setIsAuthenticated(true));
            }
            else if (!edit) {
                store.dispatch(setIsAuthenticated(false));
            }


        }
        return res.data;
    } catch (err) {
        if (err?.status === 401) {
            store.dispatch(clearAuth())
            store.dispatch(clearDashboard())
            store.dispatch(setIsAuthenticated(false));
        }
        return err;
    }
};

export const login = async (userData) => {
    try {
        const res = await baseService.post(ROUTES.AUTH.LOGIN, userData);
        if (res) {
            store.dispatch(setUser(res.data.data))
            store.dispatch(setrefreshToken(res?.data?.data?.access_token))
            localStorage.setItem("loginManully", true)
        }
        if (res?.data?.data?.is_active === "1") {
            store.dispatch(setIsAuthenticated(true));
        }


        return res.data;
    } catch (err) {
        return err;
    }
};
export const resendOtp = async (Data) => {
    try {
        const res = await baseService.post(ROUTES.AUTH.RESENDOTP, Data);
        return res.data;
    } catch (err) {
        return err;
    }
};

export const forgetPassword = async (Data) => {
    try {
        const res = await baseService.post(ROUTES.AUTH.FORGETPASSWORD, Data);
        return res.data;
    } catch (err) {
        return err;
    }
};
export const resetPassword = async (Data) => {
    try {
        const res = await baseService.post(ROUTES.AUTH.RESETPASSWORD, Data);
        return res.data;
    } catch (err) {
        return err;
    }
};

export const socialAuth = async (Data) => {
    try {
        const res = await baseService.post(ROUTES.AUTH.SOCIALAUTH, Data);
        if (res) {
            store.dispatch(setrefreshToken(res?.data?.data?.access_token))
            store.dispatch(setUser(res.data.data))
            localStorage.setItem("socialAuth", true)
        }
        if (res?.data?.data?.is_active === "1") {
            store.dispatch(setIsAuthenticated(true));
            localStorage.removeItem("socialAuth")
        }
        return res.data;
    } catch (err) {
        return err;
    }
};

export const myProfile = async () => {
    const token = store.getState().auth.token;
    try {
        const res = await baseService.post(ROUTES.AUTH.MYPROFILE, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
        store.dispatch(setMyProfile(res?.data?.data))
        store.dispatch(setUser(res?.data?.data))
        localStorage.removeItem("loginManully")
        return res.data;
    } catch (err) {
        if (err?.status === 401) {
            store.dispatch(clearAuth())
            store.dispatch(clearDashboard())
            store.dispatch(setIsAuthenticated(false));
        }
        return err;
    }
};
export const editProfile = async (data) => {
    const token = store.getState().auth.token;
    try {
        const res = await baseService.post(ROUTES.AUTH.EDITPROFILE, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        store.dispatch(setMyProfile(res?.data?.data))
        store.dispatch(setUser(res?.data?.data))
        return res.data;
    } catch (err) {
        if (err?.status === 401) {
            store.dispatch(clearAuth())
            store.dispatch(clearDashboard())
            store.dispatch(setIsAuthenticated(false));
        }
        return err;
    }
};
export const changePassword = async (data) => {
    const token = store.getState().auth.token;
    try {
        const res = await baseService.post(ROUTES.AUTH.CHANGEPASSWORD, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (err) {
        if (err?.status === 401) {
            store.dispatch(clearAuth())
            store.dispatch(clearDashboard())
            store.dispatch(setIsAuthenticated(false));
        }
        return err;
    }
};
export const mobileVerify = async (data) => {
    try {
        const res = await baseService.post(ROUTES.AUTH.MOBILEVERIFY, data);
        return res.data;
    } catch (err) {
        return err;
    }
};

export const userNotification = async () => {
    const token = store.getState().auth.token;
    try {
        const res = await baseService.get(ROUTES.AUTH.NOTIFICATION, {
            headers: { Authorization: `Bearer ${token}` }
        });
        store.dispatch(setNotification(res.data.data[0]))
        return res.data;
    } catch (err) {
        if (err?.status === 401) {
            store.dispatch(clearAuth())
            store.dispatch(clearDashboard())
            store.dispatch(setIsAuthenticated(false));
        }
        return err;
    }
};
export const userLogout = async () => {
    const token = store.getState().auth.token;
    try {
        const res = await baseService.post(ROUTES.AUTH.LOGOUT, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res?.data?.status === 1) {
            store.dispatch(clearAuth())
            store.dispatch(clearDashboard())
            store.dispatch(setIsAuthenticated(false));
        }

        return res.data;
    } catch (err) {
        if (err?.status === 401) {
            store.dispatch(clearAuth())
            store.dispatch(clearDashboard())
            store.dispatch(setIsAuthenticated(false));
        }
        return err;
    }
};

export const userPhoto = async (data) => {
    const token = store.getState().auth.token;
    try {
        const res = await baseService.post(ROUTES.AUTH.PROFILEPICTURE, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        store.dispatch(setUser(res.data.data))
        return res.data;
    } catch (err) {
        if (err?.status === 401) {
            store.dispatch(clearAuth())
            store.dispatch(clearDashboard())
            store.dispatch(setIsAuthenticated(false));
        }
        return err;
    }
};