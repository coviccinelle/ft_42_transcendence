import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import apiUser from '../../api/user';

function Toggle2FA() {
  const [enabled, setEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await apiUser.getMe();
      if (user) {
        setEnabled(user.isTwoFAEnabled);
      }
    };
    fetchUser();
  }, []);

  function onChange() {
    return navigate('/2fa');
  }

  return (
    <Switch
      checked={enabled}
      onChange={onChange}
      className={`${
        enabled ? 'bg-blue-600' : 'bg-gray-400'
      } relative inline-flex h-6 w-11 items-center rounded-full justify-self-end`}
    >
      <span className="sr-only">Enable notifications</span>
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
}

export default Toggle2FA;
