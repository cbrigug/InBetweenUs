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

const defaultFormData: FormDataType = {
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    coordinates: {
        latitude: 0,
        longitude: 0,
    },
    photo: null,
};

const Home: React.FC = () => {
    const [personA, setPersonA] = useState<FormDataType>(defaultFormData);
    const [personB, setPersonB] = useState<FormDataType>(defaultFormData);
    const history = useHistory();

    const handleSubmit = () => {
        history.push("/results", {
            personA,
            personB,
        });
    };

    const handlePersonChange = (formData: FormDataType, isPersonA: boolean) => {
        if (isPersonA) {
            setPersonA(formData);
        } else {
            setPersonB(formData);
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
                    {!!personA && !!personB && (
                        <PulsingCircle navToResults={handleSubmit} />
                    )}
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
