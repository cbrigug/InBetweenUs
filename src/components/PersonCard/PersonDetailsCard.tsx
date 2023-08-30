import React from "react";
import PersonModal, { FormDataType, PersonModalProps } from "./PersonModal";
import { createUseStyles } from "react-jss";
import {
    IonAvatar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCol,
    IonGrid,
    IonLabel,
    IonRippleEffect,
    IonRow,
    IonText,
} from "@ionic/react";

interface PersonDetailsCardProps {
    formData: FormDataType;
    isPersonA: boolean;
    modal: PersonModalProps;
}

const useStyles = createUseStyles({
    card: {
        height: "49%",
        borderRadius: "50px",
    },
    label: {
        fontSize: "36px",
        fontWeight: "bold",
        overflow: "hidden",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 2,
        display: "-webkit-box",
    },
    text: {
        fontSize: "25px",
        overflow: "hidden",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 3,
        display: "-webkit-box",
    },
});

const PersonDetailsCard: React.FC<PersonDetailsCardProps> = ({
    formData,
    isPersonA,
    modal,
}) => {
    const classes = useStyles();

    return (
        <>
            <IonCard
                className={`ion-no-margin ${classes.card}`}
                color={isPersonA ? "lightblue" : "primary"}
                button={true}
                onClick={modal.toggleModal}
                style={{ marginTop: isPersonA ? "0px" : "15px" }}
            >
                <IonRippleEffect />
                <IonCardHeader color={isPersonA ? "primary" : "lightblue"}>
                    <IonCardTitle>
                        <IonGrid style={{ height: "90px" }}>
                            <IonRow style={{ height: "100%" }}>
                                <IonCol
                                    size="8"
                                    className="ion-align-self-center"
                                >
                                    <IonLabel className={classes.label}>
                                        {formData.name}
                                    </IonLabel>
                                </IonCol>
                                <IonCol size="4">
                                    <IonAvatar
                                        style={{
                                            height: "75px",
                                            width: "75px",
                                            boxShadow:
                                                "0px 5px 10px 0px rgba(0, 0, 0, 0.5)",
                                        }}
                                    >
                                        <img
                                            src={`${
                                                formData.photo ??
                                                "https://ionicframework.com/docs/img/demos/avatar.svg"
                                            }`}
                                        />
                                    </IonAvatar>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonGrid className="ion-padding-top">
                        <IonRow>
                            <IonText className={classes.text}>
                                {`${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`}
                            </IonText>
                        </IonRow>
                    </IonGrid>
                </IonCardContent>
            </IonCard>

            <PersonModal
                isModalOpen={modal.isModalOpen}
                toggleModal={modal.toggleModal}
                confirm={modal.confirm}
                modal={modal.modal}
                isDetails={modal.isDetails}
                formData={formData}
            />
        </>
    );
};

export default PersonDetailsCard;
