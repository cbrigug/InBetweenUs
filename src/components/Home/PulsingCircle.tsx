import { IonIcon } from "@ionic/react";
import { createUseStyles } from "react-jss";
import { arrowForwardCircle } from "ionicons/icons";
import React from "react";

interface PulsingCircleProps {
    navToResults: () => void;
}

const useStyles = createUseStyles({
    icon: {
        position: "absolute",
        zIndex: 1,
        top: 0,
        bottom: 0,
        margin: "auto",
        animation: "$pulseEffect  1s 5",
        right: "16px",
        fontSize: "70px",
    },
    // pulse animation
    "@keyframes pulseEffect": {
        "0%, 100%": { transform: "scale(1)" },
        "50%": { transform: "scale(1.1)" },
    },
});

const PulsingCircle: React.FC<PulsingCircleProps> = ({ navToResults }) => {
    const classes = useStyles();

    return (
        <IonIcon
            icon={arrowForwardCircle}
            color="primary"
            className={classes.icon}
            onClick={navToResults}
        ></IonIcon>
    );
};

export default PulsingCircle;
