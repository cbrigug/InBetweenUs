import {
    Contacts,
    ContactPayload,
    PostalAddressPayload,
} from "@capacitor-community/contacts";
import {
    IonFab,
    IonFabButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPopover,
    useIonToast,
} from "@ionic/react";
import { cloudUploadOutline } from "ionicons/icons";
import React from "react";
import { FormDataType } from "./PersonCard/PersonModal";

interface ImportContactProps {
    setContact: React.Dispatch<React.SetStateAction<ContactPayload | null>>;
    setProfile: React.Dispatch<React.SetStateAction<FormDataType | null>>;
}

const addressFields: (keyof PostalAddressPayload)[] = [
    "street",
    "city",
    "country",
    "postcode",
];

const ImportContact: React.FC<ImportContactProps> = ({ setContact, setProfile }) => {
    const [present] = useIonToast();
    const presentToast = (
        position: "top" | "middle" | "bottom",
        numFields?: number,
        message?: string
    ) => {
        present({
            message:
                message ||
                `Found ${numFields} ${numFields === 1 ? "field" : "fields"}`,
            duration: 1500,
            color: "dark",
            position: position,
        });
    };

    const retrieveContact = async () => {
        const projection = {
            name: true,
            image: true,
            postalAddresses: true,
        };

        try {
            const contact = (await Contacts.pickContact({ projection }))
                .contact;
            if (!contact) return;

            setContact(contact);
            let fieldsFound = contact.name ? 1 : 0;
            // otherwise count the number of other fields found
            if (contact.image) {
                fieldsFound++;
            }
            for (const prop of addressFields) {
                if (contact.postalAddresses?.[0][prop]) {
                    fieldsFound++;
                }
            }
            presentToast("bottom", fieldsFound);
        } catch (error) {
            console.error("Error picking contact:", error);
        }
    };

    const retrieveProfile = () => {
        const profile = localStorage.getItem("profile");
        if (profile) {
            const profileObj: FormDataType = JSON.parse(profile);
            setProfile(profileObj);
            presentToast("bottom", undefined, "Found profile");
        }
    };

    return (
        <IonFab
            slot="fixed"
            vertical="bottom"
            horizontal={"end"}
            style={{ padding: "calc(var(--ion-padding, 16px) * .25)" }}
        >
            <IonFabButton
                id="trigger-popover"
                style={{ height: "70px", width: "70px" }}
            >
                <IonIcon icon={cloudUploadOutline} size="large"></IonIcon>
            </IonFabButton>
            <IonPopover dismissOnSelect trigger="trigger-popover" side="top">
                <IonList>
                    <IonItem button onClick={retrieveContact}>
                        <IonLabel>Import Contact</IonLabel>
                    </IonItem>
                    {localStorage.getItem("profile") && (
                        <IonItem button onClick={retrieveProfile}>
                            <IonLabel>Import Profile</IonLabel>
                        </IonItem>
                    )}
                </IonList>
            </IonPopover>
        </IonFab>
    );
};

export default ImportContact;
