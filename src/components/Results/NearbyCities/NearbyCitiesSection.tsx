import { IonItem, IonText, IonIcon, IonGrid, IonRow } from "@ionic/react";
import { chevronForward } from "ionicons/icons";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import MoreThingsToDoCard from "../ThingsToDo/MoreThingsToDoCard";
import { City } from "../../../interfaces/City";
import { useHistory } from "react-router";
import CityCard from "./CityCard";

interface NearbyCitiesSectionProps {
    cities: City[];
}

const NearbyCitiesSection: React.FC<NearbyCitiesSectionProps> = ({
    cities,
}) => {
    const history = useHistory();

    const navToFindNearestCities = () => {
        history.push("/find-nearby-cities", {
            cities,
        });
    };

    return (
        <>
            <IonItem
                lines="none"
                button={true}
                detail={false}
                onClick={navToFindNearestCities}
            >
                <IonText>Find</IonText>
                <IonText color={"primary"}>&nbsp;nearby&nbsp;</IonText>
                <IonText>cities</IonText>
                <IonIcon icon={chevronForward} slot="end" />
            </IonItem>

            <IonGrid className="ion-no-padding">
                <IonRow className="ion-margin-top">
                    <Swiper slidesPerView={2}>
                        {cities.map((city) => (
                            <SwiperSlide key={city.title}>
                                <CityCard city={city} />
                            </SwiperSlide>
                        ))}
                        <SwiperSlide>
                            <MoreThingsToDoCard
                                navToThingsToDo={navToFindNearestCities}
                            />
                        </SwiperSlide>
                    </Swiper>
                </IonRow>
            </IonGrid>
        </>
    );
};

export default NearbyCitiesSection;
