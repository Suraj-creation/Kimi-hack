# 🧪 CONVERSATIONAL AI - MANUAL TEST CHECKLIST

## Prerequisites
- ✅ Build completed successfully
- ✅ Dev server running (`npm run dev`)
- ✅ Chrome/Edge browser (for Web Speech API)
- ✅ Microphone permissions granted
- ✅ Gemini API key in .env file

---

## Test Suite 1: Wake Word Detection ✨

### Test 1.1: Basic Wake Word Activation
**Steps:**
1. Open app at `http://localhost:5174`
2. Wait 2 seconds for initialization
3. Look for toast: "🎤 'साथी' बोलकर मुझे बुलाएं"
4. Say clearly: **"साथी"** or **"Sathi"**

**Expected Result:**
- ✅ Toast shows: "साथी सुन रहा है! 🎤"
- ✅ AI assistant panel opens (right side)
- ✅ AI starts listening (mic icon active)

**Result:** [ ] PASS [ ] FAIL  
**Notes:** _________________________________

---

### Test 1.2: Wake Word on Different Pages
**Steps:**
1. Navigate to Dashboard → Say "साथी"
2. Navigate to Work page → Say "साथी"
3. Navigate to PM-KISAN → Say "साथी"
4. Navigate to Grievance → Say "साथी"

**Expected Result:**
- ✅ Wake word works on ALL pages
- ✅ AI opens every time
- ✅ Always listens in background

**Result:** [ ] PASS [ ] FAIL  
**Notes:** _________________________________

---

## Test Suite 2: Full Page Context Understanding 📄

### Test 2.1: Dashboard Explanation
**Steps:**
1. Go to `/dashboard`
2. Say "साथी"
3. Say: **"यह पेज क्या है?"**

**Expected Result:**
- ✅ AI explains: "यह आपका डैशबोर्ड है जी"
- ✅ Mentions: 46 days worked
- ✅ Mentions: ₹2400 pending
- ✅ Mentions: 3 available works
- ✅ Lists available actions

**Actual Response:** _________________________________

**Result:** [ ] PASS [ ] FAIL

---

### Test 2.2: PM-KISAN Page Understanding
**Steps:**
1. Navigate to `/schemes/pm-kisan`
2. Say "साथी"
3. Say: **"यह योजना क्या है?"**

**Expected Result:**
- ✅ Explains PM-KISAN scheme
- ✅ Mentions ₹6000 per year
- ✅ Explains three installments
- ✅ Tells eligibility
- ✅ Offers to help apply

**Actual Response:** _________________________________

**Result:** [ ] PASS [ ] FAIL

---

### Test 2.3: Work Page Content Reading
**Steps:**
1. Go to `/mgnrega/work`
2. Say "साथी"
3. Say: **"पेज पढ़ो"**

**Expected Result:**
- ✅ Reads all visible work opportunities
- ✅ Explains each work type
- ✅ Mentions wages
- ✅ Offers to apply

**Result:** [ ] PASS [ ] FAIL

---

## Test Suite 3: Conversational Flow & Context 💬

### Test 3.1: Multi-Turn Conversation
**Steps:**
1. Say "साथी"
2. Say: **"मैंने कितना काम किया?"**
3. Wait for response (should say "46 दिन")
4. Say: **"और कितना बाकी है?"**
5. AI should calculate: 100 - 46 = 54

**Expected Result:**
- ✅ First answer: "46 दिन"
- ✅ Second answer: "54 दिन बाकी हैं"
- ✅ AI remembers context
- ✅ Natural conversation flow

**Actual Conversation:**
_________________________________
_________________________________

**Result:** [ ] PASS [ ] FAIL

---

### Test 3.2: Context Memory Across Topics
**Steps:**
1. Say "साथी"
2. Say: **"मेरे तीन बच्चे हैं"**
3. AI should acknowledge
4. Later say: **"स्कूल की फीस चाहिए"**

**Expected Result:**
- ✅ AI references earlier mention: "तीन बच्चों की फीस"
- ✅ Shows empathy
- ✅ Offers to check payment status

**Actual Response:** _________________________________

**Result:** [ ] PASS [ ] FAIL

---

### Test 3.3: Page Context in Conversation
**Steps:**
1. On Dashboard, say "साथी"
2. Say: **"यहां क्या है?"**
3. AI explains dashboard
4. Navigate to Work page
5. Say "साथी"
6. Say: **"अब यहां क्या है?"**

**Expected Result:**
- ✅ Different response for each page
- ✅ Uses actual page content
- ✅ Mentions page-specific actions

**Result:** [ ] PASS [ ] FAIL

---

## Test Suite 4: Database Integration 🗄️

### Test 4.1: Personal Information Retrieval
**Steps:**
1. Say "साथी"
2. Say: **"मेरी जानकारी बताओ"**

**Expected Result:**
- ✅ Name: राम कुमार (from mock/real user)
- ✅ Village: रामपुर
- ✅ Days worked: 46
- ✅ Pending: ₹2400
- ✅ Job Card: Yes
- ✅ Category: BPL
- ✅ Skills: मिस्त्री

**Actual Response:** _________________________________

**Result:** [ ] PASS [ ] FAIL

---

### Test 4.2: Work History Query
**Steps:**
1. Say "साथी"
2. Say: **"मैंने इस साल कितना काम किया?"**
3. Say: **"कितने दिन बाकी हैं?"**

**Expected Result:**
- ✅ Response: "46 दिन काम किया है"
- ✅ Calculation: "54 दिन बाकी हैं"
- ✅ Uses real database numbers

**Result:** [ ] PASS [ ] FAIL

---

### Test 4.3: Payment Information
**Steps:**
1. Say "साथी"
2. Say: **"मेरा पैसा कितना बाकी है?"**
3. Say: **"कब आएगा?"**

**Expected Result:**
- ✅ Amount: ₹2400
- ✅ Estimated date provided
- ✅ Offers to file grievance if delayed

**Result:** [ ] PASS [ ] FAIL

---

## Test Suite 5: Empathetic Grievance Filing 😊

### Test 5.1: Complete Grievance Conversation
**Steps:**
1. Say "साथी"
2. Say: **"मेरा पैसा नहीं आया"**
3. AI asks: "किस काम का?"
4. Say: **"तालाब खुदाई का"**
5. AI asks: "कब किया था?"
6. Say: **"जनवरी 8 से 20 तक"**
7. AI summarizes and asks confirmation
8. Say: **"हां"**

**Expected Result:**
- ✅ AI shows empathy: "मुझे दुख है"
- ✅ Asks gentle questions
- ✅ Prepares grievance text
- ✅ Asks for confirmation
- ✅ Files grievance
- ✅ Navigates to grievance page
- ✅ Shows success message

**Conversation Flow:**
_________________________________
_________________________________
_________________________________

**Result:** [ ] PASS [ ] FAIL

---

### Test 5.2: Empathy Detection
**Steps:**
1. Say "साथी"
2. Say: **"घर में राशन नहीं है, बच्चे भूखे हैं"**

**Expected Result:**
- ✅ Emotional state: distressed/urgent
- ✅ Response shows deep empathy
- ✅ Uses phrases: "दुख", "समझता हूं", "मुश्किल"
- ✅ Offers immediate help
- ✅ Fast-tracks grievance

**Actual Response:** _________________________________

**Result:** [ ] PASS [ ] FAIL

---

## Test Suite 6: Navigation & Actions 🗺️

### Test 6.1: Voice Navigation
**Steps:**
1. Say "साथी"
2. Say each command and verify navigation:
   - **"काम देखना है"** → `/mgnrega/work`
   - **"पैसे की जानकारी"** → `/mgnrega/payments`
   - **"शिकायत करनी है"** → `/mgnrega/grievance`
   - **"योजनाएं दिखाओ"** → `/schemes`
   - **"डैशबोर्ड दिखाओ"** → `/dashboard`

**Expected Result:**
- ✅ All navigation commands work
- ✅ Smooth page transitions
- ✅ AI confirms navigation

**Result:** [ ] PASS [ ] FAIL

---

### Test 6.2: Scheme Navigation
**Steps:**
1. Say "साथी"
2. Try:
   - **"किसान योजना दिखाओ"** → PM-KISAN
   - **"पेंशन योजना"** → PM-SYM
   - **"विधवा पेंशन"** → Widow Pension

**Result:** [ ] PASS [ ] FAIL

---

## Test Suite 7: Always-Active Behavior 🔄

### Test 7.1: Background Listening
**Steps:**
1. Open app
2. Do NOT click AI button
3. Wait 5 seconds
4. Say "साथी"
5. Check console logs

**Expected Result:**
- ✅ Console shows: "🎤 Wake word detection ACTIVE"
- ✅ AI activates without clicking
- ✅ Continuous listening works

**Result:** [ ] PASS [ ] FAIL

---

### Test 7.2: Auto-Restart After Conversation
**Steps:**
1. Say "साथी" → AI opens
2. Have conversation
3. Close AI assistant
4. Wait 10 seconds
5. Say "साथी" again

**Expected Result:**
- ✅ Wake word still works after closing
- ✅ Auto-restarts listening
- ✅ No manual restart needed

**Result:** [ ] PASS [ ] FAIL

---

## Test Suite 8: Cross-Page Conversation 🔀

### Test 8.1: Conversation Continues Across Pages
**Steps:**
1. On Dashboard, say "साथी"
2. Say: **"काम देखना है"**
3. AI navigates to Work page
4. Immediately say: **"कौन सा काम अच्छा है?"**
   (WITHOUT saying "साथी" again)

**Expected Result:**
- ✅ AI responds without wake word
- ✅ Conversation continues
- ✅ Context maintained

**Result:** [ ] PASS [ ] FAIL

---

## Test Suite 9: Data Extraction 📊

### Test 9.1: Natural Information Sharing
**Steps:**
1. Say "साथी"
2. Say: **"मेरे तीन बच्चे हैं और 2 एकड़ जमीन है"**

**Expected Result:**
- ✅ AI acknowledges information
- ✅ Asks for confirmation: "क्या मैं यह सेव करूं?"
- ✅ Extracts: numberOfChildren = 3
- ✅ Extracts: landArea = 2

**Result:** [ ] PASS [ ] FAIL

---

## Performance Tests ⚡

### Load Time
- [ ] Wake word detection starts within 2 seconds
- [ ] AI response time < 3 seconds
- [ ] Page navigation < 1 second

### Voice Recognition
- [ ] Understands Hindi clearly
- [ ] Handles background noise
- [ ] Works with different accents

---

## Bug Tracker 🐛

| Test | Issue | Severity | Status |
|------|-------|----------|--------|
|      |       |          |        |
|      |       |          |        |

---

## Overall Assessment

**Total Tests:** 30  
**Passed:** ___  
**Failed:** ___  
**Pass Rate:** ___%

**Critical Issues:**
_________________________________
_________________________________

**Recommendations:**
_________________________________
_________________________________

**Tester:** ________________  
**Date:** ________________  
**Browser:** ________________  
**Device:** ________________
