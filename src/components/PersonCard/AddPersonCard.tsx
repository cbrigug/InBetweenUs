import React from "react";
import {
    IonCard,
    IonCol,
    IonGrid,
    IonIcon,
    IonRippleEffect,
    IonRow,
    IonText,
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
        boxShadow: "none",
    },
    icon: {
        fontSize: "115px",
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
                color={"tertiary"}
                button={true}
                onClick={modal.toggleModal}
                style={{ marginTop: isPersonA ? "0px" : "15px" }}
            >
                <IonRippleEffect />
                <IonGrid className={classes.grid}>
                    <IonRow
                        className="ion-text-center"
                        style={{
                            marginTop: "calc(var(--ion-margin, 16px) * 3)",
                        }}
                    >
                        <IonCol>
                            <IonIcon
                                icon={addCircleOutline}
                                color="primary"
                                className={classes.icon}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-text-center">
                        <IonCol>
                            <IonText>Add Person</IonText>
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
