import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import Results from "./pages/Results/Results";
import ThingsToDoPage from "./pages/Results/ThingsToDo/ThingsToDoPage";
import NearbyCitiesPage from "./pages/Results/NearbyCities/NearbyCitiesPage";
import HotelPage from "./pages/Results/PlacesToStay/HotelPage";
import OtherStaysPage from "./pages/Results/PlacesToStay/OtherStaysPage";
import IntroPage from "./pages/Intro/IntroPage";

setupIonicReact();

const App: React.FC = () => {
    // only display intro screen on first visit
    const introSeen = localStorage.getItem("introSeen");

    return (
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet>
                    {introSeen ? (
                        <>
                            <Route exact path="/home">
                                <Home />
                            </Route>
                            <Route exact path="/results">
                                <Results />
                            </Route>
                            <Route exact path="/results/hotel">
                                <HotelPage />
                            </Route>
                            <Route exact path="/results/other">
                                <OtherStaysPage />
                            </Route>
                            <Route exact path="/things-to-do">
                                <ThingsToDoPage />
                            </Route>
                            <Route exact path="/find-nearby-cities">
                                <NearbyCitiesPage />
                            </Route>
                            <Route exact path="/">
                                <Redirect to="/home" />
                            </Route>
                        </>
                    ) : (
                        <Route path="/">
                            <IntroPage />
                        </Route>
                    )}
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
