import FileExplorer from './FileExplorer.vue'

const components = {
    FileExplorer: FileExplorer,
}

const install = function (Vue, options) {
    Object.keys(components).forEach(key => {
        Vue.component(key, components[key]);
    });
}

export default install