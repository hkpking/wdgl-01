/**
 * 知识图谱模块 (轻量级)
 * 基于规则的实体关系提取，用于增强检索
 * 不依赖外部图数据库，使用内存存储
 */

export interface Entity {
    id: string;
    type: EntityType;
    name: string;
    aliases: string[];
    metadata?: Record<string, any>;
}

export interface Relation {
    id: string;
    sourceId: string;
    targetId: string;
    type: RelationType;
    weight: number;  // 关系强度 0-1
    metadata?: Record<string, any>;
}

export type EntityType =
    | 'document'      // 文档
    | 'policy'        // 制度
    | 'department'    // 部门
    | 'process'       // 流程
    | 'role'          // 角色
    | 'term'          // 术语
    | 'action';       // 操作

export type RelationType =
    | 'references'    // 引用
    | 'defines'       // 定义
    | 'belongs_to'    // 隶属于
    | 'related_to'    // 相关
    | 'supersedes'    // 取代
    | 'requires';     // 需要

/**
 * 实体提取规则
 */
const ENTITY_PATTERNS: { type: EntityType; patterns: RegExp[] }[] = [
    {
        type: 'policy',
        patterns: [
            /《([^》]+(?:制度|规定|办法|条例|规范|准则))》/g,
            /(?:公司|集团)([^，。\s]{2,15}(?:制度|规定|办法))/g,
        ]
    },
    {
        type: 'department',
        patterns: [
            /((?:人事|财务|行政|技术|市场|销售|研发|法务|采购|品控|生产)(?:部|中心|处|科|室)?)/g,
            /([^，。\s]{2,8}(?:部门|部|中心|处|科|室))/g,
        ]
    },
    {
        type: 'process',
        patterns: [
            /([^，。\s]{2,10}(?:流程|程序|步骤))/g,
            /((?:申请|审批|报销|采购|入职|离职|请假|出差)[^，。\s]{0,5}(?:流程)?)/g,
        ]
    },
    {
        type: 'role',
        patterns: [
            /((?:经理|主管|总监|主任|专员|助理|负责人|审批人|申请人))/g,
            /([^，。\s]{2,6}(?:岗位|职位))/g,
        ]
    },
    {
        type: 'action',
        patterns: [
            /((?:申请|审批|提交|审核|批准|驳回|报销|采购|签字|确认))/g,
        ]
    },
];

/**
 * 关系提取规则
 */
const RELATION_PATTERNS: { type: RelationType; pattern: RegExp; sourceGroup: number; targetGroup: number }[] = [
    {
        type: 'references',
        pattern: /根据《([^》]+)》|依据《([^》]+)》|参照《([^》]+)》/g,
        sourceGroup: 0, // 当前文档
        targetGroup: 1,
    },
    {
        type: 'belongs_to',
        pattern: /由([\u4e00-\u9fa5]+(?:部|中心|处))(?:负责|管理|执行)/g,
        sourceGroup: 0,
        targetGroup: 1,
    },
    {
        type: 'requires',
        pattern: /需要([\u4e00-\u9fa5]+(?:审批|批准|签字))/g,
        sourceGroup: 0,
        targetGroup: 1,
    },
];

// 内存存储
const entityStore: Map<string, Entity> = new Map();
const relationStore: Map<string, Relation> = new Map();
const documentEntityIndex: Map<string, Set<string>> = new Map(); // docId -> entityIds

/**
 * 生成实体 ID
 */
function generateEntityId(type: EntityType, name: string): string {
    const normalized = name.replace(/\s+/g, '_').toLowerCase();
    return `${type}:${normalized}`;
}

/**
 * 从文本中提取实体
 */
export function extractEntities(text: string, documentId?: string): Entity[] {
    const entities: Entity[] = [];
    const seen = new Set<string>();

    for (const { type, patterns } of ENTITY_PATTERNS) {
        for (const pattern of patterns) {
            // 重置正则表达式
            pattern.lastIndex = 0;

            let match;
            while ((match = pattern.exec(text)) !== null) {
                const name = match[1] || match[0];
                const id = generateEntityId(type, name);

                if (!seen.has(id)) {
                    seen.add(id);
                    entities.push({
                        id,
                        type,
                        name: name.trim(),
                        aliases: [],
                        metadata: { documentId }
                    });
                }
            }
        }
    }

    return entities;
}

/**
 * 从文本中提取关系
 */
export function extractRelations(
    text: string,
    documentId: string,
    existingEntities: Entity[]
): Relation[] {
    const relations: Relation[] = [];
    const entityMap = new Map(existingEntities.map(e => [e.name, e]));

    for (const { type, pattern } of RELATION_PATTERNS) {
        pattern.lastIndex = 0;

        let match;
        while ((match = pattern.exec(text)) !== null) {
            const targetName = match[1] || match[2] || match[3];
            if (targetName) {
                const targetEntity = entityMap.get(targetName);
                if (targetEntity) {
                    relations.push({
                        id: `${documentId}->${targetEntity.id}:${type}`,
                        sourceId: `document:${documentId}`,
                        targetId: targetEntity.id,
                        type,
                        weight: 0.8,
                        metadata: { context: match[0] }
                    });
                }
            }
        }
    }

    return relations;
}

/**
 * 索引文档的实体和关系
 */
export function indexDocumentKnowledge(
    documentId: string,
    content: string,
    title?: string
): { entities: Entity[]; relations: Relation[] } {
    // 提取实体
    const fullText = `${title || ''} ${content}`;
    const entities = extractEntities(fullText, documentId);

    // 存储实体
    const entityIds = new Set<string>();
    for (const entity of entities) {
        entityStore.set(entity.id, entity);
        entityIds.add(entity.id);
    }
    documentEntityIndex.set(documentId, entityIds);

    // 提取关系
    const relations = extractRelations(fullText, documentId, entities);
    for (const relation of relations) {
        relationStore.set(relation.id, relation);
    }

    console.log(`[KnowledgeGraph] Indexed doc ${documentId}: ${entities.length} entities, ${relations.length} relations`);

    return { entities, relations };
}

/**
 * 查找与查询相关的实体
 */
export function findRelatedEntities(query: string): Entity[] {
    const queryEntities = extractEntities(query);
    const relatedIds = new Set<string>();

    // 直接匹配的实体
    for (const qe of queryEntities) {
        if (entityStore.has(qe.id)) {
            relatedIds.add(qe.id);
        }
    }

    // 通过关系扩展
    for (const relation of relationStore.values()) {
        if (relatedIds.has(relation.sourceId)) {
            relatedIds.add(relation.targetId);
        }
        if (relatedIds.has(relation.targetId)) {
            relatedIds.add(relation.sourceId);
        }
    }

    return Array.from(relatedIds)
        .map(id => entityStore.get(id))
        .filter((e): e is Entity => e !== undefined);
}

/**
 * 获取实体相关的文档 ID 列表
 */
export function getDocumentsForEntity(entityId: string): string[] {
    const docIds: string[] = [];

    for (const [docId, entityIds] of documentEntityIndex.entries()) {
        if (entityIds.has(entityId)) {
            docIds.push(docId);
        }
    }

    // 通过关系扩展
    for (const relation of relationStore.values()) {
        if (relation.sourceId === entityId || relation.targetId === entityId) {
            const docId = relation.sourceId.replace('document:', '');
            if (!docIds.includes(docId)) {
                docIds.push(docId);
            }
        }
    }

    return docIds;
}

/**
 * 增强搜索：结合知识图谱扩展查询
 */
export function enhanceQueryWithKnowledge(query: string): {
    expandedQuery: string;
    relatedDocIds: string[];
    entities: Entity[];
} {
    const entities = findRelatedEntities(query);
    const relatedDocIds: string[] = [];

    // 收集相关文档
    for (const entity of entities) {
        const docs = getDocumentsForEntity(entity.id);
        for (const docId of docs) {
            if (!relatedDocIds.includes(docId)) {
                relatedDocIds.push(docId);
            }
        }
    }

    // 扩展查询（添加相关实体名称）
    const entityNames = entities.map(e => e.name).slice(0, 3);
    const expandedQuery = entityNames.length > 0
        ? `${query} ${entityNames.join(' ')}`
        : query;

    console.log(`[KnowledgeGraph] Query enhanced: "${query}" -> "${expandedQuery}" (${relatedDocIds.length} related docs)`);

    return { expandedQuery, relatedDocIds, entities };
}

/**
 * 获取知识图谱统计信息
 */
export function getKnowledgeGraphStats(): {
    entityCount: number;
    relationCount: number;
    documentCount: number;
    entityTypes: Record<EntityType, number>;
} {
    const entityTypes: Record<string, number> = {};

    for (const entity of entityStore.values()) {
        entityTypes[entity.type] = (entityTypes[entity.type] || 0) + 1;
    }

    return {
        entityCount: entityStore.size,
        relationCount: relationStore.size,
        documentCount: documentEntityIndex.size,
        entityTypes: entityTypes as Record<EntityType, number>
    };
}

/**
 * 清空知识图谱
 */
export function clearKnowledgeGraph(): void {
    entityStore.clear();
    relationStore.clear();
    documentEntityIndex.clear();
    console.log('[KnowledgeGraph] Cleared');
}
