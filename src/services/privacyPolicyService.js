import { setPrivacy } from "../redux/slice/privacyPolicySlice";
import { store } from "../redux/store";
import { ROUTES } from "../utils/apiRoutes";
import baseService from "./baseService";

export const privacyPolicyService = async () => {
    try {
        const res = await baseService.get(ROUTES.PRIVACY.PRIVACYPOLICY);
        store.dispatch(setPrivacy(res.data.data[0][0]))
        return res.data;
    } catch (err) {
        return err;
    }
};