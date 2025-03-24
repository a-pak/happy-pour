export default interface UserDetails {
    id: number;
    email: string;
    username: string;
}

export const defaultUserDetails: UserDetails = {
    id : 0,
    email:"",
    username:"",
}