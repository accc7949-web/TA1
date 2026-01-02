import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  onAuthStateChanged
} from "firebase/auth";
import { 
  collection, 
  setDoc, 
  doc, 
  getDoc,
  updateDoc,
  Timestamp 
} from "firebase/firestore";
import { auth, db } from "./firebase";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  avatar?: string;
  role?: 'admin' | 'user' | 'moderator' | 'ai_bot';
  isAdmin?: boolean; // Keep for backward compatibility
  createdAt: Timestamp;
  updatedAt: Timestamp;
  learningStats?: {
    totalLessons: number;
    currentLevel: string;
    streak: number;
  };
}

// Đăng ký tài khoản mới
export const registerUser = async (email: string, password: string, displayName: string): Promise<User | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile
    await updateProfile(user, {
      displayName: displayName
    });

    // Lưu thông tin vào Firestore
    const isAdminUser = user.uid === "OvBehauvk4W55b7ovcnNRk3v0ps1" || user.email === "Shabbysan483@gmail.com";
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || "",
      displayName: displayName,
      role: isAdminUser ? 'admin' : 'user',
      isAdmin: isAdminUser,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      learningStats: {
        totalLessons: 0,
        currentLevel: "Beginner",
        streak: 0
      }
    };

    await setDoc(doc(db, "users", user.uid), userProfile);
    return user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Đăng nhập
export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if user should be admin and update if needed
    const isAdminUser = user.uid === "OvBehauvk4W55b7ovcnNRk3v0ps1" || user.email === "shabbysan483@gmail.com";
    if (isAdminUser) {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data() as UserProfile;
        if (userData.role !== 'admin') {
          // Update role to admin if not already
          await updateDoc(userRef, {
            role: 'admin',
            isAdmin: true,
            updatedAt: Timestamp.now()
          });
          console.log('User role updated to admin:', user.email);
        }
      }
    }
    
    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Đăng xuất
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// Lấy thông tin người dùng
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Get user profile error:", error);
    return null;
  }
};

// Cập nhật thông tin người dùng
export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    throw error;
  }
};

// Theo dõi trạng thái đăng nhập
export const observeAuthState = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};
