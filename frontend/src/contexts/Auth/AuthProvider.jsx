import { useAuthLogic } from '../../hooks/Auth/useAuthLogic';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const auth = useAuthLogic();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
