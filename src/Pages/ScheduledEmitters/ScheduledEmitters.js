import React, {useState, useEffect} from 'react';
import Calendar from '../../Components/Calendar/Calendar.js';


function ScheduledEmitters() {

  const [currentUser, setCurrentUser] = useState({id: 1, isAdmin: true });

  useEffect(() => {
    // Simulating an authentication process
    const fetchUser = async () => {
      // Assume fetchCurrentUser is a function that fetches the current user data from your backend
      // const user = await fetchCurrentUser();
      const user = { id: 1, isAdmin: true };  // Hardcoded user data for demonstration
      setCurrentUser(user);
    };

    fetchUser();
  }, []);

  return (
    <div>
      {currentUser ? (
        <Calendar currentUser={currentUser} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ScheduledEmitters;
