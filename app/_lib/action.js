"use server"
import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth"
import { supabase } from "./supabase";
import { getBookings } from "./data-service";

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

    revalidatePath("/account/profile")

}

export async function deleteReservation(bookingId) {
    const session = auth()
    if (!session) throw new Error("you must logged in")

    const guestBookings = await getBookings(session.user.guestId)
    const guestBookingIds = await guestBookings.map((booking) => booking.id);

    if (!guestBookingIds.includes(bookingId)) throw new Error("Yoy are not allowed to delete this booking")

    const { error } = await supabase.from('bookings').delete().eq('id', bookingId);

    if (error) throw new Error('Booking could not be deleted');
    revalidatePath("/account/reservations")
}

export async function SignInAction() {
    await signIn("google", { redirectTo: "/account" })
}

export async function SignOutAction() {
    await signOut({ redirectTo: "/" })
}