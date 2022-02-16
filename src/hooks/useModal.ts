import { useImperativeHandle, useState } from 'react';

export type BaseModalHandle = {
    openModal: () => void;
};

export const useModal = (ref) => {
    const [modalOpen, setModalOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        openModal() {
            setModalOpen(true);
        },
    }));

    return { modalOpen, setModalOpen };
};
