#!/bin/bash
# 远程桌面性能优化脚本
# 作用：降低 xrdp 带宽占用，禁用视觉特效

echo "🚀 开始优化远程桌面性能..."

# 1. 禁用 XFCE 合成器和动画
echo "📦 禁用 XFCE 视觉特效..."
xfconf-query -c xfwm4 -p /general/use_compositing -s false 2>/dev/null && echo "  ✓ 合成器已禁用"
xfconf-query -c xfwm4 -p /general/box_move -s true 2>/dev/null && echo "  ✓ 窗口拖动优化"
xfconf-query -c xfwm4 -p /general/box_resize -s true 2>/dev/null && echo "  ✓ 窗口调整优化"

# 2. 备份并修改 xrdp 配置
echo ""
echo "📝 请手动执行以下命令修改 xrdp 配置（需要 sudo）："
echo ""
echo "  sudo sed -i 's/^max_bpp=32/max_bpp=16/' /etc/xrdp/xrdp.ini"
echo "  sudo systemctl restart xrdp"
echo ""

# 3. 设置环境变量减少 GPU 占用
echo "🎨 设置性能优化环境变量..."
export LIBGL_ALWAYS_SOFTWARE=1

echo ""
echo "✅ 优化完成！请重新连接远程桌面以生效。"
echo ""
echo "📌 其他建议："
echo "  1. 在 Windows RDP 客户端设置颜色深度为 16 位"
echo "  2. 在体验标签选择'低速宽带'预设"
echo "  3. 如果仍然卡顿，考虑使用 NoMachine 替代 xrdp"
