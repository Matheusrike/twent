export enum UserTypes {
    CUSTOMER = 'CUSTOMER',
    EMPLOYEE = 'EMPLOYEE',
}

export interface IUser {
       email: string,
    password_hash: string,
    first_name: string,
    last_name: string,
    phone?: string,
    user_type: UserTypes,
    document_number?: string,
    birth_date?: Date,
    street?: string,
    number?: string,
    district?: string,
    city?: string,
    state?: string,
    zip_code?: string,
    country?: string,
}

export type IGetUserProps = {
    id?: string,
    email?: string,
    country?: string,
    street?: string,
    city?: string,
    state?: string,
    user_type?: UserTypes,
}