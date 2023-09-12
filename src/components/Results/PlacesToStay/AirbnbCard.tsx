import React from 'react';
import PlaceToStayCard from './PlaceToStayCard';

interface AirbnbCardProps {}

const AirbnbCard: React.FC<AirbnbCardProps> = ({}) => {
  return (
    <PlaceToStayCard type='airbnb' />
  );
}

export default AirbnbCard;