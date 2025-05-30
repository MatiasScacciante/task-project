import React, { useState } from 'react';
import UserSelector from './UserSelector';
import TaskManager from './TaskManager';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <UserSelector onSelectUser={setUser} />
      ) : (
        <TaskManager user={user} />
      )}
    </div>
  );
}

export default App;
