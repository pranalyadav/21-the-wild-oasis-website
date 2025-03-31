"use server"
import { auth, signIn, signOut } from "./auth"
import { supabase } from "./supabase";

export async function updateGuest({ formData }) {
    const session = auth()
    if (!session) throw new Error("you must logged in")

    const nationalID = formData.get("nationalID");
    const [nationality, countryFlag] = formData.get("nationality").split('%');

    if (/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) throw new Error("Please provide the valid national Id")

    const updateData = { nationality, countryFlag, nationalID }

    const { data, error } = await supabase
        .from('guests')
        .update(updateData)
        .eq('id', session.user.guestId)


    if (error) throw new Error('Guest could not be updated');

}

export async function SignInAction() {
    await signIn("google", { redirectTo: "/account" })
}

export async function SignOutAction() {
    await signOut({ redirectTo: "/" })
}