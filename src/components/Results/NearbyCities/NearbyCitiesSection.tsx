import {
    IonItem,
    IonText,
    IonIcon,
    IonGrid,
    IonRow,
    IonRange,
} from "@ionic/react";
import { chevronDown, chevronUp } from "ionicons/icons";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import MoreThingsToDoCard from "../ThingsToDo/MoreThingsToDoCard";
import { City } from "../../../interfaces/City";
import { useHistory } from "react-router";
import CityCard from "./CityCard";
import { createUseStyles } from "react-jss";
import { FormDataType } from "../../Home/PersonCard/PersonModal";

interface NearbyCitiesSectionProps {
    personA: FormDataType;
    personB: FormDataType;
    cities: City[];
    setFlexibility: (flexibility: number) => void;
    setCurrentCity: (city: City) => void;
}

const useStyles = createUseStyles({
    rotateForward: {
        animation: "$rotateForward 0.3s ease", // Reference the keyframes animation
    },
    rotateBack: {
        animation: "$rotateBack 0.3s ease", // Reference the keyframes animation
    },
    "@keyframes rotateForward": {
        "0%": {
            transform: "rotate(-180deg)",
        },
        "100%": {
            transform: "rotate(0deg)",
        },
    },
    "@keyframes rotateBack": {
        "0%": {
            transform: "rotate(180deg)",
        },
        "100%": {
            transform: "rotate(0deg)",
        },
    },
});

const NearbyCitiesSection: React.FC<NearbyCitiesSectionProps> = ({
    cities,
    personA,
    personB,
    setFlexibility,
    setCurrentCity,
}) => {
    const classes = useStyles();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <IonItem
                lines="none"
                onClick={() => setIsOpen(!isOpen)}
                button={true}
                detail={false}
            >
                <IonText>Central</IonText>
                <IonText color={"primary"}>&nbsp;nearby&nbsp;</IonText>
                <IonText>cities</IonText>
                <IonIcon
                    icon={isOpen ? chevronDown : chevronUp}
                    slot="end"
                    className={
                        isOpen ? classes.rotateForward : classes.rotateBack
                    }
                />
            </IonItem>

            {isOpen && (
                <IonRange
                    ticks
                    snaps
                    min={0}
                    max={3}
                    className="ion-padding-horizontal"
                    onIonChange={(e) => {
                        setFlexibility(e.detail.value as number);
                    }}
                ></IonRange>
            )}

            <IonGrid className="ion-no-padding">
                <IonRow className="ion-margin-bottom">
                    <Swiper slidesPerView={2}>
                        {cities.map((city) => (
                            <SwiperSlide key={city.title}>
                                <CityCard
                                    personA={personA}
                                    personB={personB}
                                    city={city}
                                    setCurrentCity={setCurrentCity}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </IonRow>
            </IonGrid>
        </>
    );
};

export default NearbyCitiesSection;
