import { setAbout } from "../redux/slice/aboutSlice";
import { store } from "../redux/store";
import { ROUTES } from "../utils/apiRoutes";
import baseService from "./baseService";

export const aboutUSService = async () => {
    try {
        const res = await baseService.get(ROUTES.ABOUT.ABOUTUS);
        store.dispatch(setAbout(res.data.data[0][0]))
        return res.data;
    } catch (err) {
        return err;
    }
};