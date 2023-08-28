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
    const [person1Zip, setPerson1Zip] = useState("");
    const [person2Zip, setPerson2Zip] = useState("");
    const history = useHistory();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        history.push("/results", {
            person1Zip,
            person2Zip,
        });
    };

    const handlePerson1ZipChange = (location: string) => {
        setPerson1Zip(location);
    };

    const handlePerson2ZipChange = (location: string) => {
        setPerson2Zip(location);
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
                        onLocationChange={handlePerson1ZipChange}
                    />
                    <LocationInput
                        label="Person 2 Location"
                        onLocationChange={handlePerson2ZipChange}
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
