import {
    Contacts,
    ContactPayload,
    PostalAddressPayload,
} from "@capacitor-community/contacts";
import { IonFab, IonFabButton, IonIcon, useIonToast } from "@ionic/react";
import { cloudUploadOutline } from "ionicons/icons";
import React from "react";

interface ImportContactProps {
    setContact: React.Dispatch<React.SetStateAction<ContactPayload | null>>;
}

const addressFields: (keyof PostalAddressPayload)[] = [
    "street",
    "city",
    "country",
    "postcode",
];

const ImportContact: React.FC<ImportContactProps> = ({ setContact }) => {
    const [present] = useIonToast();
    const presentToast = (
        position: "top" | "middle" | "bottom",
        numFields: number
    ) => {
        present({
            message: `Found ${numFields} ${
                numFields === 1 ? "field" : "fields"
            }`,
            duration: 1000,
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

    return (
        <IonFab
            slot="fixed"
            vertical="bottom"
            horizontal={"end"}
            style={{ padding: "calc(var(--ion-padding, 16px) * .25)" }}
        >
            <IonFabButton
                onClick={retrieveContact}
                style={{ height: "70px", width: "70px" }}
            >
                <IonIcon icon={cloudUploadOutline} size="large"></IonIcon>
            </IonFabButton>
        </IonFab>
    );
};

export default ImportContact;
