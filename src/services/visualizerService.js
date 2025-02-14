import { clearAuth } from "../redux/slice/authSlice";
import { clearDashboard } from "../redux/slice/dashboardSlice";
import { setIsAuthenticated } from "../redux/slice/globalSlice";
import { setTemplate } from "../redux/slice/visualizerSlice";
import { store } from "../redux/store";
import { ROUTES } from "../utils/apiRoutes";
import baseService from "./baseService";

export const generatedImageService = async (data) => {
    const token = store.getState().auth.token;
    try {
        const res = await baseService.post(ROUTES.VISUALIZER.GENRATEDIMAGE, data, {
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


export const getTemplatesService = async () => {
    const token = store.getState().auth.token;
    try {
        const res = await baseService.get(ROUTES.VISUALIZER.GETTEMPLATE, {
            headers: { Authorization: `Bearer ${token}` }
        })
        store.dispatch(setTemplate(res?.data))
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

