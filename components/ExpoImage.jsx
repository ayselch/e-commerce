import { Image } from 'expo-image';
import React from 'react';

const ExpoImage = ({ source, style, contentFit = 'cover', ...rest }) => {
  return (
    <Image
      source={source}
      style={style}
      contentFit={contentFit} 
      transition={300} 
      {...rest}
    />
  );
};

export default ExpoImage;
