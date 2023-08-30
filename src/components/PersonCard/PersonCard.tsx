import React, { useRef, useState } from "react";
import { FormDataType } from "./AddPersonModal";
import PersonDetailsCard from "./PersonDetailsCard";
import AddPersonCard from "./AddPersonCard";

export interface ModalProps {
    isModalOpen: boolean;
    toggleModal: () => void;
    confirmModal: (formData: FormDataType) => void;
    modal: React.RefObject<HTMLIonModalElement>;
}

interface PersonCardProps {
    isPersonA: boolean;
}

const PersonCard: React.FC<PersonCardProps> = ({ isPersonA }) => {
    const modal = useRef<HTMLIonModalElement>(null);
    const [formData, setFormData] = React.useState<FormDataType | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const confirmModal = (formData: FormDataType) => {
        modal.current?.dismiss();
        setFormData(formData);
        console.log(formData);
    };

    const modalObj: ModalProps = {
        isModalOpen,
        toggleModal,
        confirmModal,
        modal,
    };

    return formData ? (
        <PersonDetailsCard formData={formData} isPersonA={isPersonA} />
    ) : (
        <AddPersonCard isPersonA={isPersonA} modal={modalObj} />
    );
};

export default PersonCard;
