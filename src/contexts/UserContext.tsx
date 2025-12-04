'use client';

import React, { createContext, useContext, useState, } from 'react';

type User = { id: string; name: string; email: string } | null;

type UserContextValue = {
  user: User; // 로그인 유저 정보
  isAuthenticated: boolean; // 인증 상태
  login: (user: User) => void;
  logout: () => void;
  // token: string | null;
  // role: 'admin' | 'driver' | 'user' | null;
};

const UserContext = createContext<UserContextValue | undefined>(undefined); // UserContextValue 타입의 값을 저장하는 컨텍스트 생성

export function UserProvider({ children }: { children: React.ReactNode }) { // 모든 페이지에 적용되는 공통 레이아웃
  const [user, setUser] = useState<User>(null);

  const login = (nextUser: User) => setUser(nextUser);
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {/* value 값은 UserContextValue 타입의 값을 저장하는 컨텍스트 생성 */}
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext); // UserContext 컨텍스트 사용
  if (!context) {
    throw new Error('useUser must be used within a UserProvider'); // 이 컨텍스트 바깥에 있을 때 보낼 에러
  }
  return context;
}

// 로그인 후 queryClient.invalidateQueries() 호출 시 로그인 유저 정보 업데이트
// queryClient.invalidateQueries()는 React Query의 함수로, 데이터 캐시를 무효화하는 역할을 함