import { setContact } from "../redux/slice/contactSlice";
import { store } from "../redux/store";
import { ROUTES } from "../utils/apiRoutes";
import baseService from "./baseService";

export const contactUsService = async () => {
    try {
        const res = await baseService.get(ROUTES.CONTACT.CONTACTUS);
        store.dispatch(setContact(res.data.data[0][0]))
        return res.data;
    } catch (err) {
        return err;
    }
};