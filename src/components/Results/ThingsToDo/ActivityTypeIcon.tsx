import { IonIcon } from "@ionic/react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBridge,
    faLandmark,
    faTree,
    faIndustry,
    faPlaceOfWorship,
    faPiggyBank,
} from "@fortawesome/free-solid-svg-icons";
import {
    bed,
    wine,
    balloon,
    globe,
    football,
    fastFood,
    cart,
    bus,
} from "ionicons/icons";
import { createUseStyles } from "react-jss";

type IonIconType =
    | "accomodations"
    | "adult"
    | "amusements"
    | "culture"
    | "sport"
    | "foods"
    | "shops"
    | "transport";

type FontAwesomeIconType =
    | "architecture"
    | "historic"
    | "natural"
    | "industrial_facilities"
    | "religion"
    | "banks";

interface ActivityTypeIconProps {
    types: string;
    color: string;
}

const ionIconMap = {
    accomodations: bed,
    adult: wine,
    amusements: balloon,
    culture: globe,
    sport: football,
    foods: fastFood,
    shops: cart,
    transport: bus,
};

const faIconMap = {
    architecture: faBridge,
    historic: faLandmark,
    natural: faTree,
    industrial_facilities: faIndustry,
    religion: faPlaceOfWorship,
    banks: faPiggyBank,
};

const useStyles = createUseStyles({
    iconContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        background: "radial-gradient(black, transparent)",
        borderRadius: "50%",
        marginLeft: "calc(var(--ion-margin, 16px) * 0.25)",
        marginTop: "calc(var(--ion-margin, 16px) * 0.25)",
    },
});

// look for type in IonIconType and FontAwesomeIconType
export const getSingleType = (types: string) => {
    const allTypes = types.split(",");
    for (const type of allTypes) {
        if (type in ionIconMap || type in faIconMap) {
            return type;
        }
    }

    return "";
};

const ActivityTypeIcon: React.FC<ActivityTypeIconProps> = ({
    types,
    color,
}) => {
    const classes = useStyles();

    const type = getSingleType(types);

    if (type in ionIconMap) {
        return (
            <div className={classes.iconContainer}>
                <IonIcon
                    icon={ionIconMap[type as IonIconType]}
                    color={color ?? "light"}
                />
            </div>
        );
    }
    if (type in faIconMap) {
        return (
            <div className={classes.iconContainer}>
                <FontAwesomeIcon
                    icon={faIconMap[type as FontAwesomeIconType]}
                    color={`var(--ion-color-${color})`}
                />
            </div>
        );
    }

    return null;
};

export default ActivityTypeIcon;
