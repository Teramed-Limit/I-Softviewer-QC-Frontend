import React, { useEffect, useState } from 'react';

import { Checkbox, FormControlLabel } from '@mui/material';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';

import { http } from '../../api/axios';
import { define } from '../../constant/setting-define';
import { RoleFunction, UserRole } from '../../interface/user-role';
import GridTableEditor from '../../Layout/GridTableEditor/GridTableEditor';
import classes from './UserRoles.module.scss';

const initFormData = {
    roleName: '',
    description: '',
};

let functionList;

const UserRoles = () => {
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedRoleFunctionList, setSelectedRoleFunctionList] = useState<RoleFunction[]>([]);

    useEffect(() => {
        const subscription = http
            .get('qcFunc')
            .pipe(map((res) => res.data.map((item) => ({ ...item, checked: false }))))
            .subscribe((data) => {
                setSelectedRoleFunctionList(data);
                functionList = data;
            });
        return () => subscription.unsubscribe();
    }, []);

    const initFunctionList = () => {
        setSelectedRole('');
        setSelectedRoleFunctionList(functionList);
    };

    const onSelectionChanged = (gridApi: GridApi) => {
        const selectedRow = gridApi.getSelectedRows()[0] as UserRole;
        if (!selectedRow) return;

        setSelectedRole(selectedRow.roleName);
        http.get(`role/roleName/${selectedRow.roleName}/qcFunction`).subscribe({
            next: (res: AxiosResponse<RoleFunction[]>) => {
                setSelectedRoleFunctionList(() => {
                    return functionList.map((roleFunction) => {
                        const check = res.data.find(
                            (checkFunction) => roleFunction.functionName === checkFunction.functionName,
                        );
                        return { ...roleFunction, checked: check !== undefined };
                    });
                });
            },
            error: (err: AxiosResponse) => {},
        });
    };

    const onFunctionChecked = (
        e: React.ChangeEvent<HTMLInputElement>,
        roleFunction: RoleFunction,
        roleName: string,
    ) => {
        if (roleName === '') return;

        const url = `role/roleName/${roleName}/qcFunction/${roleFunction.functionName}`;

        const updateFunctionState = (checked: boolean) =>
            setSelectedRoleFunctionList((itemList) => {
                return itemList.map((item) => {
                    if (item.functionName === roleFunction.functionName) {
                        return { ...item, checked };
                    }
                    return item;
                });
            });

        const addFunction = () => {
            http.post(url, {}).subscribe((res: AxiosResponse) => {
                updateFunctionState(true);
            });
        };

        const deleteFunction = () => {
            http.delete(url).subscribe((res: AxiosResponse) => {
                updateFunctionState(false);
            });
        };

        return e.target.checked ? addFunction() : deleteFunction();
    };

    return (
        <div className={classes.container}>
            <GridTableEditor
                apiPath="role"
                identityId="roleName"
                colDef={define.userRoleGroup.colDef}
                formDef={define.userRoleGroup.formDef}
                initFormData={initFormData}
                deleteCallBack={initFunctionList}
                addCallBack={initFunctionList}
                onSelectionChanged={onSelectionChanged}
            />
            {/* Function List */}
            <h2>Function List</h2>
            <div className={classes.functionContent}>
                {selectedRoleFunctionList.map((data) => {
                    return (
                        <div key={data.functionName} className={classes.functionList}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled={selectedRole === ''}
                                        size="small"
                                        checked={data.checked}
                                        name={data.functionName}
                                        onChange={(e) => onFunctionChecked(e, data, selectedRole)}
                                    />
                                }
                                label={data.functionName}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserRoles;
