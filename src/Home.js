import React from 'react';

import { UserButton } from '@clerk/clerk-react';

function Home() {
  return (
    <div>
      <UserButton />
      <h1>Bem-vindo à página protegida!</h1>
      <p>Você está autenticado e pode ver essa página.</p>      
    </div>
  );
}

export default Home;
