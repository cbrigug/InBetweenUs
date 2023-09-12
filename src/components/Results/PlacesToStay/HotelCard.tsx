import React from 'react';
import PlaceToStayCard from './PlaceToStayCard';

interface HotelCardProps {}

const HotelCard: React.FC<HotelCardProps> = ({}) => {
  return (
    <PlaceToStayCard type='hotel' />
  );
}

export default HotelCard;