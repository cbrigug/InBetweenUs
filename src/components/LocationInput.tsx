import { IonIcon, IonInput, IonItem, IonLabel } from "@ionic/react";
import { locateOutline } from "ionicons/icons";
import { useState } from "react";

interface LocationInputProps {
    label: string;
    onLocationChange: (location: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({
    label,
    onLocationChange,
}) => {
    const [location, setLocation] = useState("");

    const handleLocationChange = (e: CustomEvent) => {
        setLocation(e.detail.value);
        onLocationChange(e.detail.value);
    };

    return (
        <>
            <IonItem>
                <IonInput
                    label={label}
                    labelPlacement="floating"
                    type="text"
                    placeholder="Zip Code"
                    value={location}
                    onIonInput={handleLocationChange}
                    required
                />
                <IonIcon icon={locateOutline} slot="end" color="medium" />
            </IonItem>
        </>
    );
};

export default LocationInput;
