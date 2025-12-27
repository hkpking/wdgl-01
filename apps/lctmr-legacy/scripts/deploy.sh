#!/bin/bash
# 部署脚本 - 支持开发和生产环境并行运行
# 使用方法: ./deploy.sh [environment] [action]
# 示例: ./deploy.sh production start

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV="${1:-production}"
ACTION="${2:-status}"

# 日志函数
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 获取环境配置文件的端口
get_env_port() {
    local env_file="$PROJECT_ROOT/env.$ENV"
    if [ ! -f "$env_file" ]; then
        log_error "环境配置文件不存在: $env_file"
        exit 1
    fi
    local port=$(grep ^PORT "$env_file" | cut -d'=' -f2 | tr -d ' ' || echo "")
    if [ -z "$port" ]; then
        log_error "无法从 $env_file 读取端口配置"
        exit 1
    fi
    echo "$port"
}

# 通过端口查找进程 PID
get_pid_by_port() {
    local port=$1
    if [ -z "$port" ]; then
        echo ""
        return
    fi
    # 使用 lsof 或 netstat 查找占用端口的进程
    local pid=""
    if command -v lsof &> /dev/null; then
        pid=$(lsof -ti:$port 2>/dev/null | head -n1 || echo "")
    elif command -v netstat &> /dev/null; then
        pid=$(netstat -tlnp 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d'/' -f1 | head -n1 || echo "")
    else
        # 备用方案：通过进程命令行参数查找
        pid=$(ps aux | grep "node.*server.js" | grep "PORT=$port" | grep -v grep | awk '{print $2}' | head -n1 || echo "")
    fi
    echo "$pid"
}

# 通过环境名查找进程（使用进程标记）
get_pid_by_env() {
    local env_file="$PROJECT_ROOT/env.$ENV"
    if [ ! -f "$env_file" ]; then
        echo ""
        return
    fi
    # 查找包含环境标记的进程（使用进程名和环境变量）
    local port=$(get_env_port)
    local pid=$(get_pid_by_port "$port")
    
    # 验证进程是否真的是该环境的进程（检查进程环境变量）
    if [ ! -z "$pid" ]; then
        # 检查进程是否包含我们的项目路径
        local cmdline=$(ps -p "$pid" -o cmd= 2>/dev/null || echo "")
        if echo "$cmdline" | grep -q "backend/server.js"; then
            # 进一步验证：检查进程的环境变量（如果可能）
            # 优先通过环境变量识别，否则通过端口和命令路径
            local env_pid=""
            # 尝试通过进程的环境变量查找（需要 proc 文件系统支持）
            if [ -d "/proc/$pid" ] && [ -f "/proc/$pid/environ" ]; then
                if grep -q "LCTMR_ENV=$ENV" "/proc/$pid/environ" 2>/dev/null || \
                   grep -q "NODE_APP_INSTANCE=$ENV" "/proc/$pid/environ" 2>/dev/null; then
                    env_pid="$pid"
                fi
            fi
            
            # 如果通过环境变量找到了，直接返回
            if [ ! -z "$env_pid" ]; then
                echo "$env_pid"
                return
            fi
            
            # 否则通过端口和命令路径判断（兼容性方案）
            echo "$pid"
            return
        fi
    fi
    echo ""
}

# 检查环境变量文件
check_env_file() {
    local env_file="$PROJECT_ROOT/env.$ENV"
    if [ ! -f "$env_file" ]; then
        log_error "环境配置文件不存在: $env_file"
        exit 1
    fi
    log_success "找到环境配置文件: $env_file"
}

# 加载环境变量到临时文件（用于启动进程）
load_env_to_file() {
    local env_file="$PROJECT_ROOT/env.$ENV"
    local temp_env="$PROJECT_ROOT/.env.$ENV.tmp"
    cp "$env_file" "$temp_env"
    echo "$temp_env"
}

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装"
        exit 1
    fi
    
    if [ ! -d "$PROJECT_ROOT/backend/node_modules" ]; then
        log_warning "后端依赖未安装，正在安装..."
        cd "$PROJECT_ROOT/backend"
        npm install
        cd "$PROJECT_ROOT"
    fi
    
    log_success "依赖检查完成"
}

# 启动服务
start_service() {
    # 显示环境标识
    local env_label=""
    local env_color="${YELLOW}"
    if [ "$ENV" = "production" ]; then
        env_label="[生产环境]"
        env_color="${GREEN}"
    else
        env_label="[测试环境]"
        env_color="${YELLOW}"
    fi
    
    echo ""
    echo -e "${env_color}═══════════════════════════════════════${NC}"
    echo -e "${env_color}${env_label} 启动服务${NC}"
    echo -e "${env_color}═══════════════════════════════════════${NC}"
    echo ""
    
    # 检查是否已经运行
    local existing_pid=$(get_pid_by_env)
    if [ ! -z "$existing_pid" ]; then
        log_warning "$ENV 环境已在运行 (PID: $existing_pid)"
        log_info "使用 '$0 $ENV restart' 来重启服务"
        return 0
    fi
    
    # 加载环境配置
    local temp_env=$(load_env_to_file)
    local port=$(get_env_port)
    
    # 检查端口是否被占用
    local port_pid=$(get_pid_by_port "$port")
    if [ ! -z "$port_pid" ]; then
        log_error "端口 $port 已被占用 (PID: $port_pid)"
        rm -f "$temp_env"
        exit 1
    fi
    
    # 启动服务（使用环境变量文件）
    log_info "使用端口: $port"
    cd "$PROJECT_ROOT/backend"
    
    # 创建环境变量临时文件供进程使用（兼容 dotenv）
    local runtime_env="$PROJECT_ROOT/.env.$ENV.runtime"
    cp "$temp_env" "$runtime_env"
    
    # 创建启动脚本，安全地加载环境变量并添加环境标识
    local start_script="$PROJECT_ROOT/.start-$ENV.sh"
    cat > "$start_script" << EOF
#!/bin/bash
cd "$PROJECT_ROOT/backend"
# 加载环境变量（从临时文件读取，然后删除）
set -a
source "$temp_env"
set +a
export DOTENV_PATH="$runtime_env"
# 添加环境标识，便于进程识别
export NODE_APP_INSTANCE="$ENV"
export LCTMR_ENV="$ENV"
# 启动服务
exec node server.js
EOF
    chmod +x "$start_script"
    
    # 使用启动脚本启动服务
    log_info "启动命令: bash $start_script"
    nohup bash "$start_script" > "../logs/backend-$ENV.log" 2>&1 &
    local new_pid=$!
    
    # 等待一下让进程读取环境变量，然后清理临时文件
    sleep 1
    rm -f "$temp_env" "$start_script"
    
    log_info "等待服务启动... (PID: $new_pid)"
    sleep 3
    
    # 验证服务是否启动成功
    if ps -p $new_pid > /dev/null; then
        # 获取实际运行的进程信息
        local cmdline=$(ps -p $new_pid -o cmd= 2>/dev/null || echo "")
        log_success "[$ENV] 环境服务已启动"
        echo "  PID: $new_pid"
        echo "  端口: $port"
        echo "  进程: ${cmdline:0:80}..."
        log_info "日志文件: $PROJECT_ROOT/logs/backend-$ENV.log"
        
        # 增强健康检查（最多重试3次）
        log_info "执行健康检查..."
        local health_ok=false
        for i in {1..3}; do
            sleep 2
            if curl -f -s "http://localhost:$port/health" > /dev/null 2>&1; then
                health_ok=true
                break
            else
                log_warning "健康检查失败 (尝试 $i/3)，继续等待..."
            fi
        done
        
        if [ "$health_ok" = true ]; then
            log_success "健康检查通过: http://localhost:$port/health"
            # 显示健康检查详情
            local health_response=$(curl -s "http://localhost:$port/health" 2>/dev/null || echo "")
            if [ ! -z "$health_response" ]; then
                echo "  健康状态: $health_response" | head -n 1
            fi
        else
            log_error "健康检查失败，请检查日志: $PROJECT_ROOT/logs/backend-$ENV.log"
            log_warning "服务可能仍在启动中，或配置存在问题"
            log_info "查看最新日志: tail -f $PROJECT_ROOT/logs/backend-$ENV.log"
        fi
    else
        log_error "服务启动失败，进程已退出"
        log_error "请检查日志: $PROJECT_ROOT/logs/backend-$ENV.log"
        if [ -f "$PROJECT_ROOT/logs/backend-$ENV.log" ]; then
            log_info "最后 20 行日志:"
            tail -n 20 "$PROJECT_ROOT/logs/backend-$ENV.log" | sed 's/^/  /'
        fi
        exit 1
    fi
    
    cd "$PROJECT_ROOT"
}

# 停止服务
stop_service() {
    log_info "停止 $ENV 环境服务..."
    
    local pid=$(get_pid_by_env)
    if [ -z "$pid" ]; then
        log_warning "$ENV 环境未运行"
        return 0
    fi
    
    log_info "找到 $ENV 环境进程 (PID: $pid)"
    kill "$pid" 2>/dev/null || true
    sleep 2
    
    # 验证是否已停止
    if ps -p "$pid" > /dev/null 2>&1; then
        log_warning "进程仍在运行，强制停止..."
        kill -9 "$pid" 2>/dev/null || true
        sleep 1
    fi
    
    if ! ps -p "$pid" > /dev/null 2>&1; then
        log_success "$ENV 环境服务已停止"
    else
        log_error "停止服务失败"
        exit 1
    fi
}

# 重启服务
restart_service() {
    log_info "重启 $ENV 环境服务..."
    stop_service
    sleep 2
    start_service
}

# 健康检查
health_check() {
    local port=$(get_env_port)
    log_info "执行健康检查 (端口: $port)..."
    
    sleep 1
    local health_url="http://localhost:$port/health"
    
    if curl -f -s "$health_url" > /dev/null 2>&1; then
        log_success "健康检查通过: $health_url"
        return 0
    else
        log_warning "健康检查失败: $health_url"
        return 1
    fi
}

# 部署（启动或重启）
deploy() {
    log_info "部署到 $ENV 环境..."
    
    check_env_file
    check_dependencies
    
    local pid=$(get_pid_by_env)
    if [ ! -z "$pid" ]; then
        log_info "$ENV 环境已在运行，执行重启..."
        restart_service
    else
        log_info "$ENV 环境未运行，启动服务..."
        start_service
    fi
}

# 显示状态
show_status() {
    echo ""
    log_info "=== 环境状态总览 ==="
    echo ""
    
    # 显示所有环境状态
    for env in development production; do
        local env_file="$PROJECT_ROOT/env.$env"
        if [ ! -f "$env_file" ]; then
            continue
        fi
        
        local temp_env="$PROJECT_ROOT/env.$env"
        local port=$(grep ^PORT "$temp_env" | cut -d'=' -f2 | tr -d ' ' || echo "未设置")
        local node_env=$(grep NODE_ENV "$temp_env" | cut -d'=' -f2 | tr -d ' ' || echo "")
        local api_url=$(grep ^API_URL "$temp_env" | cut -d'=' -f2 | tr -d ' ' || echo "未设置")
        
        # 环境标签颜色
        local env_color="${YELLOW}"
        local env_label="[测试]"
        if [ "$env" = "production" ]; then
            env_color="${GREEN}"
            env_label="[生产]"
        fi
        
        echo -e "${env_color}${env_label} ${env} 环境${NC}"
        echo "  配置文件: env.$env"
        echo "  监听端口: $port"
        echo "  NODE_ENV: $node_env"
        if [ "$api_url" != "未设置" ]; then
            echo "  API地址: $api_url"
        fi
        
        # 检查运行状态
        local saved_env=$ENV
        ENV=$env
        local pid=$(get_pid_by_env)
        ENV=$saved_env
        
        if [ ! -z "$pid" ]; then
            # 获取进程启动时间和运行时长
            local uptime_info=""
            if ps -p "$pid" -o etime= &> /dev/null; then
                uptime_info=$(ps -p "$pid" -o etime= 2>/dev/null | tr -d ' ')
            fi
            
            echo -e "  运行状态: ${GREEN}运行中${NC} (PID: $pid)"
            if [ ! -z "$uptime_info" ]; then
                echo "  运行时长: $uptime_info"
            fi
            
            # 检查健康状态
            echo -n "  健康检查: "
            if curl -f -s "http://localhost:$port/health" > /dev/null 2>&1; then
                echo -e "${GREEN}正常${NC}"
            else
                echo -e "${YELLOW}异常${NC}"
                echo "  提示: 服务可能正在启动或遇到问题"
            fi
            
            # 显示访问地址
            echo "  本地访问: http://localhost:$port"
            if [ "$env" = "production" ]; then
                echo "  生产地址: http://process.xjio.cn (通过Nginx代理)"
            fi
        else
            echo -e "  运行状态: ${RED}未运行${NC}"
            echo "  启动命令: $0 $env start"
        fi
        echo ""
    done
    
    echo -e "${BLUE}💡 提示:${NC}"
    echo "  - 使用 '$0 [environment] status' 查看详细状态"
    echo "  - 使用 '$0 [environment] restart' 重启服务"
    echo "  - 查看日志: tail -f logs/backend-[environment].log"
    echo ""
}

# 显示帮助信息
show_help() {
    echo "使用方法: $0 [environment] [action]"
    echo ""
    echo "环境:"
    echo "  development  - 开发环境（端口 3002，测试使用）"
    echo "  production   - 生产环境（端口 3001，正式环境）"
    echo ""
    echo "操作:"
    echo "  start        - 启动指定环境（不影响另一个环境）"
    echo "  stop         - 停止指定环境"
    echo "  restart      - 重启指定环境"
    echo "  deploy       - 部署（如果运行则重启，否则启动）"
    echo "  status       - 查看所有环境状态（默认）"
    echo ""
    echo "示例:"
    echo "  $0 production start      # 启动生产环境"
    echo "  $0 development start     # 启动开发环境"
    echo "  $0 production restart     # 重启生产环境"
    echo "  $0 development stop      # 停止开发环境"
    echo "  $0 production deploy     # 部署到生产环境"
    echo "  $0 status                 # 查看所有环境状态"
    echo ""
    echo "💡 提示:"
    echo "  - 开发和生产环境可以同时运行"
    echo "  - 每个环境使用独立的端口和日志文件"
    echo "  - 修改代码后需要重启对应环境才能生效"
    echo "  - 开发环境（端口 3002）建议仅内网访问"
}

# 创建必要的目录
mkdir -p "$PROJECT_ROOT/logs"

# 主逻辑
case "$ACTION" in
    start)
        check_env_file
        start_service
        ;;
    stop)
        check_env_file
        stop_service
        ;;
    restart)
        check_env_file
        restart_service
        ;;
    deploy)
        deploy
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        if [ "$ACTION" = "status" ] || [ -z "$ACTION" ]; then
            show_status
        else
            log_error "未知操作: $ACTION"
            echo ""
            show_help
            exit 1
        fi
        ;;
esac
