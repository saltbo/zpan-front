import zSystem from './system'
import zUser from './user'
import zUserKey from './userKey'
import zStorage from './storage'
import zFile from './matter'
// import zFolder from './folder'
import zShare from './share'
import zRecyclebin from './recyclebin'

const System = new zSystem();
const User = new zUser();
const UserKey = new zUserKey();
const Storage = new zStorage();
const File = new zFile();
// const Folder = new zFolder();
const Share = new zShare();
const Recyclebin = new zRecyclebin();


export default {
    System,
    User,
    UserKey,
    Storage,
    File,
    // Folder,
    Share,
    Recyclebin
}