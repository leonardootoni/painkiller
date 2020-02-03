import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../../assets/store/auth/AuthContext';
/**
 * Peforms the User logout through Context and redirect the user to the login page
 */
const Logout = () => {
  const context = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    if (context) {
      context.logout();
    }
    history.push('/login');
  }, [context, history]);

  return null;
};

export default Logout;
