import React from "react";
import PersonModal, { FormDataType, PersonModalProps } from "./PersonModal";
import { createUseStyles } from "react-jss";
import {
    IonCard,
    IonCardContent,
    IonCol,
    IonGrid,
    IonRippleEffect,
    IonRow,
    IonText,
} from "@ionic/react";
import Avatar from "../../Avatar";

interface PersonDetailsCardProps {
    formData: FormDataType;
    isPersonA: boolean;
    modal: PersonModalProps;
}

const useStyles = createUseStyles({
    card: {
        height: "49%",
        borderRadius: "50px",
        boxShadow: "none",
    },
    name: {
        fontSize: "36px",
        overflow: "hidden",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 2,
        display: "-webkit-box",
    },
    text: {
        fontWeight: "normal",
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
                color={"tertiary"}
                button={true}
                onClick={modal.toggleModal}
                style={{
                    marginTop: isPersonA ? "0px" : "var(--ion-margin, 16px)",
                }}
            >
                <IonRippleEffect />
                <IonCardContent>
                    <IonGrid className="ion-no-padding">
                        <IonRow className="ion-text-center ion-justify-content-center">
                            <Avatar
                                name={formData.name}
                                size={"96px"}
                                image={formData.photo ?? undefined}
                            />
                        </IonRow>
                        <IonRow className="ion-text-center">
                            <IonCol>
                                <IonText className={classes.name}>
                                    {formData.name.split(" ")[0]}
                                </IonText>
                            </IonCol>
                        </IonRow>
                        <IonRow className="ion-justify-content-center">
                            <IonText
                                className={`${classes.text}`}
                                color={"secondary"}
                            >
                                {`${formData.address}`}
                            </IonText>
                            <IonText
                                className={`${classes.text}`}
                                color={"secondary"}
                            >
                                {`${formData.city}, ${formData.state} ${formData.zipCode}`}
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
