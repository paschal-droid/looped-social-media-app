import auth from '@react-native-firebase/auth'
import { Routes } from '../navigation/Routes';
// import { useNavigation } from '@react-navigation/native';
// import { useChatContext } from 'stream-chat-react-native';

export const createChatChannel  = async (member, client, navigation) => {
    

    try {
      const userID = auth().currentUser.uid; // Replace with your current user ID
      const memberID = member.uid;
      
  
      // Create a unique channel ID (e.g., sorted user IDs)
      const channelID = [userID, memberID].join('_');
  
      // Check if the channel already exists
      const existingChannels = await client.queryChannels({
        type: 'messaging',
        members: { $in: [userID] },
      });
  
      const existingChannel = existingChannels.find(
        (channel) => Object.keys(channel?.state.members).includes(memberID)
      );
  
      if (existingChannel) {
        // Reuse existing channel
        navigation.navigate(Routes.ChatRoom, { channelID: existingChannel.id });
        return;
      }
  
      // Create a new channel
      const newChannel = client.channel('messaging', channelID, {
        members: [userID, memberID],
        name: `${member.firstName} ${member.lastName}`,
      });
  
      await newChannel.create();
      navigation.navigate(Routes.ChatRoom, { channelID: newChannel.id });
    } catch (error) {
      if(__DEV__) {
        console.error('Failed to create channel:', error);
      }
    }
  };

  export const example = async (member) => {
    
    
  }