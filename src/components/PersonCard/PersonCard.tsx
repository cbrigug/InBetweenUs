import React, { useRef, useState } from "react";
import { FormDataType, PersonModalProps } from "./PersonModal";
import PersonDetailsCard from "./PersonDetailsCard";
import AddPersonCard from "./AddPersonCard";

interface PersonCardProps {
    isPersonA: boolean;
}

const PersonCard: React.FC<PersonCardProps> = ({ isPersonA }) => {
    const [formData, setFormData] = React.useState<FormDataType | null>(null);

    const modal = useRef<HTMLIonModalElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const confirmModal = async (formData: FormDataType) => {
        await modal.current?.dismiss();
        setFormData(formData);
    };

    const modalObj: PersonModalProps = {
        isModalOpen: isModalOpen,
        toggleModal: toggleModal,
        confirm: confirmModal,
        modal: modal,
        isDetails: !!formData,
    };

    return formData ? (
        <PersonDetailsCard
            formData={formData}
            isPersonA={isPersonA}
            modal={modalObj}
        />
    ) : (
        <AddPersonCard isPersonA={isPersonA} modal={modalObj} />
    );
};

export default PersonCard;
