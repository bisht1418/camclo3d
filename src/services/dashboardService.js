import { clearAuth } from "../redux/slice/authSlice";
import { clearDashboard, setDashboard } from "../redux/slice/dashboardSlice";
import { setIsAuthenticated } from "../redux/slice/globalSlice";
import { store } from "../redux/store";
import { ROUTES } from "../utils/apiRoutes";
import baseService from "./baseService";

export const dashboardService = async () => {
    const token = store.getState().auth.token;
    try {
        const res = await baseService.get(ROUTES.DASHBOARD.GETDASHBOARDDATA, {
            headers: { Authorization: `Bearer ${token}` }
        });
        store.dispatch(setDashboard(res.data.data[0]))
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
