import cornerstone from 'cornerstone-core';

type AdditionalDetails = {
    imageId?: string;
    volumeUID?: string;
};

type RequestDetailsInterface = {
    requestFn: () => Promise<void>;
    type: string;
    additionalDetails: AdditionalDetails;
};

type RequestPool = {
    interaction: { [key: number]: [] };
    thumbnail: { [key: number]: [] };
    prefetch: { [key: number]: [] };
};

interface RequestPoolManager {
    destroy: () => void;
    addRequest: (
        requestFn: () => Promise<void>,
        type: string,
        additionalDetails: Record<string, unknown>,
        priority,
        addToBeginning,
    ) => void;
    filterRequests: (filterFunction: (requestDetails: RequestDetailsInterface) => boolean) => void;
    clearRequestStack: (type: string) => void;
    sendRequest: ({ requestFn, type }: RequestDetailsInterface) => void;
    startGrabbing: () => void;
    startAgain: () => void;
    getSortedPriorityGroups: (type: string) => Array<number>;
    getNextRequest: RequestDetailsInterface | false;
    getRequestPool: RequestPool | false;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Complimentary {
    let imageLoadPoolManager: RequestPoolManager;
}

export const cornerstoneEx: typeof Complimentary & typeof cornerstone = cornerstone as any;
