import { useAdminLogic } from '../../hooks/Admin/useAdminLogic';
import { AdminContext } from './AdminContext';

export const AdminProvider = ({ children }) => {
  const admin = useAdminLogic();

  return (
    <AdminContext.Provider value={admin}>
      {children}
    </AdminContext.Provider>
  );
};
