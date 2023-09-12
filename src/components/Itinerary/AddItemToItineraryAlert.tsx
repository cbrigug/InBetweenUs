import {
    IonCol,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonPopover,
    IonRadio,
    IonRadioGroup,
    IonRow,
    IonText,
} from "@ionic/react";
import {
    calendarClearOutline,
    calendarOutline,
    chevronDown,
} from "ionicons/icons";
import React, { useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import {
    ItineraryDay,
    getItineraryFromLocalStorage,
    saveToLocalStorage,
} from "./Itinerary";

interface AddItemToItineraryAlertProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    activity: string;
}

const useStyles = createUseStyles({
    modal: {
        "--width": "70%",
        "--height": "fit-content",
        "--background": "var(--ion-color-tertiary)",
        "--border-radius": "16px",
    },
    btnRow: {
        marginTop: "calc(var(--ion-margin, 16px) * .5)",
        marginBottom: "calc(var(--ion-margin, 16px) * .5)",
    },
    btnText: {
        fontSize: "1.2rem",
    },
    fieldText: {
        fontSize: "1rem",
        fontWeight: "normal",
    },
    icon: {
        paddingLeft: "calc(var(--ion-padding, 16px) * 0.5)",
        verticalAlign: "text-top",
    },
});

const AddItemToItineraryAlert: React.FC<AddItemToItineraryAlertProps> = ({
    isOpen,
    setIsOpen,
    activity,
}) => {
    const classes = useStyles();

    // add an additional filler day
    // this allows the user to add an item to the next day in the itinerary
    // even if that day has not already been created
    const fillerDay = {
        id: Math.max(...getItineraryFromLocalStorage().map((d) => d.id)) + 1,
        morning: "",
        afternoon: "",
        evening: "",
    };

    const [days, setDays] = useState<ItineraryDay[]>(
        getItineraryFromLocalStorage().concat(fillerDay)
    );
    const [curDay, setCurDay] = useState<ItineraryDay>(days[0]);

    // Alert fields
    const [timeOfDay, setTimeOfDay] = useState(""); // ["morning", "afternoon", "evening"]

    // Popover to select day
    const popover = useRef<HTMLIonPopoverElement>(null);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const openPopover = (e: any) => {
        setIsPopoverOpen(true);
    };

    const handlePopoverItemClick = (day: ItineraryDay) => {
        setCurDay(day);
        setIsPopoverOpen(false);
    };

    const handleAdd = () => {
        // take first 25 characters of activity to fit requirements
        activity = activity.substring(0, 25);

        const day: ItineraryDay = {
            id: curDay.id,
            morning: timeOfDay === "morning" ? activity : curDay.morning,
            afternoon: timeOfDay === "afternoon" ? activity : curDay.afternoon,
            evening: timeOfDay === "evening" ? activity : curDay.evening,
        };

        const updatedDays = [...days];
        const index = updatedDays.findIndex((d) => d.id === day.id);

        updatedDays[index] = day;
        setDays(updatedDays);

        // we don't need the filler day unless we are adding to it
        if (index !== days.length - 1) {
            updatedDays.pop();
        }

        saveToLocalStorage(updatedDays);
        setIsOpen(false);
    };

    return (
        <IonModal
            className={classes.modal}
            isOpen={isOpen}
            onDidDismiss={() => setIsOpen(false)}
        >
            <IonText className="ion-text-center ion-margin-top">
                Add Item
            </IonText>
            <IonItem
                color="tertiary"
                button
                detail
                detailIcon={chevronDown}
                onClick={openPopover}
            >
                <IonLabel>
                    Day {days.findIndex((d) => d.id === curDay.id) + 1}
                </IonLabel>
            </IonItem>
            <IonPopover
                ref={popover}
                isOpen={isPopoverOpen}
                onDidDismiss={() => setIsPopoverOpen(false)}
                side="bottom"
                alignment="center"
            >
                <IonContent class="ion-padding">
                    <IonList>
                        {days.map((day, i) => (
                            <IonItem
                                key={day.id}
                                onClick={() => handlePopoverItemClick(day)}
                                button
                                detail={false}
                            >
                                <IonLabel>Day {i + 1}</IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                </IonContent>
            </IonPopover>
            <IonRadioGroup onIonChange={(e) => setTimeOfDay(e.target.value)}>
                <IonItem lines="none" color="tertiary">
                    <IonRadio value="morning" labelPlacement="fixed">
                        <IonText
                            className={classes.fieldText}
                            color={timeOfDay === "morning" ? "primary" : ""}
                        >
                            Morning
                            <IonIcon
                                className={classes.icon}
                                icon={
                                    curDay?.morning
                                        ? calendarOutline
                                        : calendarClearOutline
                                }
                            />
                        </IonText>
                    </IonRadio>
                </IonItem>
                <IonItem lines="none" color="tertiary">
                    <IonRadio value="afternoon" labelPlacement="fixed">
                        <IonText
                            className={classes.fieldText}
                            color={timeOfDay === "afternoon" ? "primary" : ""}
                        >
                            Afternoon
                            <IonIcon
                                className={classes.icon}
                                icon={
                                    curDay?.afternoon
                                        ? calendarOutline
                                        : calendarClearOutline
                                }
                            />
                        </IonText>
                    </IonRadio>
                </IonItem>
                <IonItem color="tertiary">
                    <IonRadio value="evening" labelPlacement="fixed">
                        <IonText
                            className={classes.fieldText}
                            color={timeOfDay === "evening" ? "primary" : ""}
                        >
                            Evening
                            <IonIcon
                                className={classes.icon}
                                icon={
                                    curDay?.evening
                                        ? calendarOutline
                                        : calendarClearOutline
                                }
                            />
                        </IonText>
                    </IonRadio>
                </IonItem>
            </IonRadioGroup>
            <div className="ion-text-center">
                <IonRow className={classes.btnRow}>
                    <IonCol onClick={() => setIsOpen(false)}>
                        <IonText className={classes.btnText} color="secondary">
                            Cancel
                        </IonText>
                    </IonCol>
                    <IonCol onClick={handleAdd}>
                        <IonText className={classes.btnText} color="primary">
                            Add
                        </IonText>
                    </IonCol>
                </IonRow>
            </div>
        </IonModal>
    );
};

export default AddItemToItineraryAlert;
