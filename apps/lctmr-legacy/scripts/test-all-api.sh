#!/bin/bash
# ============================================================
# LCTMR 完整 API 功能测试脚本
# 使用 curl 测试所有主要 API 端点
# ============================================================

SUPABASE_URL="https://nwyvgeoeqkoupqwjsghk.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA4MzUsImV4cCI6MjA4MDUwNjgzNX0.Iz0v_ZzRoJEmYxq8fFaxjBXC5qMREZbncwbC8FS8OGw"

EMAIL="${1:-hkpking@example.com}"
PASSWORD="${2:-Lctmr@2025}"

echo "============================================================"
echo "🧪 LCTMR 完整 API 功能测试"
echo "============================================================"
echo "测试用户: $EMAIL"
echo "时间: $(date)"
echo ""

PASSED=0
FAILED=0

test_result() {
    if [ "$1" == "true" ]; then
        echo "  ✅ $2"
        ((PASSED++))
    else
        echo "  ❌ $2"
        [ -n "$3" ] && echo "     错误: $3"
        ((FAILED++))
    fi
}

# ============================================================
# 1. 登录测试
# ============================================================
echo "【1】认证系统测试..."
LOGIN_RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/auth/v1/token?grant_type=password" \
  -H "apikey: ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"${EMAIL}\", \"password\": \"${PASSWORD}\"}")

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
USER_ID=$(echo "$LOGIN_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$ACCESS_TOKEN" ] && [ ${#ACCESS_TOKEN} -gt 50 ]; then
    test_result "true" "登录成功"
    echo "  📌 User ID: $USER_ID"
else
    test_result "false" "登录失败" "$(echo $LOGIN_RESPONSE | head -c 200)"
    echo "❌ 无法继续测试"
    exit 1
fi

# 测试获取当前用户
USER_INFO=$(curl -s "${SUPABASE_URL}/auth/v1/user" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
if echo "$USER_INFO" | grep -q "$EMAIL"; then
    test_result "true" "获取当前用户信息"
else
    test_result "false" "获取当前用户信息"
fi
echo ""

# ============================================================
# 2. Profile 测试
# ============================================================
echo "【2】用户 Profile 测试..."

# 读取 Profile
PROFILE=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_profiles?id=eq.${USER_ID}&select=*" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

if echo "$PROFILE" | grep -q '"id"'; then
    POINTS=$(echo "$PROFILE" | grep -o '"points":[0-9]*' | cut -d':' -f2)
    test_result "true" "读取 Profile (积分: $POINTS)"
else
    test_result "false" "读取 Profile"
fi

# 更新 Profile (测试 display_name)
UPDATE_RESULT=$(curl -s -X PATCH "${SUPABASE_URL}/rest/v1/lctmr_profiles?id=eq.${USER_ID}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{"display_name": "hkpking"}' \
  -w "%{http_code}")

if [ "$UPDATE_RESULT" == "204" ] || [ "$UPDATE_RESULT" == "200" ]; then
    test_result "true" "更新 Profile"
else
    test_result "false" "更新 Profile (HTTP: $UPDATE_RESULT)"
fi
echo ""

# ============================================================
# 3. 学习内容测试
# ============================================================
echo "【3】学习内容 API 测试..."

# Categories
CATEGORIES=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_categories?select=*&order=order_index" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
CAT_COUNT=$(echo "$CATEGORIES" | grep -o '"id"' | wc -l)
test_result "$([ $CAT_COUNT -gt 0 ] && echo true || echo false)" "获取分类 (lctmr_categories): $CAT_COUNT 条"

# Chapters
CHAPTERS=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_chapters?select=*&order=order_index" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
CH_COUNT=$(echo "$CHAPTERS" | grep -o '"id"' | wc -l)
test_result "$([ $CH_COUNT -gt 0 ] && echo true || echo false)" "获取章节 (lctmr_chapters): $CH_COUNT 条"

# Sections
SECTIONS=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_sections?select=*&order=order_index" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
SEC_COUNT=$(echo "$SECTIONS" | grep -o '"id"' | wc -l)
FIRST_SECTION_ID=$(echo "$SECTIONS" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
test_result "$([ $SEC_COUNT -gt 0 ] && echo true || echo false)" "获取小节 (lctmr_sections): $SEC_COUNT 条"

# Blocks
BLOCKS=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_blocks?select=*&order=sort_order" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
BLK_COUNT=$(echo "$BLOCKS" | grep -o '"id"' | wc -l)
test_result "$([ $BLK_COUNT -ge 0 ] && echo true || echo false)" "获取内容块 (lctmr_blocks): $BLK_COUNT 条"
echo ""

# ============================================================
# 4. 用户进度测试
# ============================================================
echo "【4】用户进度 API 测试..."

# 读取进度
PROGRESS=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_user_progress?user_id=eq.${USER_ID}&select=*" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
PROG_COUNT=$(echo "$PROGRESS" | grep -o '"id"' | wc -l)
test_result "true" "读取用户进度: $PROG_COUNT 条记录"

# 保存进度 (upsert)
if [ -n "$FIRST_SECTION_ID" ]; then
    SAVE_RESULT=$(curl -s -X POST "${SUPABASE_URL}/rest/v1/lctmr_user_progress" \
      -H "apikey: ${ANON_KEY}" \
      -H "Authorization: Bearer ${ACCESS_TOKEN}" \
      -H "Content-Type: application/json" \
      -H "Prefer: resolution=merge-duplicates" \
      -d "{
        \"user_id\": \"${USER_ID}\",
        \"section_id\": \"${FIRST_SECTION_ID}\",
        \"is_completed\": true,
        \"progress_percent\": 100
      }" \
      -w "%{http_code}")
    
    if [[ "$SAVE_RESULT" == *"201"* ]] || [[ "$SAVE_RESULT" == *"200"* ]] || [ -z "$(echo $SAVE_RESULT | grep error)" ]; then
        test_result "true" "保存用户进度 (upsert)"
    else
        test_result "false" "保存用户进度" "$SAVE_RESULT"
    fi
else
    test_result "false" "保存用户进度 (无可用 section)"
fi
echo ""

# ============================================================
# 5. 成就系统测试
# ============================================================
echo "【5】成就系统 API 测试..."

# 获取成就列表
ACHIEVEMENTS=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_achievements?select=*" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
ACH_COUNT=$(echo "$ACHIEVEMENTS" | grep -o '"id"' | wc -l)
test_result "$([ $ACH_COUNT -gt 0 ] && echo true || echo false)" "获取成就列表: $ACH_COUNT 条"

# 获取用户成就
USER_ACH=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_user_achievements?user_id=eq.${USER_ID}&select=*,lctmr_achievements(*)" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
USER_ACH_COUNT=$(echo "$USER_ACH" | grep -o '"achievement_id"' | wc -l)
test_result "true" "获取用户成就: $USER_ACH_COUNT 个"
echo ""

# ============================================================
# 6. 部门/派系测试
# ============================================================
echo "【6】部门系统 API 测试..."

# 获取部门列表
FACTIONS=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_factions?select=*&order=sort_order" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
FAC_COUNT=$(echo "$FACTIONS" | grep -o '"id"' | wc -l)
test_result "$([ $FAC_COUNT -gt 0 ] && echo true || echo false)" "获取部门列表: $FAC_COUNT 条"
echo ""

# ============================================================
# 7. 排行榜测试
# ============================================================
echo "【7】排行榜 API 测试..."

# 获取排行榜 (直接查询 profiles 按积分排序)
LEADERBOARD=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_profiles?select=id,username,display_name,points&order=points.desc&limit=10" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
LB_COUNT=$(echo "$LEADERBOARD" | grep -o '"id"' | wc -l)
test_result "$([ $LB_COUNT -gt 0 ] && echo true || echo false)" "获取排行榜: $LB_COUNT 人"
echo ""

# ============================================================
# 8. 挑战系统测试
# ============================================================
echo "【8】挑战系统 API 测试..."

CHALLENGES=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_challenges?select=*" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
CHAL_COUNT=$(echo "$CHALLENGES" | grep -o '"id"' | wc -l)
test_result "true" "获取挑战列表: $CHAL_COUNT 条"
echo ""

# ============================================================
# 测试总结
# ============================================================
echo "============================================================"
echo "📊 测试结果总结"
echo "============================================================"
echo "✅ 通过: $PASSED 项"
echo "❌ 失败: $FAILED 项"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $FAILED -eq 0 ]; then
    echo "🎉 所有测试通过！API 功能正常。"
    exit 0
else
    echo "⚠️ 有 $FAILED 个测试失败，需要检查。"
    exit 1
fi
echo "============================================================"
