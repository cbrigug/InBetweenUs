import React from "react";
import { City } from "../../../interfaces/City";

interface CityCardProps {
    city: City;
}

const CityCard: React.FC<CityCardProps> = ({ city }) => {
    return <div>{city.title}</div>;
};

export default CityCard;
