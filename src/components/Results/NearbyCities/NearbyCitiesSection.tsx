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

interface NearbyCitiesSectionProps {
    cities: City[];
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
}) => {
    const classes = useStyles();
    const history = useHistory();

    const [isOpen, setIsOpen] = useState(false);

    const navToFindNearestCities = () => {
        history.push("/find-nearby-cities", {
            cities,
        });
    };

    return (
        <>
            <IonItem
                lines="none"
                onClick={() => setIsOpen(!isOpen)}
                button={true}
                detail={false}
            >
                <IonText>Find</IonText>
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
                ></IonRange>
            )}

            <IonGrid className="ion-no-padding">
                <IonRow className="ion-margin-top">
                    <Swiper slidesPerView={2}>
                        {cities.map((city) => (
                            <SwiperSlide key={city.title}>
                                <CityCard city={city} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </IonRow>
            </IonGrid>
        </>
    );
};

export default NearbyCitiesSection;
