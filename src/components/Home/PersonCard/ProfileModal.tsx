import React, { useEffect, useRef, useState } from "react";
import PersonModal, { FormDataType, PersonModalProps } from "./PersonModal";

interface ProfileModalProps {
    isModalOpen: boolean;
    toggleModal: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isModalOpen, toggleModal }) => {
    const [formData, setFormData] = useState<FormDataType | undefined>();

    const modal = useRef<HTMLIonModalElement>(null);

    const confirmModal = async (formData: FormDataType) => {
        await modal.current?.dismiss();

        localStorage.setItem("profile", JSON.stringify(formData));
    };

    const modalObj: PersonModalProps = {
        isModalOpen: isModalOpen,
        toggleModal: toggleModal,
        confirm: confirmModal,
        modal: modal,
        type: "profile",
    };

    // load profile from local storage if it exists
    useEffect(() => {
        if (isModalOpen) {
            const profile = localStorage.getItem("profile");
            if (profile) {
                setFormData(JSON.parse(profile));
            }
        }
    }, [isModalOpen]);

    return (
        <PersonModal {...modalObj} formData={formData} />
    );
};

export default ProfileModal;
