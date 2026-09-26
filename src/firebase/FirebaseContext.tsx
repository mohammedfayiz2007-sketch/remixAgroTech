import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, signInWithPopup, signOut as fbSignOut, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';
import { auth, db, googleProvider } from './config';
import { handleFirestoreError, OperationType } from './errorHandler';
import { TrackedPlant, CommunityPost, CommunityDiseaseReport, ExpertConsultation, UserSession } from '../types';
import { INITIAL_COMMUNITY_POSTS, INITIAL_COMMUNITY_REPORTS } from '../data/mockData';

// In-memory access token cache (NOT in localStorage/sessionStorage as required)
let inMemoryAccessToken: string | null = null;

export const getCachedAccessToken = () => inMemoryAccessToken;

interface FirebaseContextType {
  currentUser: User | null;
  authLoading: boolean;
  isFirebaseReady: boolean;
  accessToken: string | null;
  signInWithGoogle: () => Promise<string | null>;
  requestGmailAccess: () => Promise<string | null>;
  getAccessToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
  syncPlantToCloud: (plant: TrackedPlant) => Promise<void>;
  deletePlantFromCloud: (plantId: string) => Promise<void>;
  saveUserProfile: (session: UserSession) => Promise<void>;
  createCommunityPostInCloud: (post: CommunityPost) => Promise<void>;
  updateCommunityPostInCloud: (post: CommunityPost) => Promise<void>;
  saveConsultationToCloud: (consultation: ExpertConsultation) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{
  children: React.ReactNode;
  onCloudPlantsLoaded?: (plants: TrackedPlant[]) => void;
  onCloudPostsLoaded?: (posts: CommunityPost[]) => void;
  onCloudReportsLoaded?: (reports: CommunityDiseaseReport[]) => void;
  onCloudConsultationsLoaded?: (consultations: ExpertConsultation[]) => void;
  onUserSessionSynced?: (session: Partial<UserSession>) => void;
}> = ({
  children,
  onCloudPlantsLoaded,
  onCloudPostsLoaded,
  onCloudReportsLoaded,
  onCloudConsultationsLoaded,
  onUserSessionSynced,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isFirebaseReady, setIsFirebaseReady] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(inMemoryAccessToken);

  // Monitor auth status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      setIsFirebaseReady(true);

      if (user) {
        if (onUserSessionSynced) {
          onUserSessionSynced({
            name: user.displayName || 'Farmer',
            emailOrPhone: user.email || '',
          });
        }
      } else {
        inMemoryAccessToken = null;
        setAccessToken(null);
      }
    });

    return () => unsubscribe();
  }, [onUserSessionSynced]);

  // Synchronize User Plants from Firestore when authenticated
  useEffect(() => {
    if (!currentUser || !onCloudPlantsLoaded) return;

    const plantsPath = `users/${currentUser.uid}/plants`;
    try {
      const q = collection(db, 'users', currentUser.uid, 'plants');
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const loadedPlants = snapshot.docs.map((docSnap) => docSnap.data() as TrackedPlant);
            onCloudPlantsLoaded(loadedPlants);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, plantsPath);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.warn('Could not initialize plant snapshot listener:', error);
    }
  }, [currentUser, onCloudPlantsLoaded]);

  // Synchronize Community Posts from Firestore
  useEffect(() => {
    if (!onCloudPostsLoaded) return;

    const postsPath = 'communityPosts';
    try {
      const q = query(collection(db, postsPath), limit(50));
      const unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          if (!snapshot.empty) {
            const loadedPosts = snapshot.docs.map((docSnap) => docSnap.data() as CommunityPost);
            onCloudPostsLoaded(loadedPosts);
          } else if (currentUser) {
            // Seed initial posts to cloud if collection is empty
            for (const p of INITIAL_COMMUNITY_POSTS) {
              try {
                await setDoc(doc(db, postsPath, p.id), {
                  ...p,
                  authorId: currentUser.uid,
                });
              } catch (e) {
                // non-blocking
              }
            }
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, postsPath);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.warn('Could not initialize community posts listener:', error);
    }
  }, [currentUser, onCloudPostsLoaded]);

  // Synchronize Outbreak Reports from Firestore
  useEffect(() => {
    if (!onCloudReportsLoaded) return;

    const reportsPath = 'communityReports';
    try {
      const q = collection(db, reportsPath);
      const unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          if (!snapshot.empty) {
            const loadedReports = snapshot.docs.map((docSnap) => docSnap.data() as CommunityDiseaseReport);
            onCloudReportsLoaded(loadedReports);
          } else if (currentUser) {
            // Seed initial outbreak reports
            for (const r of INITIAL_COMMUNITY_REPORTS) {
              try {
                await setDoc(doc(db, reportsPath, r.id), r);
              } catch (e) {
                // non-blocking
              }
            }
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, reportsPath);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.warn('Could not initialize community reports listener:', error);
    }
  }, [currentUser, onCloudReportsLoaded]);

  // Synchronize Consultations
  useEffect(() => {
    if (!currentUser || !onCloudConsultationsLoaded) return;

    const consultationsPath = `users/${currentUser.uid}/consultations`;
    try {
      const q = collection(db, 'users', currentUser.uid, 'consultations');
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const loaded = snapshot.docs.map((docSnap) => docSnap.data() as ExpertConsultation);
            onCloudConsultationsLoaded(loaded);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, consultationsPath);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.warn('Could not initialize consultations listener:', error);
    }
  }, [currentUser, onCloudConsultationsLoaded]);

  const signInWithGoogle = async (): Promise<string | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken || null;
      inMemoryAccessToken = token;
      setAccessToken(token);
      return token;
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        console.info('Google sign-in popup closed by user.');
        return null;
      }
      console.error('Firebase Auth sign in error:', error);
      throw error;
    }
  };

  const requestGmailAccess = async (): Promise<string | null> => {
    if (inMemoryAccessToken) return inMemoryAccessToken;
    return signInWithGoogle();
  };

  const getAccessToken = async (): Promise<string | null> => {
    return inMemoryAccessToken;
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      inMemoryAccessToken = null;
      setAccessToken(null);
    } catch (error) {
      console.error('Firebase Auth sign out error:', error);
      throw error;
    }
  };

  const syncPlantToCloud = async (plant: TrackedPlant) => {
    if (!currentUser) return;
    const plantPath = `users/${currentUser.uid}/plants/${plant.id}`;
    try {
      await setDoc(doc(db, 'users', currentUser.uid, 'plants', plant.id), {
        ...plant,
        userId: currentUser.uid,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, plantPath);
    }
  };

  const deletePlantFromCloud = async (plantId: string) => {
    if (!currentUser) return;
    const plantPath = `users/${currentUser.uid}/plants/${plantId}`;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'plants', plantId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, plantPath);
    }
  };

  const saveUserProfile = async (session: UserSession) => {
    if (!currentUser) return;
    const profilePath = `users/${currentUser.uid}`;
    try {
      await setDoc(
        doc(db, 'users', currentUser.uid),
        {
          uid: currentUser.uid,
          name: session.name || currentUser.displayName || 'Farmer',
          email: currentUser.email || session.emailOrPhone || '',
          location: session.location,
          latitude: session.latitude,
          longitude: session.longitude,
          language: session.language,
          isOnboarded: session.isOnboarded,
          joinedDate: session.joinedDate,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, profilePath);
    }
  };

  const createCommunityPostInCloud = async (post: CommunityPost) => {
    const postPath = `communityPosts/${post.id}`;
    try {
      await setDoc(doc(db, 'communityPosts', post.id), {
        ...post,
        authorId: currentUser ? currentUser.uid : 'anon-grower',
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, postPath);
    }
  };

  const updateCommunityPostInCloud = async (post: CommunityPost) => {
    const postPath = `communityPosts/${post.id}`;
    try {
      await setDoc(doc(db, 'communityPosts', post.id), post, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, postPath);
    }
  };

  const saveConsultationToCloud = async (consultation: ExpertConsultation) => {
    if (!currentUser) return;
    const consultPath = `users/${currentUser.uid}/consultations/${consultation.id}`;
    try {
      await setDoc(doc(db, 'users', currentUser.uid, 'consultations', consultation.id), {
        ...consultation,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, consultPath);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        currentUser,
        authLoading,
        isFirebaseReady,
        accessToken,
        signInWithGoogle,
        requestGmailAccess,
        getAccessToken,
        signOut,
        syncPlantToCloud,
        deletePlantFromCloud,
        saveUserProfile,
        createCommunityPostInCloud,
        updateCommunityPostInCloud,
        saveConsultationToCloud,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
