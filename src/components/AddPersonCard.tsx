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
import AddPersonModal from "./AddPersonModal";

interface AddPersonCardProps {
    isPersonA: boolean;
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

const AddPersonCard: React.FC<AddPersonCardProps> = ({ isPersonA }) => {
    const classes = useStyles();

    const modal = useRef<HTMLIonModalElement>(null);
    const modalInput = useRef<HTMLIonInputElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const confirmModal = () => {
        modal.current?.dismiss(modalInput.current?.value, "confirm");
        console.log(modalInput.current?.value);
    };

    return (
        <>
            <IonCard
                className={`ion-no-margin ${classes.card}`}
                color={isPersonA ? "primary" : "lightblue"}
                button={true}
                style={{ marginTop: isPersonA ? "0px" : "15px" }}
                onClick={toggleModal}
            >
                <IonRippleEffect />
                <IonGrid className={classes.grid}>
                    <IonRow
                        className="ion-text-center"
                        style={{ height: "100%" }}
                    >
                        <IonCol className="ion-align-self-center">
                            <IonLabel className={classes.label}>
                                Person A
                            </IonLabel>
                            <br />
                            <IonIcon
                                icon={addCircleOutline}
                                color="light"
                                className={classes.icon}
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonCard>

            <AddPersonModal
                isModalOpen={isModalOpen}
                toggleModal={toggleModal}
                confirm={confirmModal}
                input={modalInput}
                modal={modal}
            />
        </>
    );
};

export default AddPersonCard;
