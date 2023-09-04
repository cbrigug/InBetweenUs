import {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonGrid,
    IonButtons,
    IonIcon,
    IonText,
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import React from "react";
import PersonCard from "../components/PersonCard/PersonCard";
import { FormDataType } from "../components/PersonCard/PersonModal";
import PulsingCircle from "../components/PulsingCircle";
import { personCircle } from "ionicons/icons";

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
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonText>InBetween</IonText>
                    <IonText color={"primary"}>Us</IonText>
                    <IonButtons slot="end">
                        <IonIcon icon={personCircle} />
                    </IonButtons>
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
                    {!!personA.name && !!personB.name && (
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
