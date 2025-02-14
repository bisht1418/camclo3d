import { clearAuth } from "../redux/slice/authSlice";
import { clearDashboard } from "../redux/slice/dashboardSlice";
import { setIsAuthenticated } from "../redux/slice/globalSlice";
import { setInquiry, setPackage, setPackageHome, setPackageUser } from "../redux/slice/ourServiceSlice";
import { store } from "../redux/store";
import { ROUTES } from "../utils/apiRoutes";
import baseService from "./baseService";

export const inquiryService = async (userData) => {
    try {
        const res = await baseService.post(ROUTES.SERVICES.INQUIRY, userData);
        store.dispatch(setInquiry(res.data.data))
        return res.data;
    } catch (err) {
        return err;
    }
};
export const packageService = async () => {
    try {
        const res = await baseService.get(ROUTES.SERVICES.PACKAGES);
        store.dispatch(setPackage(res.data.data))
        store.dispatch(setPackageHome(res.data.data[0]))
        return res.data;
    } catch (err) {
        return err;
    }
};
export const purchasePackage = async (data) => {
    const token = store.getState().auth.token;
    try {
        const res = await baseService.post(ROUTES.SERVICES.PURCHASEPACKAGE, data, {
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

export const purchasePackageUser = async () => {
    const token = store.getState().auth.token;
    try {
        const res = await baseService.get(ROUTES.SERVICES.GETPURCHASEPACKAGE, {
            headers: { Authorization: `Bearer ${token}` }
        });
        store.dispatch(setPackageUser(res.data.data))
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