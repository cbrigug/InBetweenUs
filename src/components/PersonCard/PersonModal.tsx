import {
    IonAvatar,
    IonBadge,
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonModal,
    IonRow,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { locateOutline } from "ionicons/icons";
import React, { useState, useEffect } from "react";
import ImportContact from "../ImportContact";
import { ContactPayload } from "@capacitor-community/contacts";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export type FormDataType = {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    photo: string | null;
};

export interface PersonModalProps {
    isModalOpen: boolean;
    toggleModal: () => void;
    confirm: (formData: FormDataType) => void;
    modal: React.RefObject<HTMLIonModalElement>;
    isDetails: boolean;
    formData?: FormDataType;
}

const PersonModal: React.FC<PersonModalProps> = ({
    isModalOpen,
    toggleModal,
    confirm,
    modal,
    isDetails,
    formData,
}) => {
    const [contact, setContact] = useState<ContactPayload | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);

    // Form fields
    const [name, setName] = useState(formData?.name ?? "");
    const [address, setAddress] = useState(formData?.address ?? "");
    const [city, setCity] = useState(formData?.city ?? "");
    const [state, setState] = useState(formData?.state ?? "");
    const [zipCode, setZipCode] = useState(formData?.zipCode ?? "");
    const [country, setCountry] = useState(formData?.country ?? "");
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        setIsFormValid(
            !!name && !!address && !!city && !!state && !!zipCode && !!country
        );
    }, [name, address, city, state, zipCode, country]);

    const handleCancel = () => {
        // reset to initial state values
        setName(formData?.name ?? "");
        setAddress(formData?.address ?? "");
        setCity(formData?.city ?? "");
        setState(formData?.state ?? "");
        setZipCode(formData?.zipCode ?? "");
        setCountry(formData?.country ?? "");
        setPhoto(formData?.photo ?? null);

        modal.current?.dismiss();
    }

    const handleConfirm = () => {
        if (!isFormValid) return;

        const formData: FormDataType = {
            name,
            address,
            city,
            state,
            zipCode,
            country,
            photo,
        };
        confirm(formData);
    };

    const getCameraPhoto = async () => {
        const photo = await Camera.getPhoto({
            allowEditing: false,
            resultType: CameraResultType.Base64,
            saveToGallery: false,
            source: CameraSource.Prompt,
        });

        // baseUrl to be used in an <img> element to display the image
        // we need to include the file extension here as well
        const imageUrl = `data:image/${photo.format};base64,${photo.base64String}`;
        setPhoto(imageUrl ?? null);
    };

    useEffect(() => {
        if (contact) {
            setPhoto(contact.image?.base64String ?? null);
            setName(contact.name?.display ?? "");
            setAddress(contact.postalAddresses?.[0]?.street ?? "");
            setCity(contact.postalAddresses?.[0]?.city ?? "");
            setState(contact.postalAddresses?.[0]?.region ?? "");
            setZipCode(contact.postalAddresses?.[0]?.postcode ?? "");
            setCountry(contact.postalAddresses?.[0]?.country ?? "");
        }
    }, [contact]);

    return (
        <IonModal isOpen={isModalOpen} onDidDismiss={toggleModal} ref={modal}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={handleCancel}>
                            Cancel
                        </IonButton>
                    </IonButtons>
                    <IonTitle className="ion-text-center">
                        {isDetails ? "Edit Person" : "Add Person"}
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton
                            strong={true}
                            onClick={handleConfirm}
                            disabled={!isFormValid}
                        >
                            Confirm
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow className="ion-justify-content-center">
                        <IonAvatar
                            style={{
                                height: "75px",
                                width: "75px",
                                boxShadow:
                                    "0px 5px 10px 0px rgba(0, 0, 0, 0.5)",
                            }}
                            onClick={getCameraPhoto}
                        >
                            <img
                                src={`${
                                    photo ??
                                    "https://ionicframework.com/docs/img/demos/avatar.svg"
                                }`}
                            />
                        </IonAvatar>
                    </IonRow>
                    <IonRow className="ion-justify-content-center">
                        <IonBadge
                            color={"secondary"}
                            style={{ marginTop: "6px" }}
                        >
                            <IonLabel onClick={getCameraPhoto}>Upload</IonLabel>
                        </IonBadge>
                    </IonRow>
                </IonGrid>
                <IonItem>
                    <IonInput
                        type="text"
                        labelPlacement="floating"
                        label="Name"
                        value={name}
                        placeholder="required"
                        onIonInput={(e) => setName(e.target.value as string)}
                    />
                </IonItem>
                <IonItem>
                    <IonInput
                        type="text"
                        labelPlacement="floating"
                        label="Address"
                        value={address}
                        placeholder="required"
                        onIonInput={(e) => setAddress(e.target.value as string)}
                    />
                    <IonIcon icon={locateOutline} slot="end" />
                </IonItem>
                <IonGrid className="ion-no-padding">
                    <IonRow>
                        <IonCol size="8">
                            <IonItem>
                                <IonInput
                                    type="text"
                                    labelPlacement="floating"
                                    label="City"
                                    value={city}
                                    placeholder="required"
                                    onIonInput={(e) =>
                                        setCity(e.target.value as string)
                                    }
                                />
                            </IonItem>
                        </IonCol>
                        <IonCol size="4">
                            <IonItem>
                                <IonInput
                                    type="text"
                                    labelPlacement="floating"
                                    label="State"
                                    value={state}
                                    placeholder="required"
                                    onIonInput={(e) =>
                                        setState(e.target.value as string)
                                    }
                                />
                            </IonItem>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonItem>
                    <IonInput
                        type="text"
                        labelPlacement="floating"
                        label="Zip Code"
                        value={zipCode}
                        placeholder="required"
                        onIonInput={(e) => setZipCode(e.target.value as string)}
                    />
                </IonItem>
                <IonItem>
                    <IonInput
                        type="text"
                        labelPlacement="floating"
                        label="Country"
                        value={country}
                        placeholder="required"
                        onIonInput={(e) => setCountry(e.target.value as string)}
                    />
                </IonItem>
            </IonContent>
            <ImportContact setContact={setContact} />
        </IonModal>
    );
};

export default PersonModal;
