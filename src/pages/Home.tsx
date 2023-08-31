import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonGrid,
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import React from "react";
import PersonCard from "../components/PersonCard/PersonCard";
import { FormDataType } from "../components/PersonCard/PersonModal";
import PulsingCircle from "../components/PulsingCircle";

const Home: React.FC = () => {
    const [personA, setPersonA] = useState("");
    const [personB, setPersonB] = useState("");
    const history = useHistory();

    const handleSubmit = () => {
        console.log(personA, personB)

        history.push("/results", {
            personAZip: personA,
            personBZip: personB,
        });
    };

    const handlePersonChange = (formData: FormDataType, isPersonA: boolean) => {
        const personData = formData;
        if (isPersonA) {
            setPersonA(personData.zipCode);
        } else {
            setPersonB(personData.zipCode);
        }
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
                    <PersonCard
                        isPersonA={true}
                        setPerson={(formData) =>
                            handlePersonChange(formData, true)
                        }
                    />
                    {!!personA && !!personB && <PulsingCircle navToResults={handleSubmit} />}
                    <PersonCard
                        isPersonA={false}
                        setPerson={(formData) =>
                            handlePersonChange(formData, false)
                        }
                    />
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Home;
