import { useCallback } from 'react';

import { useRecoilValue } from 'recoil';

import { userAvailableFunction } from '../atoms/user-available-function';

export const useRoleFunctionAvailable = () => {
    const availableFunctionList = useRecoilValue(userAvailableFunction);

    const checkAvailable = useCallback(
        (compareId: string): boolean => {
            return !!availableFunctionList.find((roleFunction) => {
                return compareId && compareId === roleFunction.correspondElementId;
            });
        },
        [availableFunctionList],
    );

    return { checkAvailable };
};
