import { useChatContext } from 'stream-chat-react-native';
import { useEffect, useState } from 'react';

const useUserPresence = (userId) => {
  const { client } = useChatContext();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!client || !userId) return;

    // Query the user's presence
    const queryUserPresence = async () => {
      try {
        // Query the user to get their presence data
        const response = await client.queryUsers({ id: userId });
        const user = response.users[0];

        if (user) {
          setIsOnline(user.online || false);

          // Subscribe to presence updates for this user
          const handlePresenceChange = (event) => {
            if (event.user?.id === userId) {
              setIsOnline(event.user.online);
            }
          };

          client.on('presence.changed', handlePresenceChange);

          // Cleanup subscription
          return () => {
            client.off('presence.changed', handlePresenceChange);
          };
        }
      } catch (error) {
        if(__DEV__) {
          console.error('Error querying user presence:', error);
        }
      }
    };

    queryUserPresence();
  }, [userId, client]);

  return isOnline;
};

export default useUserPresence