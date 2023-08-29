import {
    IonAvatar,
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
import React from "react";

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
                            <img src="https://ionicframework.com/docs/img/demos/avatar.svg" />
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
                        placeholder="e.g., John Doe"
                        label="Name"
                        required={true}
                    />
                </IonItem>
                <IonItem>
                    <IonInput
                        ref={input}
                        type="text"
                        placeholder="e.g., 123 Main Street"
                        label="Address"
                        required={true}
                    />
                    <IonIcon icon={locateOutline} slot="end" />
                </IonItem>
            </IonContent>
        </IonModal>
    );
};

export default AddPersonModal;
