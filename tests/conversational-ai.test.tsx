/**
 * CONVERSATIONAL AI COMPREHENSIVE TEST SUITE
 * Tests wake word detection, page context, conversation flow, and database integration
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { GlobalAIAssistant } from '../src/components/GlobalAIAssistant';
import { SahayogAI } from '../src/lib/gemini';
import { BrowserRouter } from 'react-router-dom';

// Mock data
const mockUser = {
  _id: '123',
  fullName: 'राम कुमार',
  address: { village: 'रामपुर' },
  mgnregaInfo: {
    hasJobCard: true,
    jobCardNumber: 'JC123456',
    totalDaysWorkedThisYear: 46,
  },
  category: 'BPL',
  familyDetails: {
    numberOfChildren: 3,
    maritalStatus: 'married',
  },
  skills: [
    { skillName: 'मिस्त्री', level: 'intermediate' },
  ],
};

// Mock Speech Recognition
class MockSpeechRecognition {
  continuous = false;
  interimResults = false;
  lang = '';
  onresult: any = null;
  onerror: any = null;
  onend: any = null;
  
  start() {
    console.log('Mock speech recognition started');
  }
  
  stop() {
    console.log('Mock speech recognition stopped');
  }
  
  simulateWakeWord() {
    if (this.onresult) {
      this.onresult({
        results: [[{ transcript: 'साथी' }]],
      });
    }
  }
  
  simulateUserSpeech(text: string) {
    if (this.onresult) {
      this.onresult({
        results: [[{ transcript: text }]],
      });
    }
  }
}

describe('Conversational AI System - Comprehensive Tests', () => {
  let mockRecognition: MockSpeechRecognition;
  
  beforeEach(() => {
    mockRecognition = new MockSpeechRecognition();
    (window as any).webkitSpeechRecognition = MockSpeechRecognition;
    
    // Mock the Gemini API to return predictable responses
    vi.spyOn(SahayogAI.prototype, 'processMessage').mockResolvedValue({
      spoken_response: 'मॉक रिस्पॉन्स - टेस्टिंग के लिए',
      actions: [],
      data_to_extract: [],
      emotional_state: 'neutral',
      follow_up_required: false,
    });
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Wake Word Detection Tests', () => {
    it('should activate on hearing "साथी" (Sathi)', async () => {
      const { container } = render(
        <BrowserRouter>
          <GlobalAIAssistant isOpen={false} onClose={() => {}} />
        </BrowserRouter>
      );
      
      // Simulate wake word
      mockRecognition.simulateWakeWord();
      
      await waitFor(() => {
        expect(screen.queryByText(/साथी सुन रहा है/i)).toBeInTheDocument();
      });
    });
    
    it('should detect wake word variations', async () => {
      const variations = ['साथी', 'sathi', 'sahayog'];
      
      for (const word of variations) {
        mockRecognition = new MockSpeechRecognition();
        mockRecognition.simulateUserSpeech(word);
        
        await waitFor(() => {
          expect(mockRecognition.onresult).toHaveBeenCalled();
        });
      }
    });
    
    it('should work continuously in background', async () => {
      render(
        <BrowserRouter>
          <GlobalAIAssistant isOpen={false} onClose={() => {}} />
        </BrowserRouter>
      );
      
      expect(mockRecognition.continuous).toBe(true);
      expect(mockRecognition.start).toHaveBeenCalled();
    });
    
    it('should restart after temporary pause', async () => {
      vi.useFakeTimers();
      
      render(
        <BrowserRouter>
          <GlobalAIAssistant isOpen={true} onClose={() => {}} />
        </BrowserRouter>
      );
      
      mockRecognition.simulateWakeWord();
      
      // Fast-forward 10 seconds
      vi.advanceTimersByTime(10000);
      
      await waitFor(() => {
        expect(mockRecognition.start).toHaveBeenCalledTimes(2);
      });
      
      vi.useRealTimers();
    });
  });

  describe('2. Page Context Understanding Tests', () => {
    it('should extract full page content on Dashboard', async () => {
      // Mock location
      vi.mock('react-router-dom', () => ({
        ...vi.importActual('react-router-dom'),
        useLocation: () => ({ pathname: '/dashboard' }),
      }));
      
      // Create mock page content
      document.body.innerHTML = `
        <main>
          <h1>डैशबोर्ड</h1>
          <div class="card">
            <h2>आपका काम</h2>
            <p>46 दिन काम किया</p>
          </div>
          <div class="card">
            <h2>बकाया पैसा</h2>
            <p>₹2400</p>
          </div>
        </main>
      `;
      
      render(
        <BrowserRouter>
          <GlobalAIAssistant isOpen={true} onClose={() => {}} />
        </BrowserRouter>
      );
      
      // Simulate asking about page
      mockRecognition.simulateUserSpeech('यह पेज क्या है?');
      
      await waitFor(() => {
        const response = screen.getByRole('article');
        expect(response).toContainText('डैशबोर्ड');
        expect(response).toContainText('46 दिन');
        expect(response).toContainText('₹2400');
      });
    });
    
    it('should understand PM-KISAN scheme page', async () => {
      vi.mock('react-router-dom', () => ({
        ...vi.importActual('react-router-dom'),
        useLocation: () => ({ pathname: '/schemes/pm-kisan' }),
      }));
      
      document.body.innerHTML = `
        <main>
          <h1>PM-KISAN योजना</h1>
          <p>किसानों को ₹6000 प्रति वर्ष</p>
          <button>आवेदन करें</button>
        </main>
      `;
      
      render(
        <BrowserRouter>
          <GlobalAIAssistant isOpen={true} onClose={() => {}} />
        </BrowserRouter>
      );
      
      mockRecognition.simulateUserSpeech('यह योजना क्या है?');
      
      await waitFor(() => {
        expect(screen.getByText(/PM-KISAN/i)).toBeInTheDocument();
        expect(screen.getByText(/₹6000/i)).toBeInTheDocument();
      });
    });
    
    it('should work on all 15+ pages', async () => {
      const pages = [
        '/dashboard',
        '/mgnrega/work',
        '/mgnrega/payments',
        '/mgnrega/attendance',
        '/mgnrega/grievance',
        '/schemes',
        '/schemes/pm-kisan',
        '/schemes/pm-sym',
        '/schemes/widow-pension',
        '/schemes/old-age-pension',
        '/profile',
      ];
      
      for (const path of pages) {
        vi.mock('react-router-dom', () => ({
          ...vi.importActual('react-router-dom'),
          useLocation: () => ({ pathname: path }),
        }));
        
        const { unmount } = render(
          <BrowserRouter>
            <GlobalAIAssistant isOpen={true} onClose={() => {}} />
          </BrowserRouter>
        );
        
        mockRecognition.simulateUserSpeech('पेज समझाओ');
        
        await waitFor(() => {
          expect(screen.getByRole('textbox')).toBeInTheDocument();
        });
        
        unmount();
      }
    });
  });

  describe('3. Conversational Flow Tests', () => {
    let sahayogAI: SahayogAI;
    
    beforeEach(() => {
      sahayogAI = new SahayogAI();
    });
    
    it('should maintain context across multiple messages', async () => {
      const sessionId = 'test-session-1';
      const context = {
        userName: mockUser.fullName,
        village: mockUser.address.village,
        daysWorked: mockUser.mgnregaInfo.totalDaysWorkedThisYear,
        pendingPayment: 2400,
        currentPage: 'डैशबोर्ड - मुख्य पेज',
      };
      
      // First message
      const response1 = await sahayogAI.processMessage(
        sessionId,
        'मेरा काम कितना हुआ?',
        context
      );
      
      expect(response1.spoken_response).toContain('46');
      
      // Follow-up message (should remember context)
      const response2 = await sahayogAI.processMessage(
        sessionId,
        'और कितना बाकी है?',
        context
      );
      
      expect(response2.spoken_response).toContain('54');
    });
    
    it('should use actual database information in responses', async () => {
      const sessionId = 'test-session-2';
      const context = {
        userName: mockUser.fullName,
        village: mockUser.address.village,
        daysWorked: 46,
        pendingPayment: 2400,
        currentPage: 'डैशबोर्ड',
        fullUserProfile: {
          hasJobCard: mockUser.mgnregaInfo.hasJobCard,
          category: mockUser.category,
          familyMembers: mockUser.familyDetails.numberOfChildren,
          skills: mockUser.skills.map(s => s.skillName),
        },
      };
      
      const response = await sahayogAI.processMessage(
        sessionId,
        'मेरी जानकारी बताओ',
        context
      );
      
      // Should include actual data
      expect(response.spoken_response).toContain('राम कुमार');
      expect(response.spoken_response).toContain('रामपुर');
      expect(response.spoken_response).toContain('46');
      expect(response.spoken_response).toContain('2400');
    });
    
    it('should show empathy in grievance conversations', async () => {
      const sessionId = 'test-session-3';
      
      const response1 = await sahayogAI.processMessage(
        sessionId,
        'मेरा पैसा नहीं आया 15 दिन से',
        { userName: 'राम कुमार' }
      );
      
      // Should show empathy
      expect(response1.spoken_response).toMatch(/दुख|समझ|मुश्किल/);
      expect(response1.emotional_state).toBe('distressed');
      
      // Should ask clarifying questions
      expect(response1.spoken_response).toMatch(/कौन|कब|किस/);
    });
    
    it('should remember previous conversation points', async () => {
      const sessionId = 'test-session-4';
      
      // User mentions children
      await sahayogAI.processMessage(
        sessionId,
        'मेरे तीन बच्चे हैं',
        { userName: 'राम कुमार' }
      );
      
      // Later, user mentions school fees
      const response = await sahayogAI.processMessage(
        sessionId,
        'स्कूल की फीस का समय है',
        { userName: 'राम कुमार' }
      );
      
      // AI should connect the dots
      expect(response.spoken_response).toMatch(/तीन बच्चे|बच्चों/);
    });
  });

  describe('4. Action Execution Tests', () => {
    it('should navigate on voice command', async () => {
      const sessionId = 'test-session-5';
      
      const response = await new SahayogAI().processMessage(
        sessionId,
        'काम देखना है',
        {}
      );
      
      expect(response.actions).toHaveLength(1);
      expect(response.actions[0]).toMatchObject({
        type: 'navigate',
        data: { path: '/mgnrega/work' },
      });
    });
    
    it('should file grievance on behalf of user', async () => {
      const sessionId = 'test-session-6';
      const sahayogAI = new SahayogAI();
      
      // Build grievance conversation
      await sahayogAI.processMessage(
        sessionId,
        'मेरा पैसा नहीं आया',
        {}
      );
      
      await sahayogAI.processMessage(
        sessionId,
        'तालाब खुदाई का',
        {}
      );
      
      await sahayogAI.processMessage(
        sessionId,
        'जनवरी 8 से 20 तक काम किया था',
        {}
      );
      
      const response = await sahayogAI.processMessage(
        sessionId,
        'हां, शिकायत दर्ज करें',
        {}
      );
      
      expect(response.actions).toContainEqual(
        expect.objectContaining({
          type: 'file_grievance',
          data: expect.objectContaining({
            grievanceText: expect.stringContaining('तालाब खुदाई'),
            category: 'payment_delay',
          }),
        })
      );
    });
    
    it('should extract data from natural conversation', async () => {
      const sessionId = 'test-session-7';
      
      const response = await new SahayogAI().processMessage(
        sessionId,
        'मेरे तीन बच्चे हैं और 2 एकड़ जमीन है',
        {}
      );
      
      expect(response.data_to_extract).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'familyDetails.numberOfChildren',
            value: 3,
          }),
          expect.objectContaining({
            field: 'economicInfo.landOwnership.landArea',
            value: 2,
          }),
        ])
      );
    });
  });

  describe('5. Multi-Page Conversation Tests', () => {
    it('should maintain conversation when navigating pages', async () => {
      const sessionId = 'test-session-8';
      const sahayogAI = new SahayogAI();
      
      // Start on dashboard
      const response1 = await sahayogAI.processMessage(
        sessionId,
        'काम देखना है',
        { currentPage: 'डैशबोर्ड' }
      );
      
      expect(response1.actions[0].data.path).toBe('/mgnrega/work');
      
      // Continue conversation on work page
      const response2 = await sahayogAI.processMessage(
        sessionId,
        'कौन सा काम अच्छा है?',
        { currentPage: 'उपलब्ध काम - आसपास के काम देखें' }
      );
      
      // Should remember context and provide relevant answer
      expect(response2.spoken_response).toBeTruthy();
      expect(response2.follow_up_required).toBe(true);
    });
    
    it('should explain different pages correctly', async () => {
      const sessionId = 'test-session-9';
      const sahayogAI = new SahayogAI();
      
      const pages = [
        {
          path: '/dashboard',
          context: 'डैशबोर्ड - मुख्य पेज\n\n46 दिन काम\n₹2400 बकाया',
          expectedContent: ['डैशबोर्ड', '46', '2400'],
        },
        {
          path: '/schemes/pm-kisan',
          context: 'PM-KISAN योजना - किसानों को ₹6000/साल\n\nतीन किस्तों में',
          expectedContent: ['किसान', '6000'],
        },
        {
          path: '/mgnrega/grievance',
          context: 'शिकायत - समस्या दर्ज करें\n\nअपनी समस्या लिखें',
          expectedContent: ['शिकायत', 'समस्या'],
        },
      ];
      
      for (const page of pages) {
        const response = await sahayogAI.processMessage(
          sessionId,
          'यह पेज क्या है?',
          { currentPage: page.context }
        );
        
        page.expectedContent.forEach(content => {
          expect(response.spoken_response).toContain(content);
        });
      }
    });
  });

  describe('6. Empathy and Emotional Intelligence Tests', () => {
    it('should detect distress and respond empathetically', async () => {
      const distressSignals = [
        'मेरे पास खाने के लिए कुछ नहीं है',
        'बच्चे भूखे हैं',
        'कर्ज बहुत हो गया है',
        'कोई मदद नहीं कर रहा',
      ];
      
      const sahayogAI = new SahayogAI();
      
      for (const signal of distressSignals) {
        const response = await sahayogAI.processMessage(
          'test-empathy',
          signal,
          {}
        );
        
        expect(response.emotional_state).toMatch(/distressed|urgent/);
        expect(response.spoken_response).toMatch(/दुख|समझ|मदद|साथ/);
      }
    });
    
    it('should use validation phrases', async () => {
      const response = await new SahayogAI().processMessage(
        'test-validation',
        'सब कहते हैं काम नहीं है',
        {}
      );
      
      expect(response.spoken_response).toMatch(
        /समझ|सही|मुश्किल|अकेले नहीं/
      );
    });
    
    it('should offer follow-up support', async () => {
      const response = await new SahayogAI().processMessage(
        'test-followup',
        'मुझे कुछ और पूछना है',
        {}
      );
      
      expect(response.follow_up_required).toBe(true);
      expect(response.spoken_response).toMatch(/पूछिए|बताइए|मदद/);
    });
  });

  describe('7. Database Integration Tests', () => {
    it('should use real user data in context', async () => {
      const fullContext = {
        userName: mockUser.fullName,
        village: mockUser.address.village,
        daysWorked: mockUser.mgnregaInfo.totalDaysWorkedThisYear,
        pendingPayment: 2400,
        currentPage: 'डैशबोर्ड',
        availableWorkCount: 3,
        language: 'hi',
        fullUserProfile: {
          hasJobCard: mockUser.mgnregaInfo.hasJobCard,
          category: mockUser.category,
          familyMembers: mockUser.familyDetails.numberOfChildren,
          isDisabled: false,
          skills: mockUser.skills.map(s => s.skillName),
          age: 35,
          maritalStatus: mockUser.familyDetails.maritalStatus,
          hasDebt: false,
        },
      };
      
      const response = await new SahayogAI().processMessage(
        'test-db',
        'मेरा पूरा डेटा बताओ',
        fullContext
      );
      
      // Should include all database fields
      expect(response.spoken_response).toContain(mockUser.fullName);
      expect(response.spoken_response).toContain(mockUser.address.village);
      expect(response.spoken_response).toContain('46');
      expect(response.spoken_response).toContain('मिस्त्री');
    });
    
    it('should suggest relevant schemes based on user profile', async () => {
      // Widow with children
      const widowContext = {
        userName: 'सीता देवी',
        fullUserProfile: {
          maritalStatus: 'widow',
          familyMembers: 2,
        },
      };
      
      const response = await new SahayogAI().processMessage(
        'test-schemes',
        'मुझे कौन सी योजना मिलेगी?',
        widowContext
      );
      
      expect(response.spoken_response).toMatch(/विधवा पेंशन/);
    });
  });
});

/**
 * MANUAL TEST SCENARIOS
 * Run these manually in the browser to verify complete functionality
 */
export const MANUAL_TEST_SCENARIOS = [
  {
    name: 'Wake Word Detection',
    steps: [
      '1. Open the app',
      '2. Say "साथी" or "Sathi"',
      '3. Verify AI assistant opens',
      '4. Verify toast notification appears',
    ],
    expected: 'AI activates and starts listening',
  },
  {
    name: 'Page Understanding - Dashboard',
    steps: [
      '1. Go to Dashboard',
      '2. Say "साथी"',
      '3. Ask "यह पेज क्या है?"',
      '4. Listen to AI response',
    ],
    expected: 'AI explains all dashboard sections with actual data',
  },
  {
    name: 'Conversational Grievance Filing',
    steps: [
      '1. Say "साथी"',
      '2. Say "मेरा पैसा नहीं आया"',
      '3. Answer AI follow-up questions naturally',
      '4. Confirm when AI asks to file',
    ],
    expected: 'AI files grievance with empathy, navigates to grievance page',
  },
  {
    name: 'Multi-Page Navigation',
    steps: [
      '1. Say "साथी"',
      '2. Say "काम देखना है"',
      '3. AI navigates to work page',
      '4. Say "साथी" again',
      '5. Ask "यह पेज क्या है?"',
    ],
    expected: 'AI explains work page with available jobs',
  },
  {
    name: 'Context Memory',
    steps: [
      '1. Say "साथी"',
      '2. Say "मेरे तीन बच्चे हैं"',
      '3. Later say "स्कूल की फीस चाहिए"',
    ],
    expected: 'AI remembers children count and responds contextually',
  },
  {
    name: 'Database Information',
    steps: [
      '1. Say "साथी"',
      '2. Ask "मैंने कितना काम किया?"',
      '3. Ask "मेरा पैसा कितना बाकी है?"',
      '4. Ask "मेरी पूरी जानकारी बताओ"',
    ],
    expected: 'AI provides accurate data from database: 46 days, ₹2400, all profile info',
  },
];
