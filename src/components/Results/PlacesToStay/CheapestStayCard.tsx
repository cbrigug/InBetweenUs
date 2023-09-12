import React from 'react';
import PlaceToStayCard from './PlaceToStayCard';

interface CheapestStayCardProps {}

const CheapestStayCard: React.FC<CheapestStayCardProps> = ({}) => {
  return (
    <PlaceToStayCard type='cheapest' />
  );
}

export default CheapestStayCard;