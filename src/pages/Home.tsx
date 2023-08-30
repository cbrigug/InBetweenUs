import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import React from "react";
import AddPersonCard from "../components/PersonCard/AddPersonCard";
import PersonCard from "../components/PersonCard/PersonCard";

const Home = () => {
    const [personAZip, setpersonAZip] = useState("");
    const [personBZip, setpersonBZip] = useState("");
    const history = useHistory();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        history.push("/results", {
            personAZip,
            personBZip,
        });
    };

    const handlepersonAZipChange = (location: string) => {
        setpersonAZip(location);
    };

    const handlepersonBZipChange = (location: string) => {
        setpersonBZip(location);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>In Between Us</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonGrid style={{ height: "100%" }}>
                    <PersonCard isPersonA={true} />
                    <PersonCard isPersonA={false} />
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Home;
