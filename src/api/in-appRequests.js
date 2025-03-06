import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';


const authenticateWithSpotify = async () => {
    // Your authentication logic here
    // This function should obtain a new access token from Spotify
    // and store it in AsyncStorage along with its expiration time
    try {
      // Make a POST request to Spotify API to obtain access token
      const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        params: {
          grant_type: 'client_credentials',
          client_id: '596db360cb46485d89e712b4ba2d131c',
          client_secret: '52194691bf784d7a8e077a1bdfbdc19e',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      // Set our spotify access token and expiration Date to our AsyncStorage to safe keep
      await AsyncStorage.setItem('spotify_access_token', response.data.access_token)
      const expirationDate = new Date(response.data.expires_in).getTime()
      await AsyncStorage.setItem('spotify_token_expiration', expirationDate.toString())
      // Return the access token
      return response.data.access_token;
    } catch (error) {
      console.error('Error authenticating with Spotify:', error);
      throw error;
    }
};

export const useSpotifyAuth = async () => {
      // If authentication hasn't been performed before, authenticate now
      await authenticateWithSpotify();
      await AsyncStorage.setItem('spotify_authenticated', 'true');
      // const authenticated = await AsyncStorage.getItem('spotify_authenticated');
      
      // if (authenticated === 'true') {
      //   console.log('Spotify Auth Status:', true );
      // } else {
      //   console.log('Spotify Auth Status:', false );
      // }
}

export const searchSong = async (query) => {
    const accessToken = await AsyncStorage.getItem('spotify_access_token')
    try {
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const tracksWithPreview = response.data.tracks.items.filter(track => track.preview_url);
        if(response.data.tracks && tracksWithPreview.length > 0){
          const tracks = tracksWithPreview.map((track) => {
            const songName = track.name;
            const artistName = track.artists.map(artist => artist.name).join(', ');
            const albumImageUrl = track.album.images[0].url
            const popularity = track.popularity
            const fullTrackUri = track.uri
            const previewURL = track.preview_url
            return {songName, artistName, albumImageUrl, popularity, fullTrackUri, previewURL}
          })
          return tracks
        } else {
          return response.data.tracks;
        }
    } catch (error) {
        console.error('Error searching for song:', error);
    }
};
