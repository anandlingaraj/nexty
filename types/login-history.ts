// types/login-history.ts
export type LoginHistoryEntry = {
    deviceName: string;
    location: string;
    ipAddress: string;
    deviceType: 'LAPTOP' | 'SMARTPHONE' | 'TABLET' | 'DESKTOP' | 'OTHER';
    isCurrentDevice?: boolean;
};