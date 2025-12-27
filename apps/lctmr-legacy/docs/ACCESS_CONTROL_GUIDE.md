# 测试环境访问控制配置指南

## 一、现状分析

当前测试环境（开发环境）配置：
- **端口**: 3002
- **数据库**: lctmr_development
- **访问方式**: 直接通过端口访问，可能存在安全风险

生产环境配置：
- **端口**: 3001
- **数据库**: lctmr_production
- **访问方式**: 通过 Nginx 反向代理（端口 80）

## 二、安全风险

### 1. 测试环境暴露风险

- 测试环境端口（3002）可能对外网开放
- 测试数据可能被外部访问或篡改
- 测试环境配置可能泄露（如数据库密码、JWT密钥等）
- 测试环境的 CORS 配置较宽松，存在安全风险

### 2. 数据隔离风险

- 测试环境和生产环境使用相同的数据库用户和密码
- 如果测试环境被攻破，可能影响生产环境数据库安全

## 三、访问控制方案

### 方案一：防火墙规则限制（推荐）

#### 3.1 使用 iptables 限制访问

仅允许内网 IP 访问测试环境端口：

```bash
# 允许本地访问
iptables -A INPUT -p tcp --dport 3002 -s 127.0.0.1 -j ACCEPT

# 允许内网访问（根据实际内网段调整）
# 例如：允许 192.168.0.0/16 和 10.0.0.0/8
iptables -A INPUT -p tcp --dport 3002 -s 192.168.0.0/16 -j ACCEPT
iptables -A INPUT -p tcp --dport 3002 -s 10.0.0.0/8 -j ACCEPT

# 拒绝其他所有访问
iptables -A INPUT -p tcp --dport 3002 -j DROP

# 查看规则
iptables -L -n | grep 3002
```

#### 3.2 使用 UFW（Ubuntu/Debian）

```bash
# 允许本地访问
sudo ufw allow from 127.0.0.1 to any port 3002

# 允许内网访问
sudo ufw allow from 192.168.0.0/16 to any port 3002
sudo ufw allow from 10.0.0.0/8 to any port 3002

# 查看规则
sudo ufw status | grep 3002
```

#### 3.3 使用 firewalld（CentOS/RHEL）

```bash
# 添加富规则，仅允许内网访问
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.0.0/16" port protocol="tcp" port="3002" accept'
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="10.0.0.0/8" port protocol="tcp" port="3002" accept'
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="127.0.0.1" port protocol="tcp" port="3002" accept'

# 重新加载防火墙
firewall-cmd --reload

# 查看规则
firewall-cmd --list-rich-rules | grep 3002
```

### 方案二：Nginx 反向代理限制

在 Nginx 配置中添加测试环境的反向代理，并通过访问控制限制：

```nginx
# 测试环境配置（仅内网访问）
server {
    listen 3002;
    server_name _;
    
    # 仅允许内网 IP 访问
    allow 127.0.0.1;
    allow 192.168.0.0/16;
    allow 10.0.0.0/8;
    deny all;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 方案三：应用层访问控制

在后端服务中添加 IP 白名单中间件（仅开发环境）：

```javascript
// backend/middleware/ip-whitelist.js
const allowedIPs = [
    '127.0.0.1',
    '::1',
    // 添加内网 IP 段
    // '192.168.0.0/16',
    // '10.0.0.0/8',
];

function isAllowedIP(ip) {
    // 实现 IP 白名单检查逻辑
    // 支持 CIDR 表示法
}

module.exports = (req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        const clientIP = req.ip || req.connection.remoteAddress;
        if (!isAllowedIP(clientIP)) {
            return res.status(403).json({ error: 'Access denied' });
        }
    }
    next();
};
```

## 四、推荐配置步骤

### 步骤 1：确定内网 IP 段

首先确定需要访问测试环境的内网 IP 范围：

```bash
# 查看服务器 IP 配置
ip addr show
# 或
ifconfig

# 查看网络接口
ip route show
```

### 步骤 2：配置防火墙规则

根据服务器系统选择对应的防火墙工具：

**Ubuntu/Debian（推荐使用 UFW）：**

```bash
# 1. 确认当前规则
sudo ufw status

# 2. 添加测试环境端口规则（仅内网）
sudo ufw allow from 127.0.0.1 to any port 3002 comment 'Test env - localhost'
sudo ufw allow from 192.168.0.0/16 to any port 3002 comment 'Test env - private network'
sudo ufw allow from 10.0.0.0/8 to any port 3002 comment 'Test env - private network'

# 3. 启用防火墙（如果未启用）
sudo ufw enable

# 4. 验证规则
sudo ufw status numbered | grep 3002
```

**CentOS/RHEL（使用 firewalld）：**

```bash
# 1. 添加富规则
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="127.0.0.1" port protocol="tcp" port="3002" accept'
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.0.0/16" port protocol="tcp" port="3002" accept'
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="10.0.0.0/8" port protocol="tcp" port="3002" accept'

# 2. 重新加载
sudo firewall-cmd --reload

# 3. 验证
sudo firewall-cmd --list-rich-rules | grep 3002
```

### 步骤 3：测试访问

```bash
# 从本地测试
curl http://localhost:3002/health

# 从内网其他机器测试（替换为实际内网 IP）
curl http://<内网IP>:3002/health

# 尝试从外网访问（应该被拒绝）
# 如果配置正确，应该无法连接或超时
```

### 步骤 4：验证生产环境不受影响

```bash
# 确认生产环境端口（3001）正常访问
curl http://localhost:3001/health

# 通过 Nginx 访问生产环境
curl http://localhost/health
```

## 五、云服务器特殊配置

### 阿里云安全组配置

如果使用阿里云 ECS，需要在安全组中配置：

1. 登录阿里云控制台
2. 进入 ECS -> 网络与安全 -> 安全组
3. 找到对应实例的安全组，点击"配置规则"
4. 添加入站规则：
   - **端口**: 3002
   - **协议**: TCP
   - **授权对象**: 
     - 127.0.0.1/32（本地）
     - 192.168.0.0/16（内网，根据实际情况调整）
     - 10.0.0.0/8（内网，根据实际情况调整）
   - **描述**: 测试环境端口 - 仅内网访问

### 腾讯云安全组配置

1. 登录腾讯云控制台
2. 进入云服务器 CVM -> 安全组
3. 选择对应安全组，点击"入站规则"
4. 添加规则：
   - **类型**: 自定义
   - **来源**: 选择内网 IP 段
   - **协议端口**: TCP:3002
   - **策略**: 允许

## 六、自动化脚本

创建防火墙配置脚本 `scripts/setup-firewall-test-env.sh`：

```bash
#!/bin/bash
# 配置测试环境防火墙规则

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
```

## 七、监控和日志

### 监控被拒绝的连接

配置日志记录被拒绝的访问尝试：

```bash
# UFW 日志（默认在 /var/log/ufw.log）
sudo tail -f /var/log/ufw.log | grep 3002

# iptables 日志
# 首先添加日志规则
sudo iptables -I INPUT -p tcp --dport 3002 -j LOG --log-prefix "TEST-ENV-BLOCKED: "
# 查看系统日志
sudo tail -f /var/log/syslog | grep TEST-ENV-BLOCKED
```

## 八、安全检查清单

配置完成后，请确认：

- [ ] 测试环境端口（3002）仅允许内网访问
- [ ] 生产环境端口（3001）正常访问不受影响
- [ ] 防火墙规则已保存并持久化（重启后仍然有效）
- [ ] 从外网无法访问测试环境端口
- [ ] 从内网可以正常访问测试环境
- [ ] 防火墙日志正常记录

## 九、注意事项

1. **备份防火墙规则**：配置前先备份当前防火墙规则
2. **测试连通性**：配置后立即测试，确保不影响正常使用
3. **定期审查**：定期检查防火墙规则和日志，发现异常访问
4. **文档记录**：记录配置的内网 IP 段，便于后续维护
5. **生产环境隔离**：确保测试环境的配置变更不会影响生产环境

## 十、回滚方案

如果配置出现问题，可以快速回滚：

**UFW：**
```bash
# 查看规则编号
sudo ufw status numbered

# 删除特定规则
sudo ufw delete [规则编号]
```

**firewalld：**
```bash
# 删除规则
sudo firewall-cmd --permanent --remove-rich-rule='rule family="ipv4" ...'
sudo firewall-cmd --reload
```

**iptables：**
```bash
# 删除规则（需要精确匹配添加时的命令）
sudo iptables -D INPUT -p tcp --dport 3002 -s 192.168.0.0/16 -j ACCEPT
```



