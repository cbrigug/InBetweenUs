import {
    IonAvatar,
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
import React, { useState } from "react";
import ImportContact from "./ImportContact";
import { ContactPayload } from "@capacitor-community/contacts";

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

    return (
        <IonModal isOpen={isModalOpen} onDidDismiss={toggleModal} ref={modal}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => modal.current?.dismiss()}>
                            Cancel
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Add Person</IonTitle>
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
                        <IonAvatar style={{ height: "30%", width: "30%" }}>
                            <img
                                src={`${
                                    contact?.image?.base64String ??
                                    "https://ionicframework.com/docs/img/demos/avatar.svg"
                                }`}
                            />
                        </IonAvatar>
                    </IonRow>
                    <IonRow className="ion-justify-content-center">
                        <IonLabel color={"primary"}>Upload</IonLabel>
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
