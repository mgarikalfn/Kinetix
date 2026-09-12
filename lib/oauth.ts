"use server";
import { createAdminClient } from "./appwrite";
import { redirect } from "next/navigation";
import {headers} from "next/headers";
import { OAuthProvider } from "node-appwrite";

async function getOrigin() {
    const headerList = await headers();
    const origin = headerList.get("origin");
    if (origin) return origin;

    const host = headerList.get("x-forwarded-host") || headerList.get("host");
    const proto = headerList.get("x-forwarded-proto") || "https";
    if (host) return `${proto}://${host}`;

    if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;

    return "https://project-managment-ujod.vercel.app";
}

export async function signUpWithGithub() {
    const { account } = await createAdminClient();
    const origin = await getOrigin();

    const redirectUrl = await account.createOAuth2Token(
        OAuthProvider.Github,
        `${origin}/oauth`,
        `${origin}/signup`
    );

    return redirect(redirectUrl);
}

export async function signUpWithGoogle() {
    const { account } = await createAdminClient();
    const origin = await getOrigin();

    const redirectUrl = await account.createOAuth2Token(
        OAuthProvider.Google,
        `${origin}/oauth`,
        `${origin}/signup`
    );

    return redirect(redirectUrl);
}