import ApiService from "@/services/api.service";
import {CHECK_AUTH, LOGIN, LOGOUT} from "@/store/actions.type";
import {PURGE_AUTH, SET_AUTH} from "@/store/mutations.type";
import {getToken, saveToken} from "@/services/local_storage.service";

const actions = {
    async [LOGIN](context, payload) {
        const { data } = await ApiService.post('auth/login', payload)
        context.commit(SET_AUTH, data.user)

        saveToken(data.token)
        await ApiService.setHeader()
    },
    async [CHECK_AUTH](context) {
        if (getToken()) {
            if (!context.getters.isAuthenticated) {
                await ApiService.setHeader()
                const { data } = await ApiService.get('users/me')
                context.commit(SET_AUTH, data.user)

                saveToken(data.token)
                await ApiService.setHeader()
            }
        }
    },
    [LOGOUT](context) {
        context.commit(PURGE_AUTH)
    }
}

export default actions