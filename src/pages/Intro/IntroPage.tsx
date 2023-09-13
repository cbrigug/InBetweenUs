import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import addTwoPeople from "../../assets/images/addTwoPeople.png";
import interactWithCards from "../../assets/images/interactWithCards.png";
import swipeThingsToDo from "../../assets/images/swipeThingsToDo.png";
import manageItinerary from "../../assets/images/manageItinerary.png";
import getStarted from "../../assets/images/getStarted.png";

// swiper styles
import "swiper/css/pagination";
import { IonButton, IonText } from "@ionic/react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
    button: {
        position: "absolute",
        bottom: "0px",
        left: "0px",
        right: "0px",
        marginBottom: "calc(var(--ion-margin-bottom, 16px) * 4)",
    },
    text: {
        fontSize: "2rem",
        textTransform: "none",
    },
});

const IntroPage: React.FC = () => {
    const classes = useStyles();

    const handleBegin = () => {
        localStorage.setItem("introSeen", "true");

        window.location.href = "/home";
    };

    return (
        <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            pagination={{ clickable: true }}
        >
            <SwiperSlide className="swiper">
                <img src={addTwoPeople} />
            </SwiperSlide>
            <SwiperSlide className="swiper">
                <img src={interactWithCards} />
            </SwiperSlide>
            <SwiperSlide className="swiper">
                <img src={swipeThingsToDo} />
            </SwiperSlide>
            <SwiperSlide className="swiper">
                <img src={manageItinerary} />
            </SwiperSlide>
            <SwiperSlide className="swiper">
                <img src={getStarted} />
                <IonButton
                    className={classes.button}
                    color="tertiary"
                    onClick={handleBegin}
                >
                    <IonText color="primary" className={classes.text}>
                        Get started
                    </IonText>
                </IonButton>
            </SwiperSlide>
        </Swiper>
    );
};

export default IntroPage;
