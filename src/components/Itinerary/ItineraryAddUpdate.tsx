import {
    IonCol,
    IonInput,
    IonItem,
    IonList,
    IonModal,
    IonRow,
    IonText,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { ItineraryDay } from "./Itinerary";
import { createUseStyles } from "react-jss";

interface ItineraryAddUpdateProps {
    addUpdateDay: (day: ItineraryDay) => void;
    index?: number; // need for ItineraryAddCard, if index is present, we are adding a new day
    data?: ItineraryDay; // need for ItineraryCard
}

const useStyles = createUseStyles({
    modal: {
        "--width": "75%",
        "--height": "fit-content",
        "--background": "var(--ion-color-tertiary)",
        "--border-radius": "16px",
    },
    item: {
        "--inner-padding-start": "0px",
    },
    btnRow: {
        marginTop: "calc(var(--ion-margin, 16px) * .5)",
        marginBottom: "calc(var(--ion-margin, 16px) * .5)",
    },
    btnText: {
        fontSize: "1.2rem",
    },
});

const ItineraryAddUpdate: React.FC<ItineraryAddUpdateProps> = ({
    addUpdateDay,
    index,
    data,
}) => {
    const classes = useStyles();

    const modalRef = useRef<HTMLIonModalElement>(null);

    const [morning, setMorning] = useState(data?.morning || "");
    const [afternoon, setAfternoon] = useState(data?.afternoon || "");
    const [evening, setEvening] = useState(data?.evening || "");

    const [showDeleteBtn, setShowDeleteBtn] = useState(false);

    const handleAddUpdate = () => {
        const day: ItineraryDay = {
            id: index || (data?.id as number),
            morning,
            afternoon,
            evening,
        };

        addUpdateDay(day);
        if (index) {
            dismiss();
        } else {
            modalRef.current?.dismiss();
        }
    };

    const dismiss = () => {
        if (index) {
            setMorning("");
            setAfternoon("");
            setEvening("");
        } else {
            setMorning(data?.morning || "");
            setAfternoon(data?.afternoon || "");
            setEvening(data?.evening || "");
        }

        modalRef.current?.dismiss();
    };

    useEffect(() => {
        // if we are updating a day and all fields are empty, show the delete button
        if (data && !morning && !afternoon && !evening) {
            setShowDeleteBtn(true);
        } else {
            setShowDeleteBtn(false);
        }
    }, [morning, afternoon, evening]);

    return (
        <IonModal
            ref={modalRef}
            className={classes.modal}
            trigger={index ? "present-alert" : `present-alert-${data?.id}`}
        >
            <div className="ion-text-center ion-margin-top">
                <IonText>{index ? "Add Day" : "Update Day"}</IonText>
                <IonList className="ion-no-padding">
                    <IonItem
                        lines="none"
                        color="tertiary"
                        className={classes.item}
                    >
                        <IonInput
                            counter
                            value={morning}
                            onIonInput={(e) =>
                                setMorning(e.target.value as string)
                            }
                            label="Morning"
                            labelPlacement="floating"
                            clearInput
                        />
                    </IonItem>
                    <IonItem
                        lines="none"
                        color="tertiary"
                        className={classes.item}
                    >
                        <IonInput
                            counter
                            value={afternoon}
                            onIonInput={(e) =>
                                setAfternoon(e.target.value as string)
                            }
                            label="Afternoon"
                            labelPlacement="floating"
                            clearInput
                        />
                    </IonItem>
                    <IonItem
                        lines="none"
                        color="tertiary"
                        className={classes.item}
                    >
                        <IonInput
                            counter
                            value={evening}
                            onIonInput={(e) =>
                                setEvening(e.target.value as string)
                            }
                            label="Evening"
                            labelPlacement="floating"
                            clearInput
                        />
                    </IonItem>
                </IonList>
                <IonRow className={classes.btnRow}>
                    <IonCol onClick={dismiss}>
                        <IonText className={classes.btnText} color="secondary">
                            Cancel
                        </IonText>
                    </IonCol>
                    <IonCol onClick={handleAddUpdate}>
                        <IonText
                            className={classes.btnText}
                            color={showDeleteBtn ? "danger" : "primary"}
                        >
                            {index
                                ? "Add"
                                : showDeleteBtn
                                ? "Delete"
                                : "Update"}
                        </IonText>
                    </IonCol>
                </IonRow>
            </div>
        </IonModal>
    );
};

export default ItineraryAddUpdate;
