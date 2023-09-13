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
    IonText,
    IonTitle,
    IonToolbar,
    useIonToast,
} from "@ionic/react";
import { checkmark, checkmarkCircle, locateOutline } from "ionicons/icons";
import React, { useState, useEffect } from "react";
import ImportContact from "../ImportContact";
import { ContactPayload } from "@capacitor-community/contacts";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { environment } from "../../../../environment.dev";
import { Geolocation } from "@capacitor/geolocation";
import { CapacitorHttp } from "@capacitor/core";
import { Coordinates } from "../../../utils/distanceUtils";
import { capitalize } from "../../../utils/stringUtils";

export type FormDataType = {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    photo: string | null;
    coordinates: Coordinates;
};

export interface PersonModalProps {
    isModalOpen: boolean;
    toggleModal: () => void;
    confirm: (formData: FormDataType) => void;
    modal: React.RefObject<HTMLIonModalElement>;
    type: "add" | "edit" | "profile";
    formData?: FormDataType;
}

const GOOGLE_API_KEY = environment.REACT_APP_GOOGLE_API_KEY;

const getAddressComponent = (data: any, type: string) => {
    const addressComponents = data.results[0].address_components;
    return (
        addressComponents.find((component: { types: string }) =>
            component.types.includes(type)
        )?.short_name || ""
    );
};

const PersonModal: React.FC<PersonModalProps> = ({
    isModalOpen,
    toggleModal,
    confirm,
    modal,
    type,
    formData,
}) => {
    const [contact, setContact] = useState<ContactPayload | null>(null);
    const [profile, setProfile] = useState<FormDataType | null>(null);
    const [present] = useIonToast();

    // Form fields
    const [photo, setPhoto] = useState<string | null>(formData?.photo ?? null);
    const [name, setName] = useState(formData?.name ?? "");
    const [address, setAddress] = useState(formData?.address ?? "");
    const [city, setCity] = useState(formData?.city ?? "");
    const [state, setState] = useState(formData?.state ?? "");
    const [zipCode, setZipCode] = useState(formData?.zipCode ?? "");
    const [country, setCountry] = useState(formData?.country ?? "");
    const [isFormValid, setIsFormValid] = useState(false);

    const [coords, setCoords] = useState<Coordinates>({
        latitude: 0,
        longitude: 0,
    });

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
    };

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
            coordinates: coords,
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

    const presentToast = (
        position: "top" | "middle" | "bottom",
        message: string,
        color: string,
        duration?: number
    ) => {
        present({
            message: message,
            duration: duration ?? 500,
            color: color,
            position: position,
        });
    };

    const getCurrentLocation = async () => {
        try {
            const coordinates = await Geolocation.getCurrentPosition();

            const lat = coordinates.coords.latitude;
            const lng = coordinates.coords.longitude;

            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
            const options = {
                url,
            };
            const response = await CapacitorHttp.get(options);
            const data = response.data;

            const address = `${getAddressComponent(
                data,
                "street_number"
            )} ${getAddressComponent(data, "route")}`;
            const city = getAddressComponent(data, "locality");
            const state = getAddressComponent(
                data,
                "administrative_area_level_1"
            );
            const zipCode = getAddressComponent(data, "postal_code");
            const country = getAddressComponent(data, "country");

            setAddress(address);
            setCity(city);
            setState(state);
            setZipCode(zipCode);
            setCountry(country);

            setCoords({
                latitude: data.results[0].geometry.location.lat,
                longitude: data.results[0].geometry.location.lng,
            });

            presentToast("bottom", "Location found", "dark");
        } catch (error) {
            console.error("Error getting location:", error);
            presentToast("bottom", "Error getting location", "danger");
        }
    };

    const handleAddressAutoComplete = async (address: string) => {
        setAddress(address);

        if (zipCode.length < 5) return;

        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address},${zipCode}&key=${GOOGLE_API_KEY}`;
            const options = {
                url,
            };
            const response = await CapacitorHttp.get(options);
            const data = response.data;
            if (data.results[0].partial_match) throw new Error();

            const newAddress = `${getAddressComponent(
                data,
                "street_number"
            )} ${getAddressComponent(data, "route")}`;
            const city = getAddressComponent(data, "locality");
            const state = getAddressComponent(
                data,
                "administrative_area_level_1"
            );
            const country = getAddressComponent(data, "country");

            setAddress(newAddress);
            setCity(city);
            setState(state);
            setCountry(country);

            setCoords({
                latitude: data.results[0].geometry.location.lat,
                longitude: data.results[0].geometry.location.lng,
            });

            presentToast("bottom", "Address found", "dark");
        } catch (error) {
            console.error("Error getting location:", error);
            presentToast(
                "bottom",
                "Location not found, check address/zip code",
                "danger",
                2000
            );
        }
    };

    const handleZipCodeAutoComplete = async (zipCode: string) => {
        setZipCode(zipCode);

        if (zipCode.length < 5 || address.length === 0) return;

        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address},${zipCode}&key=${GOOGLE_API_KEY}`;
            const options = {
                url,
            };
            const response = await CapacitorHttp.get(options);
            const data = response.data;
            if (data.results[0].partial_match) throw new Error();

            const newAddress = `${getAddressComponent(
                data,
                "street_number"
            )} ${getAddressComponent(data, "route")}`;
            const city = getAddressComponent(data, "locality");
            const state = getAddressComponent(
                data,
                "administrative_area_level_1"
            );
            const country = getAddressComponent(data, "country");

            setAddress(newAddress);
            setCity(city);
            setState(state);
            setCountry(country);

            setCoords({
                latitude: data.results[0].geometry.location.lat,
                longitude: data.results[0].geometry.location.lng,
            });

            presentToast("bottom", "Address found", "dark");
        } catch (error) {
            console.error("Error getting location:", error);
            presentToast(
                "bottom",
                "Location not found, check address/zip code",
                "danger",
                2000
            );
        }
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

    const resetForm = (type: FormDataType) => {
        setPhoto(type.photo ?? null);
        setName(type.name);
        setAddress(type.address);
        setCity(type.city);
        setState(type.state);
        setZipCode(type.zipCode);
        setCountry(type.country);
    };

    // The formData const here is for when we open up the user profile modal,
    // we want the form to be pre-filled with the profile data if it exists.
    // The profile const is for when we are importing a contact using
    // the data from the profile.
    useEffect(() => {
        if (formData) {
            resetForm(formData);
        } else if (profile) {
            resetForm(profile);
        }
    }, [formData, profile]);

    return (
        <IonModal isOpen={isModalOpen} onDidDismiss={toggleModal} ref={modal}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={handleCancel}>
                            <IonText
                                color="dark"
                                style={{ fontSize: "1.2rem" }}
                            >
                                Cancel
                            </IonText>
                        </IonButton>
                    </IonButtons>
                    <IonTitle className="ion-text-center">
                        <IonText color={type !== "profile" ? "primary" : ""}>
                            {capitalize(type)}
                        </IonText>
                        {type !== "profile" && <IonText>&nbsp;Person</IonText>}
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton
                            onClick={handleConfirm}
                            disabled={!isFormValid}
                        >
                            <IonText style={{ fontSize: "1.2rem" }}>
                                Confirm
                            </IonText>
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
                        onIonBlur={(e) =>
                            handleAddressAutoComplete(e.target.value as string)
                        }
                    />
                    <IonIcon
                        icon={locateOutline}
                        slot="end"
                        onClick={getCurrentLocation}
                    />
                </IonItem>
                <IonItem>
                    <IonInput
                        type="text"
                        labelPlacement="floating"
                        label="Zip Code"
                        value={zipCode}
                        placeholder="required"
                        onIonInput={(e) =>
                            handleZipCodeAutoComplete(e.target.value as string)
                        }
                        maxlength={5}
                    />
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
                                    disabled={true}
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
                                    disabled={true}
                                />
                            </IonItem>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonItem>
                    <IonInput
                        type="text"
                        labelPlacement="floating"
                        label="Country"
                        value={country}
                        disabled={true}
                    />
                </IonItem>
            </IonContent>
            {type !== "profile" && (
                <ImportContact
                    setContact={setContact}
                    setProfile={setProfile}
                />
            )}
        </IonModal>
    );
};

export default PersonModal;
