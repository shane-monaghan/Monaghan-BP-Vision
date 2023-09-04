import * as React from 'react';

import { AuthProvider } from './app/context/AuthContext';
import AppNav from './app/navigation/AppNav';



export default function App() {

  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}
