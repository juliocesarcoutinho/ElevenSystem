// withAuth.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { LoginService } from '../service/users/LoginService';


const withAuth = (WrappedComponent: React.ComponentType) => {
  const ComponentWithAuth = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      if (!LoginService.isAuthenticated()) {
        router.push('/login');
      }
    }, []);

    return LoginService.isAuthenticated() ? <WrappedComponent {...props} /> : null;
  };

  ComponentWithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithAuth;
};

export default withAuth;
