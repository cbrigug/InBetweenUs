import { IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";
import React from "react";
import Avatar from "../Avatar";
import { FormDataType } from "../Home/PersonCard/PersonModal";
import { car } from "ionicons/icons";
import { convertSecondsToHoursMinutes } from "../../utils/timeUtils";
import { createUseStyles } from "react-jss";

interface DrivingTimeBannerProps {
    personA: FormDataType;
    personB: FormDataType;
    drivingTimeA: number;
    drivingTimeB: number;
}

const useStyles = createUseStyles({
    banner: {
        borderTop: "1px solid rgba(var(--ion-color-secondary-rgb), 0.25)",
        borderBottom: "1px solid rgba(var(--ion-color-secondary-rgb), 0.25)",
    },
    col: {
        paddingTop: "calc(var(--ion-padding, 16px) * 0.5)",
        paddingBottom: "calc(var(--ion-padding, 16px) * 0.5)",
    },
    icon: {
        opacity: 0.75,
    }
});

const DrivingTimeBanner: React.FC<DrivingTimeBannerProps> = ({
    personA,
    personB,
    drivingTimeA,
    drivingTimeB,
}) => {
    const classes = useStyles();

    return (
        <IonGrid>
            <IonRow className={`${classes.banner} ion-align-items-center`}>
                <IonCol className={classes.col}>
                    <IonRow className="ion-justify-content-center">
                        <Avatar
                            name={personA.name}
                            size={"64px"}
                            image={personA.photo ?? undefined}
                        />
                        <IonText color={"secondary"}>
                            {convertSecondsToHoursMinutes(drivingTimeA)}
                        </IonText>
                    </IonRow>
                </IonCol>
                <IonCol className={classes.col}>
                    <IonRow className="ion-justify-content-center">
                        <IonIcon className={classes.icon} icon={car} size="large" />
                    </IonRow>
                </IonCol>
                <IonCol className={classes.col}>
                    <IonRow className="ion-justify-content-center">
                        <Avatar
                            name={personB.name}
                            size={"64px"}
                            image={personB.photo ?? undefined}
                        />
                        <IonText color={"secondary"}>
                            {convertSecondsToHoursMinutes(drivingTimeB)}
                        </IonText>
                    </IonRow>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export default DrivingTimeBanner;
