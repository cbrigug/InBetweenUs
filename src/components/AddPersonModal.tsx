import {
    IonAvatar,
    IonBadge,
    IonButton,
    IonButtons,
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
import ImportContact from "./ImportContact";
import { ContactPayload } from "@capacitor-community/contacts";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

interface AddPersonModalProps {
    isModalOpen: boolean;
    toggleModal: () => void;
    confirm: () => void;
    input: React.RefObject<HTMLIonInputElement>;
    modal: React.RefObject<HTMLIonModalElement>;
}

const AddPersonModal: React.FC<AddPersonModalProps> = ({
    isModalOpen,
    toggleModal,
    confirm,
    input,
    modal,
}) => {
    const [contact, setContact] = useState<ContactPayload | null>(null);
    const [customPhoto, setCustomPhoto] = useState<string | null>(null);

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
        setCustomPhoto(imageUrl ?? null);
    };

    useEffect(() => {
        if (contact) {
            setCustomPhoto(contact.image?.base64String ?? null);
        }
    }, [contact]);

    return (
        <IonModal isOpen={isModalOpen} onDidDismiss={toggleModal} ref={modal}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => modal.current?.dismiss()}>
                            Cancel
                        </IonButton>
                    </IonButtons>
                    <IonTitle className="ion-text-center">Add Person</IonTitle>
                    <IonButtons slot="end">
                        <IonButton strong={true} onClick={() => confirm()}>
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
                                    customPhoto ??
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
                        ref={input}
                        type="text"
                        labelPlacement="floating"
                        label="Name"
                        required={true}
                        value={contact?.name?.display ?? ""}
                    />
                </IonItem>
                <IonItem>
                    <IonInput
                        ref={input}
                        type="text"
                        labelPlacement="floating"
                        label="Address"
                        required={true}
                        value={contact?.postalAddresses?.[0].street ?? ""}
                    />
                    <IonIcon icon={locateOutline} slot="end" />
                </IonItem>
                <IonItem>
                    <IonInput
                        ref={input}
                        type="text"
                        labelPlacement="floating"
                        label="City"
                        required={true}
                        value={contact?.postalAddresses?.[0].city ?? ""}
                    />
                </IonItem>
                <IonItem>
                    <IonInput
                        ref={input}
                        type="text"
                        labelPlacement="floating"
                        label="Country"
                        required={true}
                        value={contact?.postalAddresses?.[0].country ?? ""}
                    />
                </IonItem>
                <IonItem>
                    <IonInput
                        ref={input}
                        type="text"
                        labelPlacement="floating"
                        label="Zip Code"
                        required={true}
                        value={contact?.postalAddresses?.[0].postcode ?? ""}
                    />
                </IonItem>
            </IonContent>
            <ImportContact setContact={setContact} />
        </IonModal>
    );
};

export default AddPersonModal;
