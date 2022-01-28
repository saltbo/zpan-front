import { transfer } from "@/helper";
import FileViewer from "./viewer";
import DialogMove from "./components/DialogMove";
import DialogShare from "./components/DialogShare";
import DialogUpload from "./components/DialogUpload";
import DialogOutlink from "./components/DialogOutlink";

const mixin = {
    props: {
        value: Array,
        linkLoader: Function,
        loading: false,
    },
    data() {
        return {
            data: [],
        }
    },
    watch: {
        value(nval, oval) {
            this.data = nval;
        },
    },
    methods: {
        openCtxMenu(event, item) {
            this.$contextmenu({
                items: [
                    { label: "打开", onClick: () => { this.onNameClick(item) }, divided: true },
                    { label: "下载", onClick: () => this.openDownload(item) },
                    { label: "分享", onClick: () => this.openShare(item) },
                    { label: "获取链接", onClick: () => this.openOutline(item), divided: true },
                    // { label: "复制到", onClick: () => this.openCopy(item) },
                    { label: "移动到", onClick: () => this.openMove(item) },
                    { label: "重命名", onClick: () => this.openRename(item), divided: true },
                    { label: "删除", onClick: () => this.openRemove(item) }
                ],
                event,
                //x: event.clientX,
                //y: event.clientY,
                customClass: "custom-class",
                zIndex: 3,
                minWidth: 230
            });
            return false;
        },
        buildQuery(dir) {
            if (dir.startsWith(this.rootDir)) {
                dir = dir.replace(this.rootDir, "");
            }

            let query = !dir ? {} : { dir: dir };
            return { query: query };
        },
        onNameClick(item) {
            // open a folder
            if (item.dirtype) {
                this.$router.push(this.buildQuery(item.fullpath));
                return;
            }

            // todo 支持外部查看器打开文件

            // open file by the built-in file viewer
            new FileViewer(this.linkLoader).view(item);
        },
        onCtxMenuClick(action, item) {
            console.log(action, item)
        },
        openDownload(obj) {
            this.linkLoader(obj).then((link) => {
                let a = document.createElement("a");
                a.setAttribute("href", link);
                a.setAttribute("download", obj.name);
                a.click();
                a.remove();
            });
        },
        openShare(obj) {
            transfer(DialogShare)({ alias: obj.alias });
        },
        openOutlinkMulti(obj) {
            //   transfer(DialogOutlink)({ items: this.selectedItems });
        },
        openOutline(obj) {
            this.linkLoader(obj).then((link) => {
                const h = this.$createElement;
                this.$msgbox({
                    title: "获取外链",
                    message: h("p", null, link),
                    confirmButtonText: "确定",
                });
            });
        },
        openMove(obj) {
            transfer(DialogMove)({ alias: obj.alias, isDir: obj.dirtype > 0 }).then(() => {
                this.listRefresh();
            });
        },
        openRename(obj) {
            this.$prompt(this.$t("tips.rename"), this.$t("op.rename"), {
                inputValue: obj.name,
                confirmButtonText: this.$t("op.confirm"),
                cancelButtonText: this.$t("op.cancel"),
            }).then(({ value }) => {
                this.$zpan.File.rename(obj.alias, value).then((ret) => {
                    this.$message({
                        type: "success",
                        message: this.$t("msg.rename-success"),
                    });
                    this.listRefresh();
                });
            });
        },
        openRemove(obj) {
            this.$confirm(this.$t("tips.remove"), this.$t("op.delete") + ` ${obj.name}`, {
                type: "warning",
                confirmButtonText: this.$t("op.confirm"),
                cancelButtonText: this.$t("op.cancel"),
            }).then(() => {
                this.$zpan.File.delete(obj.alias).then((ret) => {
                    this.$message({
                        type: "success",
                        message: this.$t("msg.delete-success"),
                    });
                    this.listRefresh();
                });
            });
        },
    }
}

export default mixin