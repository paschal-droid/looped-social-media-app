export const interests = [
  {
    interestId: 1,
    name: 'Sports',
  },
  {
    interestId: 2,
    name: 'Dance',
  },
  {
    interestId: 3,
    name: 'Memes',
  },
  {
    interestId: 4,
    name: 'Fun & Activity',
  },
  {
    interestId: 5,
    name: 'Food',
  },
  {
    interestId: 6,
    name: 'Education',
  },
  {
    interestId: 7,
    name: 'Content Create',
  },
  {
    interestId: 8,
    name: 'Travel',
  },
  {
    interestId: 9,
    name: 'Fashion',
  },
  {
    interestId: 10,
    name: 'Photography',
  },
];

export const preferredCountries = ["US", "IN", "BR", "RU", "ID", "MX", "NG", "BD", "PK", "JP", "PH", "VN", "TR", "DE", "EG", "IR", "TH", "GB", "FR", "IT", "ZA", "KR", "CO", "ES", "AR", "UA", "CA", "IQ", "AU", "PL", "MY", "SA", "NL", "TW", "DZ", "MA", "VE", "PE", "UZ", "KZ", "SD", "KE", "GH", "MM", "CM", "CI", "MG", "AO", "ZM", "TZ"]

export const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const languages = [
  {name: 'English', lang: 'en'},
  {name: 'Spanish', lang: 'es'},
  {name: 'Chinese', lang: 'zh'},
  {name: 'French', lang: 'fr'},
  {name: 'Arabic', lang: 'ar'},
]

const currentDate = new Date();

// Set the time to 12:00 AM of the next day
const nextDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 0, 0, 0);

// Calculate the difference in milliseconds
const differenceInMilliseconds = nextDay.getTime() - currentDate.getTime();

// Convert milliseconds to hours
export const differenceInHours = parseInt(differenceInMilliseconds / (1000 * 60 * 60)).toPrecision(1);

export default Constants = {differenceInHours, preferredCountries, languages, interests}

//! a unique profile name generator
export const generateUniqueImageName =  (originalName) => {
  const timestamp = new Date().getTime();
  const uniqueId = Math.random().toString(36).substring(2, 8); // Generates a random 6-character string
  const extension = originalName.split('.').pop(); // Get the file extension
  return `${originalName}_${timestamp}_${uniqueId}.${extension}`;
}
export const generateUniqueImageNameV2 =  (originalName) => {
  const timestamp = new Date().getTime();
  const uniqueId = Math.random().toString(36).substring(2, 8); // Generates a random 6-character string
  return `${originalName}_${timestamp}_${uniqueId}`;
}


//!convertion of timestamp in seconds to original date
export function convertSecondsToDate(seconds) {
  // Convert seconds to milliseconds
  const milliseconds = seconds * 1000;
  // Create a new Date object
  const date = new Date(milliseconds);
  // Extract year, month, and day
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based, so add 1
  const day = date.getDate();
  // Return the formatted date
  return `${day < 10 ? '0' : ''}${day} / ${month < 10 ? '0' : ''}${month} / ${year}`;
}

export const getFileType = (uri) => {
  const extension = uri.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
    return 'image';
  } else if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) {
    return 'video';
  } else {
    // Unsupported file type, handle accordingly
    return 'unknown';
  }
};

// ! conversion of posts timestamp to hours or days or weeks

export function formatPostTime(timestamp){
   // Convert Firebase timestamp to milliseconds
   const postTime = timestamp * 1000;

   // Calculate the current time in milliseconds
   const currentTime = Date.now();
 
   // Calculate the difference in milliseconds
   const timeDifference = currentTime - postTime;
 
   // Convert milliseconds to hours, days, or weeks
   const minutes = Math.floor(timeDifference / (1000 * 60));
   const hours = Math.floor(timeDifference / (1000 * 60 * 60));
   const days = Math.floor(hours / 24);
   const weeks = Math.floor(days / 7);
 
   // Determine the appropriate format based on the time difference
   let displayTime;
   if(minutes < 60){
    displayTime = `${minutes} mins ago`
   }else if (hours < 24) {
     displayTime = `${hours} hour${hours > 1 ? 's' : ''} ago`;
   } else if (days < 7) {
     displayTime = `${days} day${days > 1 ? 's' : ''} ago`;
   } else {
     displayTime = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
   }
 
   return displayTime;
}

export function formatLikesCount(likes) {
  if (likes < 1000) {
    // Less than 1000 likes, no formatting needed
    return likes.toString();
  } else if (likes < 10000) {
    // Between 1000 and 9999 likes, display with one decimal place
    return (likes / 1000).toFixed(1) + 'k';
  } else if (likes < 1000000) {
    // Between 10,000 and 999,999 likes
    if (likes % 1000 === 0) {
      // If exact thousand, display without decimal
      return (likes / 1000) + 'k';
    } else {
      // If not exact thousand, display with one decimal place
      return (likes / 1000).toFixed(1) + 'k';
    }
  }if (likes < 10000000) {
    // Between 1,000,000 and 9,999,999 likes, display with one decimal place
    return (likes / 1000000).toFixed(1) + 'M';
  } else if (likes < 100000000) {
    // Between 10,000,000 and 99,999,999 likes, display with one decimal place
    if (likes % 10000000 === 0) {
      // If exact tens of million, display without decimal
      return (likes / 1000000) + 'M';
    } else {
      // If not exact thousand, display with one decimal place
      return (likes / 1000000).toFixed(1) + 'M';
    }
  }
  else {
    // More than 9,999,999 likes, display as 'M'
    const formattedLikes = Math.floor(likes / 1000000); // Convert to millions
    return formattedLikes + 'M';
  }
}

export const truncateText = (text, maxLength) => {
  if(text.length <= maxLength){
    return text
  }
  return text.substring(0, maxLength)+'...'
}

export const createRoomId = (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort()
  const roomId = sortedIds.join('-')
  return roomId
}

export function formatTimeDifference(date) {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInSeconds = diffInMs / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;

  
  

  if (diffInHours < 24) {
    // If the difference is within 24 hours, format it as HH:MM AM/PM
    const hours = new Date(date).getHours();
    const minutes = new Date(date).getMinutes();
    const period = hours >= 12 ? ' PM' : ' AM';
    const formattedHours = hours % 12 || 12; // Convert 24-hour time to 12-hour time
    const formattedMinutes = minutes.toString().padStart(2, '0'); // Ensure two digits for minutes

    return `${formattedHours}:${formattedMinutes}${period}`;
  } else if (diffInDays < 7) {
    // If the difference is within 7 days, format it as Xd
    return `${Math.floor(diffInDays)}d`;
  } else if (diffInDays < 30) {
    // If the difference is within 30 days, format it as Xw
    return `${Math.floor(diffInDays / 7)}w`;
  } else {
    // If the difference is more than 30 days, format it as Xm
    return `${Math.floor(diffInDays / 30)}m`;
  }
}



export const formatTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const formattedHours = hours > 0 ? `${hours}:` : '';
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
};


export const formatStoryTime = (timeInSeconds) => {
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  if(minutes < 1) {
    return `${seconds}s`
  } 
  return `${minutes}m ${seconds}s`;
};

export const timerOptions = [
        { value: '0s', key: 0, },
        { value: '3s', key: 3, },
        { value: '5s', key: 5 },
        { value: '10s', key: 10 },
    ]


export const formattedMedia = (mediaArray, mediaType) => {
  return mediaArray?.map((media) => {
    if (media.mime.startsWith('image') && mediaType === 0) {
      return {
        type: 'image',
        capturingMediaType: 'post',
        uri: media.path,
      };
    } else if(media.mime.startsWith('image') && mediaType === 1){
      return {
        type: 'image',
        capturingMediaType: 'story',
        uri: media.path,
      };
    }
    else if(media.mime.startsWith('video') && mediaType === 1) {
      return {
        type: 'video',
        capturingMediaType: 'story',
        uri: media.path,
        duration: media.duration, // Duration in ms (for videos)
      };
    }
    else if (media.mime.startsWith('video') && mediaType === 2) {
      return {
        type: 'video',
        capturingMediaType: 'highlight',
        uri: media.path,
        duration: media.duration, // Duration in ms (for videos)
      };
    }
  })
  
}


export const SkeletonCommonPropsDark = {
  colorMode: 'dark',
  transition: {
    type: 'timing',
    duration: 1500,
    loop: true, // Makes the shimmer loop continuously
    repeatReverse: true, // Keeps the shimmer going in one direction
  },
}

export const SkeletonCommonProps = {
  colorMode: 'light',
  transition: {
    type: 'timing',
    duration: 1500,
    loop: true, // Makes the shimmer loop continuously
    repeatReverse: true, // Keeps the shimmer going in one direction
  },
}

export const groupedStoriesByUserId = (stories) => {
  return stories.reduce((acc, post) => {
    const userId = post.uid
    if(!acc[userId]) {
      acc[userId] = []
    }
    acc[userId].push(post)
    return acc

}, {})
}

export const reactions = [
  {
    type: "reaction",
    emoji_code: ":rolling_on_the_floor_laughing:",
    custom: {},
    icon: "🤣",
  },
  {
    type: "reaction",
    emoji_code: ":like:",
    custom: {},
    icon: "👍",
  },
  {
    type: "reaction",
    emoji_code: ":rocket:",
    custom: {},
    icon: "🚀",
  },
  {
    type: "reaction",
    emoji_code: ":dislike:",
    custom: {},
    icon: "👎",
  },
  {
    type: "reaction",
    emoji_code: ":fireworks:",
    custom: {},
    icon: "🎉",
  },
  {
    type: "reaction",
    emoji_code: ":raised-hands:",
    custom: {},
    icon: "🙌",
  },
  {
    type: "raised-hand",
    emoji_code: ":raised-hand:",
    custom: {},
    icon: "✋",
  },
];