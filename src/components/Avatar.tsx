import { IonAvatar } from "@ionic/react";
import React from "react";

interface AvatarProps {
    name: string;
    size: string;
    image?: string;
    textSize?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, size, image, textSize }) => {
    const nameParts = name.split(" ");

    const circle = {
        width: size,
        height: size,
        lineHeight: size,
        borderRadius: "50%",
        fontSize: textSize ? textSize : "2rem",
        color: "white",
        backgroundColor: "var(--ion-color-primary)",
        backgroundImage: image,
    };

    return image ? (
        <IonAvatar
            style={{
                height: size,
                width: size,
            }}
        >
            <img src={image} />
        </IonAvatar>
    ) : (
        <div className="ion-text-center" style={circle}>
            {nameParts[0][0].toUpperCase() +
                (nameParts[1] ? nameParts[1][0] : "").toUpperCase()}
        </div>
    );
};

export default Avatar;
