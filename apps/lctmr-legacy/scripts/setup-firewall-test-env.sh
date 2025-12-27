#!/bin/bash
# 配置测试环境防火墙规则
# 仅允许内网访问测试环境端口（3002）

set -e

PORT=3002
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "配置测试环境（端口 $PORT）防火墙规则..."

# 检测系统类型
if command -v ufw &> /dev/null; then
    echo "使用 UFW 配置防火墙..."
    sudo ufw allow from 127.0.0.1 to any port $PORT comment 'Test env - localhost'
    sudo ufw allow from 192.168.0.0/16 to any port $PORT comment 'Test env - private network'
    sudo ufw allow from 10.0.0.0/8 to any port $PORT comment 'Test env - private network'
    echo "UFW 规则已添加"
elif command -v firewall-cmd &> /dev/null; then
    echo "使用 firewalld 配置防火墙..."
    sudo firewall-cmd --permanent --add-rich-rule="rule family=\"ipv4\" source address=\"127.0.0.1\" port protocol=\"tcp\" port=\"$PORT\" accept"
    sudo firewall-cmd --permanent --add-rich-rule="rule family=\"ipv4\" source address=\"192.168.0.0/16\" port protocol=\"tcp\" port=\"$PORT\" accept"
    sudo firewall-cmd --permanent --add-rich-rule="rule family=\"ipv4\" source address=\"10.0.0.0/8\" port protocol=\"tcp\" port=\"$PORT\" accept"
    sudo firewall-cmd --reload
    echo "firewalld 规则已添加"
else
    echo "未检测到支持的防火墙工具（UFW 或 firewalld）"
    echo "请手动配置 iptables 规则"
    exit 1
fi

echo "✅ 防火墙配置完成"
echo ""
echo "验证规则："
if command -v ufw &> /dev/null; then
    sudo ufw status | grep $PORT
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --list-rich-rules | grep $PORT
fi



