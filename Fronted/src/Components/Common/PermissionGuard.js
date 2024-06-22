// PermissionGuard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PermissionGuard = ({ permissionName, children }) => {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkPermission = async () => { 

      try {


        let pname = permissionName.split('/')[1];
        const response = await axios.get(`/api/checkPermission?permissionName=${pname}`);


        setAllowed(response?.allowed);
 
      } catch (error) {
        console.error('Error checking permission:', error);
      }
    };

    checkPermission();
  }, [permissionName]);

  return allowed ? <>{children}</> : null;
};

export default PermissionGuard;
