import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

describe("Accounts & Saved Favorites Data Layer & API Logic", () => {
  const testEmail = "testuser@wallmydevice.app";
  const testPassword = "secretPassword123!";
  const testName = "Test Studio Artist";

  beforeEach(async () => {
    // Clean up test records
    await db.savedWallpaper.deleteMany({});
    await db.user.deleteMany({ where: { email: testEmail } });
  });

  it("registers a new credentials user with hashed password", async () => {
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const user = await db.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        name: testName,
      },
    });

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toBe(testEmail);
    expect(user.name).toBe(testName);
    expect(bcrypt.compareSync(testPassword, user.password!)).toBe(true);
  });

  it("saves, lists, and deletes a wallpaper recipe for an authenticated user", async () => {
    const user = await db.user.create({
      data: {
        email: testEmail,
        password: "hashedpassword",
        name: testName,
      },
    });

    const recipeObj = {
      generatorId: "typography",
      seed: "12m8twlk",
      palette: ["#080711", "#240046", "#FF007F", "#00F0FF", "#FFE600"],
      params: { text: "WallMyDevice", font: "JetBrains Mono" },
    };

    const saved = await db.savedWallpaper.create({
      data: {
        userId: user.id,
        recipe: JSON.stringify(recipeObj),
        deviceType: "desktop",
        title: "Cyberpunk Type",
      },
    });

    expect(saved).toBeDefined();
    expect(saved.userId).toBe(user.id);
    expect(JSON.parse(saved.recipe)).toEqual(recipeObj);

    // List user saved wallpapers
    const list = await db.savedWallpaper.findMany({
      where: { userId: user.id },
    });
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(saved.id);

    // Delete saved wallpaper
    await db.savedWallpaper.delete({
      where: { id: saved.id },
    });

    const afterDelete = await db.savedWallpaper.findMany({
      where: { userId: user.id },
    });
    expect(afterDelete.length).toBe(0);
  });
});
