import { setFaq } from "../redux/slice/faqSlice";
import { store } from "../redux/store";
import { ROUTES } from "../utils/apiRoutes";
import baseService from "./baseService";

export const faqService = async () => {
    try {
        const res = await baseService.get(ROUTES.FAQ.FAQDATA);
        store.dispatch(setFaq(res.data.data[0]))
        return res.data;
    } catch (err) {
        return err;
    }
};