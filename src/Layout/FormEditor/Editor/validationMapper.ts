import { isEmptyOrNil } from '../../../utils/general';

export type ValidateMethod = (value: any) => boolean;

interface IValidationMapper {
    [props: string]: ValidateMethod;
}

export const ValidationMapper: IValidationMapper = {
    Required: (value: any) => !isEmptyOrNil(value),
};

export const ValidationMessage = {
    Required: 'field is required.',
};
