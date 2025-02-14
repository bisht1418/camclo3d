import { setTerm } from "../redux/slice/termConditionSlice";
import { store } from "../redux/store";
import { ROUTES } from "../utils/apiRoutes";
import baseService from "./baseService";

export const termService = async () => {
    try {
        const res = await baseService.get(ROUTES.TERM.TERMANDCONDITION);
        store.dispatch(setTerm(res.data.data[0][0]))
        return res.data;
    } catch (err) {
        return err;
    }
};