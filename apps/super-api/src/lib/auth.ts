import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { phoneNumber, username, admin, bearer } from "better-auth/plugins";
import parsePhoneNumber from 'libphonenumber-js'
import { AccountTable, UserTable } from "@/db/schemas/auth";

export const auth = betterAuth({
    verification:{
        modelName: "verifications",
    },
    session: {
        modelName: "sessions",
    },
    account: {
        modelName: "accounts",
    },
    user: {
        modelName: "users",
        additionalFields: {
            username: {
                type: "string",
                required: true,
                input: false,
            },
            displayUsername: {
                type: "string",
                required: true,
                input: false,
            },
            phoneNumber: {
                type: "string",
                required: true,
                input: false,
            },
            phoneNumberVerified: {
                type: "boolean",
                required: true,
                input: false,
            },
        },
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            users: UserTable,
            accounts: AccountTable
        }

    }),
    advanced: {
        crossSubDomainCookies: {
            enabled: true
        },
        cookies: {
            sessionToken: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    partitioned: true
                }
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    plugins: [
        admin(),
        bearer(),
        username({
            minUsernameLength: 5,
            maxUsernameLength: 100,
            displayUsernameValidator: (displayUsername) => {
                return /^[a-zA-Z0-9_-]+$/.test(displayUsername)
            },
            usernameNormalization(username) {
                return username.toLowerCase();
            },
        }),
        phoneNumber({
            allowedAttempts: 5,
            sendOTP: ({ phoneNumber, code }, request) => {
                // Implement sending OTP code via SMS
            },
            sendPasswordResetOTP: ({ phoneNumber, code }, request) => {
                // Implement sending password reset OTP code via SMS
            },
            signUpOnVerification: {
                getTempName: (phoneNumber) => {
                    return phoneNumber;
                },
                getTempEmail: (phoneNumber) => {
                    return phoneNumber + "@temp.com";
                },
            },
            phoneNumberValidator: (phoneNumber) => {
                return parsePhoneNumber(phoneNumber)?.isValid() ?? false;
            },
            callbackOnVerification(data, request) {
                console.log("callbackOnVerification", data, request);
            },
        })
    ],
});