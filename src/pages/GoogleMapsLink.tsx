interface GoogleMapsLinkProps {
    formattedAddress: string;
}

const GoogleMapsLink = ({ formattedAddress }: GoogleMapsLinkProps) => {
    const handleClick = () => {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            formattedAddress
        )}`;
        window.open(googleMapsUrl, "_blank");
    };

    return (
        <a href="#" onClick={handleClick}>
            {formattedAddress}
        </a>
    );
};

export default GoogleMapsLink;
