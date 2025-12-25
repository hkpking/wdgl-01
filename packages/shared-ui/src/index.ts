/**
 * @wdgl/shared-ui
 * 统一 UI 组件库入口
 */

// 导出核心组件
export { GlobalNav } from './components/GlobalNav';
export { ProductSwitcher } from './components/ProductSwitcher';
export { UserMenu } from './components/UserMenu';

// 导出所有类型
export type {
    Product,
    NavUser,
    GlobalNavProps,
    ProductSwitcherProps,
    UserMenuProps,
    ButtonProps,
    ModalProps,
} from './types';
