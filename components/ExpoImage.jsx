import { Image } from 'expo-image';
import React, { useState } from 'react';

const defaultImage = require('../assets/images/nectarIcon.png');

const ExpoImage = ({ source, style, contentFit = 'cover', placeholder = defaultImage, ...rest }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <Image
      source={hasError ? placeholder : source}
      style={style}
      contentFit={contentFit}
      transition={300}
      onError={handleError}
      {...rest}
    />
  );
};

export default ExpoImage;
