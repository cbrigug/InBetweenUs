import React from "react";
import { FormDataType } from "./AddPersonModal";
import { createUseStyles } from "react-jss";
import { IonCard } from "@ionic/react";

interface PersonDetailsCardProps {
    formData: FormDataType;
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

const PersonDetailsCard: React.FC<PersonDetailsCardProps> = ({ isPersonA }) => {
    const classes = useStyles();

    return (
        <IonCard
            className={`ion-no-margin ${classes.card}`}
            color={isPersonA ? "primary" : "lightblue"}
            button={true}
            style={{ marginTop: isPersonA ? "0px" : "15px" }}
        ></IonCard>
    );
};

export default PersonDetailsCard;
