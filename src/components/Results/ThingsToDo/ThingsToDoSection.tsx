import {
    IonItem,
    IonText,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonSkeletonText,
} from "@ionic/react";
import { chevronForward } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { environment } from "../../../../environment.dev";
import { ShortCoords } from "../../../interfaces/City";
import { CapacitorHttp } from "@capacitor/core";
import ThingToDoCard from "./ThingToDoCard";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import MoreThingsToDoCard from "./MoreThingsToDoCard";
import { useHistory } from "react-router";

interface ThingsToDoSectionProps {
    cityName: string;
    coords: ShortCoords;
}

interface Place {
    id: string;
    name: string;
    info: string;
    xid: string;
    address: string;
    preview: {
        source: string;
        mime: string;
    };
}

const OPENTRIPMAP_API_KEY = environment.REACT_APP_OPENTRIPMAP_API_KEY;
const RADIUS = 24140.2; // 15 miles in meters

const ThingsToDoSection: React.FC<ThingsToDoSectionProps> = ({
    coords,
    cityName,
}) => {
    const [thingsToDo, setThingsToDo] = useState<any[]>([]);

    const history = useHistory();

    const navToThingsToDo = () => {
        history.push("/things-to-do", {
            cityName,
            coords,
        });
    };

    useEffect(() => {
        const fetchPlaceIds = async () => {
            const cachedPlaceIds = localStorage.getItem("thingsToDoPreviewIds");

            if (cachedPlaceIds) {
                return JSON.parse(cachedPlaceIds);
            }

            const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${RADIUS}&lon=${coords.lng}&lat=${coords.lat}&src_attr=wikidata&rate=3&limit=5&apikey=${OPENTRIPMAP_API_KEY}`;
            const response = await CapacitorHttp.get({ url });

            const placeIds = response.data.features.map(
                (place: any) => place.properties.xid
            );

            // Cache the fetched data in localStorage
            localStorage.setItem(
                "thingsToDoPreviewIds",
                JSON.stringify(placeIds)
            );

            return placeIds;
        };
        const fetchPlaceDetails = async (placeIds: string[]) => {
            const placeDetails: Place[] = [];

            const cachedPlaceDetails = localStorage.getItem(
                "thingsToDoPreviewDetails"
            );

            if (cachedPlaceDetails) {
                setThingsToDo(JSON.parse(cachedPlaceDetails));
                return;
            }

            for (const xid of placeIds) {
                const url = `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${OPENTRIPMAP_API_KEY}`;
                const response = await CapacitorHttp.get({ url });

                placeDetails.push(response.data);
            }

            // Cache the fetched data in localStorage
            localStorage.setItem(
                "thingsToDoPreviewDetails",
                JSON.stringify(placeDetails)
            );

            setThingsToDo(placeDetails);
        };

        fetchPlaceIds().then((placeIds) => {
            if (placeIds.length > 0) {
                fetchPlaceDetails(placeIds);
            }
        });
    }, [coords]);

    return (
        <>
            <IonItem
                lines="none"
                button={true}
                detail={false}
                onClick={navToThingsToDo}
            >
                <IonText>Things to&nbsp;</IonText>
                <IonText color={"primary"}>do</IonText>
                <IonIcon icon={chevronForward} slot="end" />
            </IonItem>

            {thingsToDo.length > 0 ? (
                <IonGrid className="ion-no-padding">
                    <IonRow
                        style={{
                            marginBottom:
                                "calc(var(--ion-margin, 16px) * 0.25)",
                        }}
                    >
                        <Swiper slidesPerView={2}>
                            {thingsToDo.map((thingToDo) => (
                                <SwiperSlide key={thingToDo.xid}>
                                    <ThingToDoCard thingToDo={thingToDo} />
                                </SwiperSlide>
                            ))}
                            <SwiperSlide>
                                <MoreThingsToDoCard
                                    navToThingsToDo={navToThingsToDo}
                                />
                            </SwiperSlide>
                        </Swiper>
                    </IonRow>
                </IonGrid>
            ) : (
                // Skeleton loading
                <IonGrid className="ion-no-padding">
                    <IonRow
                        style={{
                            marginBottom:
                                "calc(var(--ion-margin, 16px) * 0.25)",
                        }}
                    >
                        <IonCol size="6">
                            <IonSkeletonText
                                animated
                                style={{ width: "95%", height: "96px" }}
                            />
                        </IonCol>
                        <IonCol size="6">
                            <IonSkeletonText
                                animated
                                style={{ width: "100%", height: "96px" }}
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            )}
        </>
    );
};

export default ThingsToDoSection;
