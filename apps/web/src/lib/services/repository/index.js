/**
 * Repository 模块导出
 */

// 接口
export {
    IDocumentRepository,
    IFolderRepository,
    IVersionRepository
} from './interfaces';

// LocalStorage 实现
export {
    LocalStorageDocumentRepository,
    LocalStorageFolderRepository,
    LocalStorageVersionRepository,
    documentRepository,
    folderRepository,
    versionRepository
} from './LocalStorageRepository';
