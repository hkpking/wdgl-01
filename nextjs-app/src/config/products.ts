/**
 * 产品注册表
 * 定义所有可用产品的配置信息
 */

import type { Product } from '@/components/shared/types';

/**
 * 产品注册表配置
 * 所有产品都需要在这里注册
 */
export const PRODUCT_REGISTRY: Record<string, Product> = {
    docs: {
        id: 'docs',
        name: '文档协作',
        description: '制度文档编辑与协作平台',
        icon: 'FileText',
        baseUrl: '',  // 当前主应用，空路径
        requiredPermission: 'docs:access',
        isActive: true,
    },
    learning: {
        id: 'learning',
        name: '制度学习',
        description: '制度流程学习与培训平台',
        icon: 'BookOpen',
        baseUrl: '/learning',
        requiredPermission: 'learning:access',
        isActive: false, // 开发中
    },
    workflow: {
        id: 'workflow',
        name: '流程管理',
        description: '业务流程设计与管理',
        icon: 'GitBranch',
        baseUrl: '/workflow',
        requiredPermission: 'workflow:access',
        isActive: false, // 规划中
    },
};

/**
 * 获取所有产品列表
 */
export function getAllProducts(): Product[] {
    return Object.values(PRODUCT_REGISTRY);
}

/**
 * 获取激活的产品列表
 */
export function getActiveProducts(): Product[] {
    return getAllProducts().filter(p => p.isActive);
}

/**
 * 根据 ID 获取产品
 */
export function getProductById(id: string): Product | undefined {
    return PRODUCT_REGISTRY[id];
}

/**
 * 获取产品的完整 URL
 */
export function getProductUrl(productId: string, path: string = '/'): string {
    const product = getProductById(productId);
    if (!product) {
        return '/';
    }
    return `${product.baseUrl}${path}`;
}

/**
 * 检查用户是否有产品访问权限
 */
export function hasProductPermission(
    productId: string,
    userPermissions?: Record<string, any>
): boolean {
    const product = getProductById(productId);
    if (!product) {
        return false;
    }

    // 如果产品不需要权限，直接返回 true
    if (!product.requiredPermission) {
        return true;
    }

    // 检查用户权限
    if (!userPermissions) {
        return false;
    }

    return productId in userPermissions;
}
