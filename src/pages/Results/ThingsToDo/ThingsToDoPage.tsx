import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonText,
    IonContent,
    IonButton,
    IonSearchbar,
    IonList,
    IonItem,
} from "@ionic/react";
import { arrowBack, filter, newspaper } from "ionicons/icons";
import React from "react";
import { useLocation } from "react-router";
import ThingsToDoItem from "../../../components/Results/ThingsToDo/ThingsToDoItem";

interface ThingsToDoProps {
    thingsToDo: any[];
}

const ThingsToDoPage: React.FC = () => {
    const location = useLocation();

    const [thingsToDo, setThingsToDo] = React.useState<any[]>(
        (location.state as ThingsToDoProps)?.thingsToDo ?? []
    );

    const addToItinerary = (activity: string) => {
        console.log(activity);
    };

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton routerLink="/results" routerDirection="none">
                            <IonIcon
                                slot="icon-only"
                                icon={arrowBack}
                                color="dark"
                            />
                        </IonButton>
                    </IonButtons>
                    <div className="ion-text-center">
                        <IonText>Things to&nbsp;</IonText>
                        <IonText color={"primary"}>do</IonText>
                    </div>
                    <IonButtons slot="end">
                        <IonButton>
                            <IonIcon
                                slot="icon-only"
                                icon={newspaper}
                                color="dark"
                            />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding-horizontal">
                <IonItem lines="none" className="ion-no-padding">
                    <IonSearchbar className="ion-no-margin" />
                    <IonIcon icon={filter} slot="end" />
                </IonItem>
                <IonList>
                    {thingsToDo?.map((thingToDo) => (
                        <ThingsToDoItem
                            key={thingToDo.xid}
                            thingToDo={thingToDo}
                            addToItinerary={addToItinerary}
                        />
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default ThingsToDoPage;
