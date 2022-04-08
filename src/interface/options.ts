export interface Option {
    id?: number;
    label: string;
    value: string;
    type: string;
}

export interface AutoCompleteOption extends Option {
    inputValue?: string;
}
