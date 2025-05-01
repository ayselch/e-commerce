import { Image } from 'expo-image';
import React, { useState } from 'react';

const ExpoImage = ({ source, style, contentFit = 'cover', ...rest }) => {
  const [hasError, setHasError] = useState(false);

  const fallbackImage = require('../assets/images/nectarIcon.png');

  return (
    <Image
      source={hasError ? fallbackImage : source}
      style={style}
      contentFit={contentFit} 
      transition={300}
      onError={() => setHasError(true)}
      {...rest}
    />
  );
};

export default ExpoImage;
