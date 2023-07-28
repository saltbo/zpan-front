
import { Toast, Loading } from "@/components"

var actions = {}
var vToast, vLoading

export default {
    register(action, actionFunc) {
        if (!vToast) {
            vToast = Toast()
            vLoading = Loading()
            vToast.success("test")
        }

        actions[action] = actionFunc
    },

    do(action, ...params) {
        return new Promise((resolve, reject) => {
            actions[action](...params).then((ret) => {
                vToast.success(`${action}成功`)
                resolve()
            }).catch(() => {
                vToast.error(`${action}失败`)
                reject()
            })
        })
    },
    doBatch(action, ...matters) {
        return new Promise((resolve, reject) => {
            vLoading.show()
            Promise.all(matters.map((obj) => {
                return actions[action](obj.alias);
            })).then((ret) => {
                vLoading.hide()
                vToast.success(`${action}成功`)
                resolve()
            }).catch(() => {
                vLoading.hide()
                vToast.error(`${action}失败`)
                reject()
            });
        })
    }
}