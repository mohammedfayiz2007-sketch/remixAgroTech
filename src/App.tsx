/**
 * AGRO — Detect Early. Grow Better.
 * AI-powered crop health and disease decision-support platform.
 * Backed by Firebase Firestore persistent storage and Authentication.
 * Powered by Google Maps Platform for real-time epidemiological radar.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OnboardingModal } from './components/OnboardingModal';
import { ScanPage } from './components/ScanPage';
import { DashboardPage } from './components/DashboardPage';
import { CommunityPage } from './components/CommunityPage';
import { PlantDetailModal } from './components/PlantDetailModal';
import { ExpertConsultationModal } from './components/ExpertConsultationModal';
import { AgroAIAssistant } from './components/AgroAIAssistant';
import { OfflineIndicator } from './components/OfflineIndicator';
import { GmailInboxView } from './components/GmailInboxView';
import { GmailComposeModal } from './components/GmailComposeModal';
import { FirebaseProvider, useFirebase } from './firebase/FirebaseContext';
import { APIProvider } from '@vis.gl/react-google-maps';

import {
  UserSession,
  TrackedPlant,
  PlantScan,
  AreaAlert,
  CommunityDiseaseReport,
  CommunityPost,
  ExpertConsultation,
} from './types';

import {
  DEFAULT_USER_SESSION,
  INITIAL_PLANTS,
  INITIAL_AREA_ALERTS,
  INITIAL_COMMUNITY_REPORTS,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_EXPERT_CONSULTATIONS,
} from './data/mockData';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

function AppContent({
  userSession,
  setUserSession,
  plants,
  setPlants,
  alerts,
  communityReports,
  setCommunityReports,
  communityPosts,
  setCommunityPosts,
  consultations,
  setConsultations,
  quotaExceeded,
}: {
  userSession: UserSession;
  setUserSession: React.Dispatch<React.SetStateAction<UserSession>>;
  plants: TrackedPlant[];
  setPlants: React.Dispatch<React.SetStateAction<TrackedPlant[]>>;
  alerts: AreaAlert[];
  communityReports: CommunityDiseaseReport[];
  setCommunityReports: React.Dispatch<React.SetStateAction<CommunityDiseaseReport[]>>;
  communityPosts: CommunityPost[];
  setCommunityPosts: React.Dispatch<React.SetStateAction<CommunityPost[]>>;
  consultations: ExpertConsultation[];
  setConsultations: React.Dispatch<React.SetStateAction<ExpertConsultation[]>>;
  quotaExceeded: boolean;
}) {
  const {
    currentUser,
    accessToken,
    signInWithGoogle,
    syncPlantToCloud,
    saveUserProfile,
    createCommunityPostInCloud,
    saveConsultationToCloud,
  } = useFirebase();

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !userSession.isOnboarded;
  });

  // Main navigation tab: 'scan' | 'dashboard' | 'community' | 'gmail'
  const [activeTab, setActiveTab] = useState<'scan' | 'dashboard' | 'community' | 'gmail'>('scan');
  const [plantForEmail, setPlantForEmail] = useState<TrackedPlant | null>(null);
  const [isGmailComposeOpen, setIsGmailComposeOpen] = useState<boolean>(false);

  // Modals & Panels
  const [selectedPlantForDetail, setSelectedPlantForDetail] = useState<TrackedPlant | null>(null);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState<boolean>(false);
  const [scanForExpert, setScanForExpert] = useState<PlantScan | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [activeScanForAssistant, setActiveScanForAssistant] = useState<PlantScan | null>(null);

  // Complete onboarding
  const handleCompleteOnboarding = (newUser: UserSession) => {
    setUserSession(newUser);
    setShowOnboarding(false);
    try {
      localStorage.setItem('agro_user_session', JSON.stringify(newUser));
    } catch (e) {
      console.warn('Failed to persist user session:', e);
    }
    saveUserProfile(newUser).catch((err) => {
      console.warn('Could not sync user profile to Firebase:', err);
    });
  };

  // Add new plant or update existing plant from a new scan
  const handleSavePlant = (scan: PlantScan, customName?: string) => {
    const existingIndex = plants.findIndex(
      (p) => p.customName.toLowerCase() === (customName || '').toLowerCase()
    );

    const plantIcon =
      scan.plant.toLowerCase().includes('tomato')
        ? '🍅'
        : scan.plant.toLowerCase().includes('chilli') || scan.plant.toLowerCase().includes('pepper')
        ? '🌶️'
        : scan.plant.toLowerCase().includes('paddy') || scan.plant.toLowerCase().includes('rice')
        ? '🌾'
        : scan.plant.toLowerCase().includes('potato')
        ? '🥔'
        : scan.plant.toLowerCase().includes('cucumber')
        ? '🥒'
        : '🌱';

    if (existingIndex >= 0) {
      // Append scan to existing plant
      const updated = [...plants];
      const target = updated[existingIndex];
      const newDayLabel = `Day ${target.scans.length * 2 + 1}`;
      const updatedScan = { ...scan, dayLabel: newDayLabel };

      const updatedPlant: TrackedPlant = {
        ...target,
        currentDisease: scan.disease,
        currentSeverity: scan.severity,
        currentHealthScore: scan.healthScore,
        healthStatusLabel:
          scan.healthScore >= 80 ? 'Healthy' : scan.healthScore >= 60 ? 'Recovering' : 'Needs Attention',
        environmentTag: scan.environmentTag || target.environmentTag || 'Outdoor',
        lastScannedDate: 'Just now',
        scans: [...target.scans, updatedScan],
      };

      updated[existingIndex] = updatedPlant;
      setPlants(updated);
      syncPlantToCloud(updatedPlant).catch((e) => console.warn('Cloud sync error for updated plant:', e));
    } else {
      // Create new tracked plant
      const newPlantName = customName || `${scan.plant} ${String(plants.length + 1).padStart(2, '0')}`;
      const newPlant: TrackedPlant = {
        id: `plant-${Date.now()}`,
        customName: newPlantName,
        plantName: scan.plant,
        cropType: scan.cropType,
        icon: plantIcon,
        currentDisease: scan.disease,
        currentSeverity: scan.severity,
        currentHealthScore: scan.healthScore,
        healthStatusLabel:
          scan.healthScore >= 80 ? 'Healthy' : scan.healthScore >= 60 ? 'Recovering' : 'Needs Attention',
        environmentTag: scan.environmentTag || 'Outdoor',
        lastScannedDate: 'Just now',
        scans: [{ ...scan, dayLabel: 'Day 1' }],
        dailyActionPlan: {
          morning:
            scan.environmentSpecificGuidance?.recommendedActions[0] ||
            'Inspect lower leaf undersides for damp spore signs or discoloration.',
          watering:
            scan.environmentSpecificGuidance?.recommendedActions[2] ||
            'Maintain drip ground watering; avoid getting leaves wet.',
          monitoring:
            scan.environmentSpecificGuidance?.recommendedActions[1] ||
            'Monitor adjacent plant foliage for similar symptoms.',
          nextStep:
            scan.environmentSpecificGuidance?.climateControlTips[0] ||
            'Follow-up diagnostic scan scheduled in 3 days.',
        },
      };

      setPlants([newPlant, ...plants]);
      syncPlantToCloud(newPlant).catch((e) => console.warn('Cloud sync error for new plant:', e));
    }

    // Optionally contribute anonymized community signal
    const matchedReportIndex = communityReports.findIndex((r) =>
      r.diseaseName.toLowerCase().includes(scan.disease.toLowerCase())
    );
    if (matchedReportIndex >= 0) {
      const updatedReports = [...communityReports];
      updatedReports[matchedReportIndex].reportsCount += 1;
      setCommunityReports(updatedReports);
    }
  };

  // Open expert consultation modal with active scan
  const handleOpenExpertWithScan = (scan: PlantScan) => {
    setScanForExpert(scan);
    setIsExpertModalOpen(true);
  };

  // Open Agro AI Assistant with scan context
  const handleOpenAssistantWithScan = (scan: PlantScan) => {
    setActiveScanForAssistant(scan);
    setIsAssistantOpen(true);
  };

  // Open Agro AI Assistant from plant detail modal
  const handleOpenAssistantFromPlant = (plant: TrackedPlant) => {
    const latest = plant.scans[plant.scans.length - 1];
    if (latest) {
      setActiveScanForAssistant(latest);
    }
    setIsAssistantOpen(true);
  };

  // Add community post
  const handleAddCommunityPost = (
    newPostData: Omit<CommunityPost, 'id' | 'timeAgo' | 'likes' | 'replies'>
  ) => {
    const newPost: CommunityPost = {
      ...newPostData,
      id: `post-${Date.now()}`,
      timeAgo: 'Just now',
      likes: 1,
      isLiked: true,
      replies: [],
    };
    setCommunityPosts([newPost, ...communityPosts]);
    createCommunityPostInCloud(newPost).catch((e) => console.warn('Cloud sync error for post:', e));
  };

  // Submit expert consultation
  const handleSubmitConsultation = (
    inquiry: Omit<ExpertConsultation, 'id' | 'timestamp' | 'status'>
  ) => {
    const newInquiry: ExpertConsultation = {
      ...inquiry,
      id: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      status: 'Under Review',
    };
    setConsultations([newInquiry, ...consultations]);
    saveConsultationToCloud(newInquiry).catch((e) => console.warn('Cloud sync error for consultation:', e));
  };

  return (
    <div className="min-h-screen bg-[#090C0A] text-[#EDEDED] flex flex-col font-sans selection:bg-[#00FF66] selection:text-black">
      
      {/* Client-Side Quota Defense Sticky Warning Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Header */}
      <Header
        userSession={userSession}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenLocationEdit={() => setShowOnboarding(true)}
        unreadAlertsCount={alerts.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-12">
        {activeTab === 'scan' && (
          <ScanPage
            userSession={userSession}
            onSavePlant={handleSavePlant}
            onOpenExpert={handleOpenExpertWithScan}
            onOpenAssistantWithScan={handleOpenAssistantWithScan}
            savedPlants={plants}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            userSession={userSession}
            plants={plants}
            alerts={alerts}
            onSelectPlant={(plant) => setSelectedPlantForDetail(plant)}
            onNavigateToScan={() => setActiveTab('scan')}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        )}

        {activeTab === 'community' && (
          <CommunityPage
            userSession={userSession}
            reports={communityReports}
            posts={communityPosts}
            onAddPost={handleAddCommunityPost}
            onOpenExpert={() => setIsExpertModalOpen(true)}
          />
        )}

        {activeTab === 'gmail' && (
          <GmailInboxView
            accessToken={accessToken}
            currentUserEmail={currentUser?.email || userSession.emailOrPhone}
            currentUserName={currentUser?.displayName || userSession.name}
            onRequireAuth={() => signInWithGoogle()}
            plants={plants}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* FIRST-TIME ONLY ONBOARDING MODAL */}
      {showOnboarding && (
        <OnboardingModal onComplete={handleCompleteOnboarding} />
      )}

      {/* PLANT DETAIL MODAL */}
      {selectedPlantForDetail && (
        <PlantDetailModal
          plant={selectedPlantForDetail}
          onClose={() => setSelectedPlantForDetail(null)}
          onUploadNewScanForPlant={(_plant) => {
            setSelectedPlantForDetail(null);
            setActiveTab('scan');
          }}
          onAskAIAboutPlant={(plant) => {
            handleOpenAssistantFromPlant(plant);
          }}
          onEmailPlantReport={(plant) => {
            setPlantForEmail(plant);
            setIsGmailComposeOpen(true);
          }}
        />
      )}

      {/* GMAIL COMPOSE & REPORT DISPATCH MODAL */}
      <GmailComposeModal
        isOpen={isGmailComposeOpen}
        onClose={() => {
          setIsGmailComposeOpen(false);
          setPlantForEmail(null);
        }}
        token={accessToken}
        onRequireAuth={() => signInWithGoogle()}
        senderEmail={currentUser?.email || userSession.emailOrPhone}
        senderName={currentUser?.displayName || userSession.name}
        initialPlant={plantForEmail}
      />

      {/* EXPERT CONSULTATION MODAL */}
      {isExpertModalOpen && (
        <ExpertConsultationModal
          userSession={userSession}
          activeScan={scanForExpert}
          consultations={consultations}
          onSubmitConsultation={handleSubmitConsultation}
          onClose={() => {
            setIsExpertModalOpen(false);
            setScanForExpert(null);
          }}
        />
      )}

      {/* AGRO AI ASSISTANT CHAT DRAWER */}
      <AgroAIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        userSession={userSession}
        activePlant={selectedPlantForDetail}
        activeScan={activeScanForAssistant}
      />

      {/* Connectivity & Offline Indicator */}
      <OfflineIndicator />

    </div>
  );
}

export default function App() {
  // Session / Authentication state
  const [userSession, setUserSession] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem('agro_user_session');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load user session from localStorage:', e);
    }
    return DEFAULT_USER_SESSION;
  });

  // Plants state
  const [plants, setPlants] = useState<TrackedPlant[]>(() => {
    try {
      const saved = localStorage.getItem('agro_plants');
      if (saved) {
        const parsed: TrackedPlant[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((p) => p.id));
        const missingDefaults = INITIAL_PLANTS.filter((p) => !existingIds.has(p.id));
        return [...parsed, ...missingDefaults];
      }
    } catch (e) {
      console.warn('Failed to load plants from localStorage:', e);
    }
    return INITIAL_PLANTS;
  });

  // Alerts, community reports, posts, and expert consultations
  const [alerts] = useState<AreaAlert[]>(INITIAL_AREA_ALERTS);
  const [communityReports, setCommunityReports] = useState<CommunityDiseaseReport[]>(INITIAL_COMMUNITY_REPORTS);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [consultations, setConsultations] = useState<ExpertConsultation[]>(INITIAL_EXPERT_CONSULTATIONS);

  // Google Maps client-side quota defense listener
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Save plants to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agro_plants', JSON.stringify(plants));
    } catch (e) {
      console.warn('Failed to persist plants:', e);
    }
  }, [plants]);

  const handleCloudPlantsLoaded = useCallback((cloudPlants: TrackedPlant[]) => {
    if (cloudPlants.length > 0) {
      setPlants(cloudPlants);
    }
  }, []);

  const handleCloudPostsLoaded = useCallback((cloudPosts: CommunityPost[]) => {
    if (cloudPosts.length > 0) {
      setCommunityPosts(cloudPosts);
    }
  }, []);

  const handleCloudReportsLoaded = useCallback((cloudReports: CommunityDiseaseReport[]) => {
    if (cloudReports.length > 0) {
      setCommunityReports(cloudReports);
    }
  }, []);

  const handleCloudConsultationsLoaded = useCallback((cloudConsults: ExpertConsultation[]) => {
    if (cloudConsults.length > 0) {
      setConsultations(cloudConsults);
    }
  }, []);

  const handleUserSessionSynced = useCallback((partialSession: Partial<UserSession>) => {
    setUserSession((prev) => ({
      ...prev,
      ...partialSession,
    }));
  }, []);

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker', 'places', 'geometry']}>
      <FirebaseProvider
        onCloudPlantsLoaded={handleCloudPlantsLoaded}
        onCloudPostsLoaded={handleCloudPostsLoaded}
        onCloudReportsLoaded={handleCloudReportsLoaded}
        onCloudConsultationsLoaded={handleCloudConsultationsLoaded}
        onUserSessionSynced={handleUserSessionSynced}
      >
        <AppContent
          userSession={userSession}
          setUserSession={setUserSession}
          plants={plants}
          setPlants={setPlants}
          alerts={alerts}
          communityReports={communityReports}
          setCommunityReports={setCommunityReports}
          communityPosts={communityPosts}
          setCommunityPosts={setCommunityPosts}
          consultations={consultations}
          setConsultations={setConsultations}
          quotaExceeded={quotaExceeded}
        />
      </FirebaseProvider>
    </APIProvider>
  );
}
