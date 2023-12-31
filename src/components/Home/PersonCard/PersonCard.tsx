import React, { useRef, useState } from "react";
import { FormDataType, PersonModalProps } from "./PersonModal";
import PersonDetailsCard from "./PersonDetailsCard";
import AddPersonCard from "./AddPersonCard";

interface PersonCardProps {
    isPersonA: boolean;
    setPerson: (formData: FormDataType) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ isPersonA, setPerson }) => {
    const [formData, setFormData] = React.useState<FormDataType | null>(null);

    const modal = useRef<HTMLIonModalElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const confirmModal = async (formData: FormDataType) => {
        await modal.current?.dismiss();
        setFormData(formData);
        setPerson(formData);
    };

    const modalObj: PersonModalProps = {
        isModalOpen: isModalOpen,
        toggleModal: toggleModal,
        confirm: confirmModal,
        modal: modal,
        type: "add",
    };

    return formData ? (
        <PersonDetailsCard
            formData={formData}
            isPersonA={isPersonA}
            modal={modalObj}
        />
    ) : (
        <AddPersonCard
            isPersonA={isPersonA}
            modal={{ ...modalObj, type: "edit" }}
        />
    );
};

export default PersonCard;
