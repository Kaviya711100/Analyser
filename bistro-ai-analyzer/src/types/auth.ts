
export interface User {
  id: string;
  username: string;
  role: 'owner' | 'staff';
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
