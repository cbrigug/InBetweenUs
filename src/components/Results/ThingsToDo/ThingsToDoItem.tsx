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

    // once roughly halfway, move icon to the left
    const handleSlide = async () => {
        ionItemSlidingRef.current?.getSlidingRatio().then((ratio) => {
            setSlidingRatio(ratio);
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
                        {getSingleType(thingToDo.kinds)
                            .charAt(0)
                            .toUpperCase() +
                            getSingleType(thingToDo.kinds).slice(1)}
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
