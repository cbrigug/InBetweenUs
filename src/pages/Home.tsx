import {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonGrid,
    IonButtons,
    IonIcon,
    IonText,
    IonButton,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import React from "react";
import PersonCard from "../components/Home/PersonCard/PersonCard";
import PersonModal, {
    FormDataType,
} from "../components/Home/PersonCard/PersonModal";
import PulsingCircle from "../components/Home/PulsingCircle";
import { personCircle } from "ionicons/icons";
import ProfileModal from "../components/Home/PersonCard/ProfileModal";
import Avatar from "../components/Avatar";

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

    // profile modal
    const [profile, setProfile] = useState<FormDataType | undefined>();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    useEffect(() => {
        const profile = localStorage.getItem("profile");
        if (profile) {
            setProfile(JSON.parse(profile));
        }
    }, [isModalOpen]);

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonText
                        style={{
                            paddingLeft: "calc(var(--ion-padding, 16px) * 0.5)",
                        }}
                    >
                        InBetween
                    </IonText>
                    <IonText color={"primary"}>Us</IonText>
                    <IonButtons slot="end">
                        <IonButton onClick={toggleModal}>
                            {profile ? (
                                <Avatar
                                    name={profile.name}
                                    size="32px"
                                    image={profile.photo ?? undefined}
                                    textSize="1rem"
                                />
                            ) : (
                                <IonIcon
                                    slot="icon-only"
                                    icon={personCircle}
                                    color="dark"
                                />
                            )}
                        </IonButton>
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
                <ProfileModal
                    isModalOpen={isModalOpen}
                    toggleModal={toggleModal}
                />
            </IonContent>
        </IonPage>
    );
};

export default Home;
