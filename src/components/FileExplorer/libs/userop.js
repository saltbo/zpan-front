import { transfer } from "@/helper";
import action from "./action"

import DialogConfirm from "../components/DialogConfirm";
import DialogInputConfirm from "../components/DialogInputConfirm";
import DialogMove from "../components/DialogMove";
import DialogShare from "../components/DialogShare";
import DialogUpload from "../components/DialogUpload";
import DialogOutlink from "../components/DialogOutlink";


export function registerAction(name, actionFunc) {
    action.register(name, actionFunc)
}

export function openShare(obj) {
    transfer(DialogShare)({ alias: obj.alias });
}

export function openOutline(obj) {
    //   transfer(DialogOutlink)({ items: this.selectedItems });

    // this.linkLoader(obj).then((link) => {
    //     const h = this.$createElement;
    //     this.$msgbox({
    //       title: "获取外链",
    //       message: h("p", null, link),
    //       confirmButtonText: "确定",
    //     });
    //   });
}

export function openRename(matter) {
    return new Promise((resolve, reject) => {
        transfer(DialogInputConfirm)({ title: "重命名", description: "输入 xxx 的新名称:", value: matter.name }).then((newName) => {
            action.do('rename', matter.alias, newName).then(resolve).catch(reject)
        });
    })
}

export function openRemove(...matters) {
    return new Promise((resolve, reject) => {
        transfer(DialogConfirm)({ title: "删除", description: "确认删除 xxx 吗", matters: matters }).then(() => {
            action.doBatch("remove", ...matters).then(resolve).catch(reject)
        });
    })
}

export function openMove(...matters) {
    return new Promise((resolve, reject) => {
        transfer(DialogMove)({ title: "移动", matters: matters }).then(() => {
            action.doBatch("move", ...matters).then(resolve).catch(reject)
        });
    })
}

    //   this.$confirm(this.$t("tips.batch-delete"), this.$t("op.batch-delete"), {
    //     type: "warning",
    //     confirmButtonText: this.$t("op.confirm"),
    //     cancelButtonText: this.$t("op.cancel"),
    //   }).then(() => {
    //     const loading = this.$loading({
    //       lock: true,
    //       text: this.$t("tips.deleting"),
    //       spinner: "el-icon-loading",
    //       background: "rgba(0, 0, 0, 0.7)",
    //     });

