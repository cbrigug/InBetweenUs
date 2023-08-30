import React, { useState, useRef } from "react";
import {
    IonCard,
    IonCol,
    IonGrid,
    IonIcon,
    IonLabel,
    IonRippleEffect,
    IonRow,
} from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import { createUseStyles } from "react-jss";
import PersonModal, { PersonModalProps } from "./PersonModal";

interface AddPersonCardProps {
    isPersonA: boolean;
    modal: PersonModalProps;
}

const useStyles = createUseStyles({
    card: {
        height: "49%",
        borderRadius: "50px",
    },
    label: {
        fontSize: "40px",
        fontWeight: "bold",
    },
    icon: {
        fontSize: "170px",
        "--ionicon-stroke-width": "8px",
    },
    grid: {
        height: "100%",
        width: "100%",
        position: "absolute",
    },
});

const AddPersonCard: React.FC<AddPersonCardProps> = ({ isPersonA, modal }) => {
    const classes = useStyles();

    return (
        <>
            <IonCard
                className={`ion-no-margin ${classes.card}`}
                color={isPersonA ? "primary" : "lightblue"}
                button={true}
                onClick={modal.toggleModal}
                style={{ marginTop: isPersonA ? "0px" : "15px" }}
            >
                <IonRippleEffect />
                <IonGrid className={classes.grid}>
                    <IonRow
                        className="ion-text-center"
                        style={{ height: "100%" }}
                    >
                        <IonCol className="ion-align-self-center">
                            <IonLabel className={classes.label}>
                                {isPersonA ? "Person A" : "Person B"}
                            </IonLabel>
                            <IonIcon
                                icon={addCircleOutline}
                                color="light"
                                className={classes.icon}
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonCard>

            <PersonModal
                isModalOpen={modal.isModalOpen}
                toggleModal={modal.toggleModal}
                confirm={modal.confirm}
                modal={modal.modal}
                isDetails={modal.isDetails}
            />
        </>
    );
};

export default AddPersonCard;
