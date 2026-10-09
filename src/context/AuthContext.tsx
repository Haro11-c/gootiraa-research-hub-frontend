import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  bookmarkedIds: Set<string>;
  followingIds: Set<string>;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  toggleBookmark: (pubId: string) => Promise<boolean>;
  toggleFollow: (authorId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

  const refreshUser = async () => {
    try {
      if (localStorage.getItem('gootiraa_token')) {
        const currentUser = await api.me();
        setUser(currentUser);
        if (currentUser.bookmarkedPublicationIds) {
          setBookmarkedIds(new Set(currentUser.bookmarkedPublicationIds));
        }
        if (currentUser.followingIds) {
          setFollowingIds(new Set(currentUser.followingIds));
        }
      } else {
        setUser(null);
        setFollowingIds(new Set());
      }
    } catch (err) {
      api.clearToken();
      setUser(null);
      setFollowingIds(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    setUser(res.user);
    await refreshUser();
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    setUser(res.user);
    await refreshUser();
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
    setBookmarkedIds(new Set());
    setFollowingIds(new Set());
  };

  const toggleBookmark = async (pubId: string): Promise<boolean> => {
    if (!user) throw new Error('Authentication required to bookmark research.');
    const res = await api.toggleBookmark(pubId);
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (res.bookmarked) {
        next.add(pubId);
      } else {
        next.delete(pubId);
      }
      return next;
    });
    return res.bookmarked;
  };

  const toggleFollow = async (authorId: string): Promise<boolean> => {
    if (!user) throw new Error('Authentication required to follow researchers.');
    const res = await api.toggleFollow(authorId);
    setFollowingIds((prev) => {
      const next = new Set(prev);
      if (res.following) {
        next.add(authorId);
      } else {
        next.delete(authorId);
      }
      return next;
    });
    return res.following;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        bookmarkedIds,
        followingIds,
        login,
        register,
        logout,
        refreshUser,
        toggleBookmark,
        toggleFollow,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
