import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
} from "@ionic/react";
import LocationInput from "../components/LocationInput";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import React from "react";

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
                <h1>Welcome to In Between Us!</h1>
                <p>
                    Connect with friends and discover new places in between your
                    locations.
                </p>
                <form onSubmit={handleSubmit}>
                    <LocationInput
                        label="Person 1 Location"
                        onLocationChange={handlepersonAZipChange}
                    />
                    <LocationInput
                        label="Person 2 Location"
                        onLocationChange={handlepersonBZipChange}
                    />
                    <IonButton type="submit" expand="block">
                        Go!
                    </IonButton>
                </form>
            </IonContent>
        </IonPage>
    );
};

export default Home;
