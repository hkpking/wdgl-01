/**
 * 产品注册表类型
 */
export interface Product {
    id: string;
    name: string;
    description?: string;
    icon: string;
    baseUrl: string;
    requiredPermission?: string;
    isActive?: boolean;
}

/**
 * 用户信息类型（用于导航组件）
 */
export interface NavUser {
    uid: string;
    email?: string;
    displayName: string;
    avatarUrl?: string;
}

/**
 * 全局导航 Props
 */
export interface GlobalNavProps {
    user: NavUser | null;
    products: Product[];
    currentProductId?: string;
    onProductChange?: (productId: string) => void;
    onSignOut?: () => void;
    onSearch?: (query: string) => void;
    showSearch?: boolean;
    className?: string;
}

/**
 * 产品切换器 Props
 */
export interface ProductSwitcherProps {
    products: Product[];
    currentProductId?: string;
    onProductChange?: (productId: string) => void;
    className?: string;
}

/**
 * 用户菜单 Props
 */
export interface UserMenuProps {
    user: NavUser;
    onSignOut?: () => void;
    onSettingsClick?: () => void;
    className?: string;
}

/**
 * 通用按钮 Props
 */
export interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

/**
 * 模态框 Props
 */
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}
