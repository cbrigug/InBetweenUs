import {
    IonItemSliding,
    IonItem,
    IonAvatar,
    IonLabel,
    IonItemOptions,
    IonItemOption,
    IonIcon,
} from "@ionic/react";
import { globe, add } from "ionicons/icons";
import React, { useState } from "react";
import ActivityTypeIcon, { getSingleType } from "./ActivityTypeIcon";
import { createUseStyles } from "react-jss";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { capitalize } from "../../../utils/stringUtils";

interface ThingsToDoItemProps {
    thingToDo: any;
    addToItinerary: (activity: string) => void;
}

const useStyles = createUseStyles({
    icon: {
        transition: "transform 0.3s ease",
    },
});

const SLIDE_RATIO = 3;

const ThingsToDoItem: React.FC<ThingsToDoItemProps> = ({
    thingToDo,
    addToItinerary,
}) => {
    const classes = useStyles();

    const ionItemSlidingRef = React.useRef<HTMLIonItemSlidingElement>(null);
    const itemRef = React.useRef<HTMLIonItemElement>(null);
    const [slidingRatio, setSlidingRatio] = useState(0);
    const [iconPosition, setIconPosition] = useState(0);
    const [hasGivenHapticFeedback, setHasGivenHapticFeedback] = useState(false);

    // once roughly halfway, move icon to the left
    const handleSlide = async () => {
        ionItemSlidingRef.current?.getSlidingRatio().then(async (ratio) => {
            setSlidingRatio(ratio);

            // give haptic feedback once per time passing ratio
            if (ratio > SLIDE_RATIO && !hasGivenHapticFeedback) {
                await Haptics.impact({ style: ImpactStyle.Light });
                setHasGivenHapticFeedback(true);
            } else if (ratio <= SLIDE_RATIO) {
                setHasGivenHapticFeedback(false);
            }
        });

        if (slidingRatio > SLIDE_RATIO) {
            ionItemSlidingRef.current?.getOpenAmount().then((amount) => {
                setIconPosition(amount - 48);
            });
        } else {
            setIconPosition(0);
        }
    };

    const handleSlideEnd = () => {
        if (slidingRatio > SLIDE_RATIO) {
            addToItinerary(thingToDo.name);
            // remove animation
            itemRef.current?.style.setProperty("transition", "none");
            itemRef.current?.style.setProperty("transform", "");
        }
    };

    return (
        <IonItemSliding ref={ionItemSlidingRef} onIonDrag={handleSlide}>
            <IonItem ref={itemRef} lines="inset">
                <IonAvatar slot="start">
                    <ActivityTypeIcon types={thingToDo.kinds} color="light" />
                </IonAvatar>
                <IonLabel className="ion-text-wrap">
                    {thingToDo.name}
                    <IonLabel color="primary" style={{ fontSize: "0.8rem" }}>
                        {capitalize(getSingleType(thingToDo.kinds))}
                    </IonLabel>
                </IonLabel>
            </IonItem>

            <IonItemOptions side="start">
                <IonItemOption color="secondary">
                    <IonIcon icon={globe} color="light" size="large" />
                </IonItemOption>
            </IonItemOptions>

            <IonItemOptions side="end" onIonSwipe={handleSlideEnd}>
                <IonItemOption expandable={true}>
                    <IonIcon
                        icon={add}
                        color="light"
                        size="large"
                        className={classes.icon}
                        style={{ transform: `translateX(${-iconPosition}px)` }}
                    />
                </IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    );
};

export default ThingsToDoItem;
