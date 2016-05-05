export declare function encryptPassword(password: string): any;
export declare function createAuthToken(userId: string): any;
export declare function decryptAuthToken(authToken: string): {
    id: any;
    createdAt: Date;
};
