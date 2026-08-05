import { redirect } from "next/navigation";

export default function FavouritesRedirect() {
  redirect("/saved");
}
