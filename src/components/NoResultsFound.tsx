import { IonText } from "@ionic/react";
import React from "react";

const NoResultsFound: React.FC = () => {
    return (
        <div className="no-results ion-text-center ion-justify-content-center ion-align-items-center">
            <IonText id="no-results">No Results Found</IonText>
            <br />
            <IonText color="medium">
                Sorry, we couldn't find any results based on your search.
            </IonText>
        </div>
    );
};

export default NoResultsFound;
