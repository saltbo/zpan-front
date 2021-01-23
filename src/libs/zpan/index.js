import zUser from './user'
import zStorage from './storage'
import zFile from './file'
import zFolder from './folder'
import zShare from './share'
import zRecyclebin from './recyclebin'

const User = new zUser();
const Storage = new zStorage();
const File = new zFile();
const Folder = new zFolder();
const Share = new zShare();
const Recyclebin = new zRecyclebin();


export default {
    User,
    Storage,
    File,
    Folder,
    Share,
    Recyclebin
}