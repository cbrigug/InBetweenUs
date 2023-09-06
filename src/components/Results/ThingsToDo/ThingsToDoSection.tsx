import {
    IonItem,
    IonText,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
} from "@ionic/react";
import { chevronForward } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { environment } from "../../../../environment.dev";
import { ShortCoords } from "../../../interfaces/City";
import { CapacitorHttp } from "@capacitor/core";
import ThingToDoCard from "./ThingToDoCard";

interface ThingsToDoSectionProps {
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

const mockData = [
    {
        xid: "Q7619108",
        name: "Stonebraker and Harbaugh–Shafer Building",
        address: {
            road: "Old National Pike",
            town: "Middletown",
            house: "Dempsey's Grille",
            state: "Maryland",
            county: "Frederick County",
            country: "United States of America",
            postcode: "21769",
            country_code: "us",
            house_number: "116",
        },
        rate: "3h",
        wikidata: "Q7619108",
        kinds: "historic_architecture,architecture,interesting_places,other_buildings_and_structures",
        sources: {
            geometry: "wikidata",
            attributes: ["wikidata"],
        },
        otm: "https://opentripmap.com/en/card/Q7619108",
        wikipedia:
            "https://en.wikipedia.org/wiki/Stonebraker%20and%20Harbaugh%E2%80%93Shafer%20Building",
        image: "https://commons.wikimedia.org/wiki/File:Stonebraker_and_Harbaugh%2C_Shafer_Building.jpg",
        preview: {
            source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Stonebraker_and_Harbaugh%2C_Shafer_Building.jpg/400px-Stonebraker_and_Harbaugh%2C_Shafer_Building.jpg",
            height: 289,
            width: 400,
        },
        wikipedia_extracts: {
            title: "en:Stonebraker and Harbaugh–Shafer Building",
            text: "The Stonebraker and Harbaugh–Shafer Building in Middletown, Maryland was built circa 1830 with a residential section to the east and a commercial section to the west. The Federal style building incorporates Greek Revival detailing in the interior.The Stonebraker and Harbaugh–Shafer Building was listed on the National Register of Historic Places in 2002. It is included in the Middletown Historic District.Stonebraker & Harbaugh–Shafer Building, Frederick County, including photo in 2001, at Maryland Historical Trust",
            html: "<p>The <b>Stonebraker and Harbaugh–Shafer Building</b> in Middletown, Maryland was built <i>circa</i> 1830 with a residential section to the east and a commercial section to the west. The Federal style building incorporates Greek Revival detailing in the interior.</p><p>The Stonebraker and Harbaugh–Shafer Building was listed on the National Register of Historic Places in 2002. It is included in the Middletown Historic District.</p><ul><li>Stonebraker &amp; Harbaugh–Shafer Building, Frederick County, including photo in 2001, at Maryland Historical Trust</li></ul>",
        },
        point: {
            lon: -77.5469970703125,
            lat: 39.44380187988281,
        },
    },
    {
        xid: "N158374668",
        name: "Middletown",
        address: {
            road: "Old National Pike",
            town: "Middletown",
            house: "Dempsey's Grille",
            state: "Maryland",
            county: "Frederick County",
            country: "United States of America",
            postcode: "21769",
            country_code: "us",
            house_number: "116",
        },
        rate: "3h",
        osm: "node/158374668",
        wikidata: "Q6842102",
        kinds: "historic,historical_places,interesting_places,historic_districts,historic_settlements",
        sources: {
            geometry: "osm",
            attributes: ["osm", "wikidata"],
        },
        otm: "https://opentripmap.com/en/card/N158374668",
        wikipedia:
            "https://en.wikipedia.org/wiki/Middletown%20Historic%20District%20%28Middletown%2C%20Maryland%29",
        image: "https://commons.wikimedia.org/wiki/File:Middletown%2C_Maryland_historic_district.jpg",
        preview: {
            source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Middletown%2C_Maryland_historic_district.jpg/266px-Middletown%2C_Maryland_historic_district.jpg",
            height: 289,
            width: 400,
        },
        wikipedia_extracts: {
            title: "en:Middletown Historic District (Middletown, Maryland)",
            text: "The Middletown Historic District comprises the historic center of Middletown, Maryland. Middletown became the chief community in the Middletown Valley in the late 18th century, retaining its importance until the 1930s, when the expanding influence of Frederick, Maryland, the construction of a bypass on US 40 and the abandonment of the Hagerstown and Frederick Railway produced a gradual decline. The historic district preserves many mid-19th-century buildings in the central downtown area. To the east, the district includes early 20th-century houses built along the trolley right-of-way, forming a streetcar suburb. The Airview Historic District includes a related area of early 20th century development to the east of town along the National Pike, separated from the main district by a section of newer development.",
            html: "<p>The <b>Middletown Historic District</b> comprises the historic center of Middletown, Maryland. Middletown became the chief community in the Middletown Valley in the late 18th century, retaining its importance until the 1930s, when the expanding influence of Frederick, Maryland, the construction of a bypass on US 40 and the abandonment of the Hagerstown and Frederick Railway produced a gradual decline. The historic district preserves many mid-19th-century buildings in the central downtown area. To the east, the district includes early 20th-century houses built along the trolley right-of-way, forming a streetcar suburb. The Airview Historic District includes a related area of early 20th century development to the east of town along the National Pike, separated from the main district by a section of newer development.</p>",
        },
        point: {
            lon: -77.54540252685547,
            lat: 39.443756103515625,
        },
    },
];

const OPENTRIPMAP_API_KEY = environment.REACT_APP_OPENTRIPMAP_API_KEY;
const RADIUS = 24140.2; // 15 miles in meters

const ThingsToDoSection: React.FC<ThingsToDoSectionProps> = ({ coords }) => {
    const [thingsToDo, setThingsToDo] = useState<any[]>(mockData);

    // useEffect(() => {
    //     const fetchPlaceIds = async () => {
    //         const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${RADIUS}&lon=${coords.lng}&lat=${coords.lat}&src_attr=wikidata&rate=3&limit=2&apikey=${OPENTRIPMAP_API_KEY}`;
    //         const response = await CapacitorHttp.get({ url });

    //         return response.data.features.map(
    //             (place: any) => place.properties.xid
    //         );
    //     };
    //     const fetchPlaceDetails = async (placeIds: string[]) => {
    //         const placeDetails: Place[] = [];
    //         for (const xid of placeIds) {
    //             const url = `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${OPENTRIPMAP_API_KEY}`;
    //             const response = await CapacitorHttp.get({ url });
    //             placeDetails.push(response.data);
    //         }
    //         console.log(placeDetails);
    //         setThingsToDo(placeDetails);
    //     };

    //     fetchPlaceIds().then((placeIds) => {
    //         if (placeIds.length > 0) {
    //             fetchPlaceDetails(placeIds);
    //         }
    //     });
    // }, [coords]);

    return (
        <>
            <IonItem lines="none">
                <IonText>Things to&nbsp;</IonText>
                <IonText color={"primary"}>do</IonText>
                <IonIcon icon={chevronForward} slot="end" />
            </IonItem>

            <IonGrid className="ion-no-padding">
                <IonRow className="ion-margin-top">
                    {thingsToDo.map((thingToDo) => (
                        <IonCol size="6" key={thingToDo.xid}>
                            <ThingToDoCard thingToDo={thingToDo} />
                        </IonCol>
                    ))}
                </IonRow>
            </IonGrid>
        </>
    );
};

export default ThingsToDoSection;
