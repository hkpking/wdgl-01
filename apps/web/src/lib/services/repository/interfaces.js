/**
 * 文档仓库接口 (Repository Interface)
 * 定义数据层的标准契约，支持不同存储后端的实现
 * 
 * 当前实现:
 * - LocalStorageRepository: 使用 localStorage 进行本地存储
 * 
 * 未来可扩展:
 * - FirebaseRepository: Firebase Firestore
 * - APIRepository: RESTful API
 */

/**
 * @typedef {Object} Document
 * @property {string} id - 文档唯一标识
 * @property {string} title - 文档标题
 * @property {string} content - 文档内容 (HTML)
 * @property {string} [parentId] - 所属文件夹ID
 * @property {string} status - 文档状态 (draft/review/approved)
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 */

/**
 * @typedef {Object} Folder
 * @property {string} id - 文件夹唯一标识
 * @property {string} name - 文件夹名称
 * @property {string} [parentId] - 父文件夹ID (null表示根目录)
 * @property {string} createdAt - 创建时间
 */

/**
 * @typedef {Object} Version
 * @property {string} id - 版本唯一标识
 * @property {string} docId - 关联的文档ID
 * @property {string} content - 版本内容
 * @property {string} title - 版本标题
 * @property {string} createdAt - 创建时间
 * @property {string} [label] - 版本标签 (可选)
 */

/**
 * 文档仓库接口
 * @interface IDocumentRepository
 */
export class IDocumentRepository {
    /**
     * 获取所有文档
     * @param {string} userId - 用户ID
     * @returns {Promise<Document[]>}
     */
    async getAll(userId) { throw new Error('Not implemented'); }

    /**
     * 获取单个文档
     * @param {string} userId - 用户ID
     * @param {string} docId - 文档ID
     * @returns {Promise<Document|null>}
     */
    async getById(userId, docId) { throw new Error('Not implemented'); }

    /**
     * 搜索文档
     * @param {string} userId - 用户ID
     * @param {string} query - 搜索关键词
     * @returns {Promise<Document[]>}
     */
    async search(userId, query) { throw new Error('Not implemented'); }

    /**
     * 保存文档 (创建或更新)
     * @param {string} userId - 用户ID
     * @param {string|null} docId - 文档ID (null表示新建)
     * @param {Partial<Document>} data - 文档数据
     * @returns {Promise<Document>}
     */
    async save(userId, docId, data) { throw new Error('Not implemented'); }

    /**
     * 删除文档
     * @param {string} userId - 用户ID
     * @param {string} docId - 文档ID
     * @returns {Promise<boolean>}
     */
    async delete(userId, docId) { throw new Error('Not implemented'); }

    /**
     * 移动文档到文件夹
     * @param {string} userId - 用户ID
     * @param {string} docId - 文档ID
     * @param {string|null} folderId - 目标文件夹ID
     * @returns {Promise<boolean>}
     */
    async move(userId, docId, folderId) { throw new Error('Not implemented'); }
}

/**
 * 文件夹仓库接口
 * @interface IFolderRepository
 */
export class IFolderRepository {
    /**
     * 获取所有文件夹
     * @param {string} userId - 用户ID
     * @returns {Promise<Folder[]>}
     */
    async getAll(userId) { throw new Error('Not implemented'); }

    /**
     * 创建文件夹
     * @param {string} userId - 用户ID
     * @param {string} name - 文件夹名称
     * @param {string|null} parentId - 父文件夹ID
     * @returns {Promise<Folder>}
     */
    async create(userId, name, parentId) { throw new Error('Not implemented'); }

    /**
     * 更新文件夹
     * @param {string} userId - 用户ID
     * @param {string} folderId - 文件夹ID
     * @param {Partial<Folder>} updates - 更新数据
     * @returns {Promise<Folder>}
     */
    async update(userId, folderId, updates) { throw new Error('Not implemented'); }

    /**
     * 删除文件夹
     * @param {string} userId - 用户ID
     * @param {string} folderId - 文件夹ID
     * @returns {Promise<boolean>}
     */
    async delete(userId, folderId) { throw new Error('Not implemented'); }
}

/**
 * 版本仓库接口
 * @interface IVersionRepository
 */
export class IVersionRepository {
    /**
     * 获取文档版本历史
     * @param {string} userId - 用户ID
     * @param {string} docId - 文档ID
     * @returns {Promise<Version[]>}
     */
    async getAll(userId, docId) { throw new Error('Not implemented'); }

    /**
     * 保存版本
     * @param {string} userId - 用户ID
     * @param {string} docId - 文档ID
     * @param {Partial<Version>} data - 版本数据
     * @returns {Promise<Version>}
     */
    async save(userId, docId, data) { throw new Error('Not implemented'); }

    /**
     * 更新版本信息
     * @param {string} userId - 用户ID
     * @param {string} docId - 文档ID
     * @param {string} versionId - 版本ID
     * @param {Partial<Version>} updates - 更新数据
     * @returns {Promise<Version>}
     */
    async update(userId, docId, versionId, updates) { throw new Error('Not implemented'); }
}
