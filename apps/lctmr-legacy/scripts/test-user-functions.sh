#!/bin/bash
# ============================================================
# LCTMR 用户功能自动化测试脚本
# 使用 curl 直接调用 Supabase API 验证各项功能
# ============================================================

SUPABASE_URL="https://nwyvgeoeqkoupqwjsghk.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA4MzUsImV4cCI6MjA4MDUwNjgzNX0.Iz0v_ZzRoJEmYxq8fFaxjBXC5qMREZbncwbC8FS8OGw"

# 测试用户凭证
EMAIL="${1:-hkpking@example.com}"
PASSWORD="${2:-Lctmr@2025}"

echo "============================================================"
echo "🧪 LCTMR 用户功能自动化测试"
echo "============================================================"
echo "测试用户: $EMAIL"
echo ""

# 计数器
PASSED=0
FAILED=0

# 测试函数
test_result() {
    if [ "$1" == "true" ]; then
        echo "  ✅ $2"
        ((PASSED++))
    else
        echo "  ❌ $2: $3"
        ((FAILED++))
    fi
}

# ============================================================
# 1. 登录测试
# ============================================================
echo "【1】登录验证..."
LOGIN_RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/auth/v1/token?grant_type=password" \
  -H "apikey: ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"${EMAIL}\", \"password\": \"${PASSWORD}\"}")

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
USER_ID=$(echo "$LOGIN_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$ACCESS_TOKEN" ] && [ ${#ACCESS_TOKEN} -gt 50 ]; then
    test_result "true" "登录成功，获取到 access_token"
else
    test_result "false" "登录失败" "$LOGIN_RESPONSE"
    echo "❌ 无法继续测试，登录失败"
    exit 1
fi

echo "  📌 User ID: $USER_ID"
echo ""

# ============================================================
# 2. 用户 Profile 测试
# ============================================================
echo "【2】用户 Profile 验证..."
PROFILE_RESPONSE=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_profiles?id=eq.${USER_ID}&select=*" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

PROFILE_POINTS=$(echo "$PROFILE_RESPONSE" | grep -o '"points":[0-9]*' | cut -d':' -f2)
PROFILE_USERNAME=$(echo "$PROFILE_RESPONSE" | grep -o '"username":"[^"]*"' | cut -d'"' -f4)

if [ -n "$PROFILE_POINTS" ]; then
    test_result "true" "Profile 存在，积分: $PROFILE_POINTS"
else
    test_result "false" "Profile 不存在或查询失败" "$PROFILE_RESPONSE"
fi

if [ -n "$PROFILE_USERNAME" ]; then
    test_result "true" "用户名: $PROFILE_USERNAME"
fi
echo ""

# ============================================================
# 3. 学习地图数据测试
# ============================================================
echo "【3】学习地图数据验证..."

# 分类
CATEGORIES=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_categories?select=id,title,order_index&order=order_index" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
CAT_COUNT=$(echo "$CATEGORIES" | grep -o '"id"' | wc -l)
test_result "$([ $CAT_COUNT -gt 0 ] && echo true || echo false)" "分类数据 (lctmr_categories): ${CAT_COUNT} 条"

# 章节
CHAPTERS=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_chapters?select=id,title,order_index&order=order_index" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
CH_COUNT=$(echo "$CHAPTERS" | grep -o '"id"' | wc -l)
test_result "$([ $CH_COUNT -gt 0 ] && echo true || echo false)" "章节数据 (lctmr_chapters): ${CH_COUNT} 条"

# 小节
SECTIONS=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_sections?select=id,title,order_index&order=order_index" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
SEC_COUNT=$(echo "$SECTIONS" | grep -o '"id"' | wc -l)
test_result "$([ $SEC_COUNT -gt 0 ] && echo true || echo false)" "小节数据 (lctmr_sections): ${SEC_COUNT} 条"
echo ""

# ============================================================
# 4. 成就系统测试
# ============================================================
echo "【4】成就系统验证..."
ACHIEVEMENTS=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_achievements?select=id,name" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
ACH_COUNT=$(echo "$ACHIEVEMENTS" | grep -o '"id"' | wc -l)
test_result "$([ $ACH_COUNT -gt 0 ] && echo true || echo false)" "成就定义 (lctmr_achievements): ${ACH_COUNT} 条"

# 用户成就
USER_ACH=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_user_achievements?user_id=eq.${USER_ID}&select=*" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
USER_ACH_COUNT=$(echo "$USER_ACH" | grep -o '"id"' | wc -l)
echo "  📌 用户已获得成就: ${USER_ACH_COUNT} 个"
echo ""

# ============================================================
# 5. 用户进度测试
# ============================================================
echo "【5】用户学习进度验证..."
PROGRESS=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_user_progress?user_id=eq.${USER_ID}&select=*" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
PROGRESS_COUNT=$(echo "$PROGRESS" | grep -o '"id"' | wc -l)
echo "  📌 用户学习进度记录: ${PROGRESS_COUNT} 条"
echo ""

# ============================================================
# 6. 部门/派系数据测试
# ============================================================
echo "【6】部门数据验证..."
FACTIONS=$(curl -s "${SUPABASE_URL}/rest/v1/lctmr_factions?select=id,name,code" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
FAC_COUNT=$(echo "$FACTIONS" | grep -o '"id"' | wc -l)
test_result "$([ $FAC_COUNT -gt 0 ] && echo true || echo false)" "部门数据 (lctmr_factions): ${FAC_COUNT} 条"
echo ""

# ============================================================
# 测试总结
# ============================================================
echo "============================================================"
echo "📊 测试结果总结"
echo "============================================================"
echo "✅ 通过: $PASSED 项"
echo "❌ 失败: $FAILED 项"
echo ""
if [ $FAILED -eq 0 ]; then
    echo "🎉 所有测试通过！用户功能正常。"
else
    echo "⚠️ 存在 $FAILED 个测试失败，请检查相关功能。"
fi
echo "============================================================"
