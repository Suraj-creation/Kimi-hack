# 🧪 CONVERSATIONAL AI - TESTING GUIDE

## Overview
Comprehensive test suite to verify the fully functional conversational AI system with wake word detection, full page context understanding, and database integration.

---

## 📦 Setup Testing Environment

### 1. Install Testing Dependencies
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @vitest/ui jsdom
```

### 2. Verify Files Created
- ✅ `tests/conversational-ai.test.ts` - Automated test suite
- ✅ `tests/manual-test-checklist.md` - Manual testing checklist
- ✅ `tests/setup.ts` - Test configuration
- ✅ `vitest.config.ts` - Vitest configuration

---

## 🤖 Automated Tests

### Run All Tests
```bash
npm run test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test Suite
```bash
# Wake word detection only
npm run test -- --grep "Wake Word Detection"

# Page context tests only
npm run test -- --grep "Page Context"

# Conversation flow tests only
npm run test -- --grep "Conversational Flow"
```

### Test Categories

#### 1. **Wake Word Detection Tests** (4 tests)
- ✓ Activates on "साथी" (Sathi)
- ✓ Detects variations (साथी, sathi, sahayog)
- ✓ Continuous background listening
- ✓ Auto-restart after pause

#### 2. **Page Context Understanding Tests** (3 tests)
- ✓ Extracts full Dashboard content
- ✓ Understands PM-KISAN scheme page
- ✓ Works on all 15+ pages

#### 3. **Conversational Flow Tests** (4 tests)
- ✓ Maintains context across messages
- ✓ Uses actual database information
- ✓ Shows empathy in grievances
- ✓ Remembers previous conversation points

#### 4. **Action Execution Tests** (3 tests)
- ✓ Navigates on voice command
- ✓ Files grievance on behalf
- ✓ Extracts data from conversation

#### 5. **Multi-Page Conversation Tests** (2 tests)
- ✓ Maintains conversation across navigation
- ✓ Explains different pages correctly

#### 6. **Empathy Tests** (3 tests)
- ✓ Detects distress and responds empathetically
- ✓ Uses validation phrases
- ✓ Offers follow-up support

#### 7. **Database Integration Tests** (2 tests)
- ✓ Uses real user data in context
- ✓ Suggests relevant schemes based on profile

**Total: 21 automated tests**

---

## 👤 Manual Testing

### Quick Manual Test (5 minutes)
```bash
# 1. Start dev server
npm run dev

# 2. Open browser
# Navigate to: http://localhost:5174

# 3. Test wake word
# Say clearly: "साथी"
# Expected: AI opens and starts listening

# 4. Test conversation
# Say: "मेरी जानकारी बताओ"
# Expected: AI provides your profile data

# 5. Test grievance
# Say: "मेरा पैसा नहीं आया"
# Expected: Empathetic response with follow-up questions
```

### Complete Manual Test (30 minutes)
Follow the detailed checklist in:
```
tests/manual-test-checklist.md
```

This includes:
- ✓ 9 test suites
- ✓ 30+ individual tests
- ✓ Performance benchmarks
- ✓ Cross-browser testing
- ✓ Bug tracking template

---

## 🎯 Test Execution Priority

### Critical Tests (Must Pass)
1. ✅ Wake word "साथी" activates AI
2. ✅ AI uses actual database information
3. ✅ Full page content is extracted
4. ✅ Conversation context is maintained
5. ✅ Grievance filing works with empathy

### Important Tests
6. ✅ Navigation commands work
7. ✅ Data extraction from conversation
8. ✅ Multi-page conversation flow
9. ✅ Empathy patterns present

### Nice-to-Have Tests
10. ✅ Performance benchmarks met
11. ✅ Cross-browser compatibility
12. ✅ Accessibility features

---

## 📊 Expected Test Results

### Automated Tests
```
✓ Wake Word Detection Tests (4/4 passed)
✓ Page Context Understanding Tests (3/3 passed)
✓ Conversational Flow Tests (4/4 passed)
✓ Action Execution Tests (3/3 passed)
✓ Multi-Page Conversation Tests (2/2 passed)
✓ Empathy Tests (3/3 passed)
✓ Database Integration Tests (2/2 passed)

Total: 21 tests passed
Time: ~2-3 seconds
```

### Manual Tests
- **Wake Word Detection**: Should work in < 2 seconds
- **AI Response Time**: Should respond in < 3 seconds
- **Page Context**: Should extract all visible content
- **Database Queries**: Should return accurate user data
- **Empathy**: Should use validation phrases in every distress scenario

---

## 🔍 What We're Testing

### 1. **Wake Word Always Active**
- ✅ Starts automatically on app load
- ✅ Listens continuously in background
- ✅ Works on ALL pages
- ✅ Shows user notification
- ✅ Auto-restarts after conversation

### 2. **Full Page Understanding**
- ✅ Extracts all text, headings, cards, buttons
- ✅ Understands page purpose
- ✅ Explains in simple Hindi
- ✅ Lists available actions
- ✅ Updates on route change

### 3. **Deep Conversational Context**
- ✅ Remembers earlier messages
- ✅ Makes connections between topics
- ✅ References previous information
- ✅ Maintains context across pages
- ✅ Natural conversation flow

### 4. **Database Integration**
- ✅ Uses real user profile data
- ✅ Queries MGNREGA work history
- ✅ Retrieves payment information
- ✅ Accesses skill information
- ✅ Suggests relevant schemes

### 5. **Empathetic Responses**
- ✅ Detects emotional state (distressed, urgent, neutral)
- ✅ Uses validation phrases
- ✅ Shows genuine care
- ✅ Offers supportive language
- ✅ Gentle follow-up questions

### 6. **Action Execution**
- ✅ Navigates to any page by voice
- ✅ Files grievances with confirmation
- ✅ Extracts data from natural speech
- ✅ Fills forms on behalf
- ✅ Provides immediate help

---

## 🐛 Known Issues & Workarounds

### Issue 1: Wake Word Not Working
**Symptoms:** "साथी" doesn't activate AI
**Check:**
- Microphone permissions granted?
- Using Chrome/Edge (not Firefox)?
- Console shows: "Wake word detection ACTIVE"?
**Fix:** Refresh page, check browser console

### Issue 2: No Response from AI
**Symptoms:** AI listens but doesn't respond
**Check:**
- Gemini API key in .env?
- Network connection working?
- Console shows API errors?
**Fix:** Verify VITE_GEMINI_API_KEY is set

### Issue 3: Page Content Not Extracted
**Symptoms:** AI doesn't mention page content
**Check:**
- Route change detected?
- DOM elements rendered?
- Console shows extracted content?
**Fix:** Wait 500ms after navigation

---

## 📈 Success Criteria

### Minimum Viable Tests (MVP)
- [ ] Wake word activates AI (100% success rate)
- [ ] AI uses database information in responses
- [ ] Full page content extracted and understood
- [ ] Conversation maintains context

### Full Feature Tests
- [ ] All 21 automated tests pass
- [ ] Manual checklist 90%+ pass rate
- [ ] Response time < 3 seconds
- [ ] Empathy present in all distress scenarios
- [ ] Navigation works for all pages

### Production Ready
- [ ] Cross-browser tested (Chrome, Edge, Safari)
- [ ] Mobile responsive
- [ ] Handles poor network conditions
- [ ] Error recovery works
- [ ] Privacy protections verified

---

## 🚀 Running the Tests

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Add your Gemini API key

# 3. Run automated tests
npm run test

# 4. Start dev server for manual testing
npm run dev

# 5. Open manual test checklist
# Follow tests/manual-test-checklist.md
```

### Continuous Integration
```bash
# Run in CI pipeline
npm run test:ci

# Generates:
# - coverage reports
# - test results JSON
# - screenshots of failures
```

---

## 📝 Test Reporting

### After Running Tests

1. **Automated Test Results**
   - Check terminal output
   - View coverage report: `coverage/index.html`
   - Review failed tests

2. **Manual Test Results**
   - Fill out `tests/manual-test-checklist.md`
   - Document bugs in Bug Tracker section
   - Calculate pass rate

3. **Submit Report**
   - Overall pass rate
   - Critical issues found
   - Recommendations
   - Video recording (if applicable)

---

## 🎥 Test Recording

### For Demo/Documentation
```bash
# Record screen while testing
# 1. Say "साथी" → AI opens
# 2. Ask: "मेरी जानकारी बताओ"
# 3. Show: AI uses real database data
# 4. Ask: "मेरा पैसा नहीं आया"
# 5. Show: Empathetic grievance filing
# 6. Navigate: "काम देखना है"
# 7. Show: Conversation continues on new page
```

---

## ✅ Verification Checklist

Before marking as "FULLY WORKING":

- [ ] Wake word detection is ALWAYS active (background listening)
- [ ] Responds to "साथी" on ALL pages
- [ ] Extracts and understands FULL page content
- [ ] Maintains deep conversation context
- [ ] Uses ACTUAL database information (not mock)
- [ ] Empathetic responses in grievance scenarios
- [ ] Navigation by voice commands works
- [ ] Data extraction with confirmation works
- [ ] Conversation flows naturally (not robotic)
- [ ] Performance: Response time < 3 seconds

---

## 📞 Support

If tests fail or you need help:
1. Check console for errors
2. Verify .env file has correct API key
3. Review test logs
4. Check browser compatibility
5. Verify microphone permissions

---

**Last Updated:** January 31, 2026  
**Test Version:** 1.0.0  
**AI System:** Fully Conversational with Wake Word Detection
