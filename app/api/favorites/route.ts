import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const saved = await db.savedWallpaper.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const parsed = saved.map((item) => ({
      id: item.id,
      userId: item.userId,
      title: item.title,
      recipe: typeof item.recipe === "string" ? JSON.parse(item.recipe) : item.recipe,
      deviceType: item.deviceType,
      createdAt: item.createdAt,
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("GET /api/favorites error:", error);
    return NextResponse.json({ error: "Failed to fetch saved wallpapers." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const { recipe, deviceType, title } = body;

    if (!recipe || !recipe.generatorId || !recipe.seed || !recipe.palette) {
      return NextResponse.json({ error: "Invalid wallpaper recipe data." }, { status: 400 });
    }

    const recipeString = typeof recipe === "string" ? recipe : JSON.stringify(recipe);

    const created = await db.savedWallpaper.create({
      data: {
        userId,
        recipe: recipeString,
        deviceType: deviceType || "desktop",
        title: title || undefined,
      },
    });

    return NextResponse.json({
      id: created.id,
      userId: created.userId,
      title: created.title,
      recipe: typeof created.recipe === "string" ? JSON.parse(created.recipe) : created.recipe,
      deviceType: created.deviceType,
      createdAt: created.createdAt,
    });
  } catch (error) {
    console.error("POST /api/favorites error:", error);
    return NextResponse.json({ error: "Failed to save wallpaper." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // ignore JSON parse error if body is empty
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Missing favorite wallpaper ID." }, { status: 400 });
    }

    const existing = await db.savedWallpaper.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Saved wallpaper not found or forbidden." }, { status: 404 });
    }

    await db.savedWallpaper.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("DELETE /api/favorites error:", error);
    return NextResponse.json({ error: "Failed to delete saved wallpaper." }, { status: 500 });
  }
}
