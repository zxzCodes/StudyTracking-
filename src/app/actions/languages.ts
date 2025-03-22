"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { z } from "zod";

const languageScema = z.object({
  name: z.string(),
  code: z.string().length(2),
  level: z.enum([
    "BEGINNER",
    "ELEMENTARY",
    "INTERMEDIATE",
    "UPPER_INTERMEDIATE",
    "ADVANCED",
    "MASTERY",
  ]),
});

export async function addLanguage(values: z.infer<typeof languageScema>) {
  try {
    const user = await auth({
      required: true,
    });

    if (!user) {
      throw new Error("User not found");
    }
    const validatedValues = languageScema.parse(values); // validate the values

    let language = await prisma.language.findUnique({
      where: {
        code: validatedValues.code,
      },
    }); // check if the language already exists

    if (!language) {
      language = await prisma.language.create({
        data: {
          name: validatedValues.name,
          code: validatedValues.code,
        },
      });
    } // create the language if it doesn't exist

    const existingProgress = await prisma.languageProgress.findFirst({
      where: {
        userId: user.id,
        languageId: language.id,
      },
    }); // check if the user is already learning the language

    if (existingProgress) {
      return {
        error: "you are already learning this language",
      };
    } // return an error if the user is already learning the language

    const progress = await prisma.languageProgress.create({
      data: {
        userId: user.id,
        languageId: language.id,

        level: validatedValues.level,
        totalMinutes: 0,
        targetLevel: validatedValues.level,
      },
      include: {
        language: true,
      },
    }); // create the language progress for the user if they are not already learning the language

    revalidatePath("/dashboard"); // revalidate the dashboard page

    return {
      success: true,
      progress,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while adding language",
    };
  }
}
export async function removeLanguage(languageId: string,archive: boolean) {

    try {

        const user = await auth({
            required: true
        })

        if (!user) {
            throw new Error('User not found')
        }
        await prisma.$transaction(async (tx) => {
            if(archive) {
                await tx.goal.updateMany({
                    where: {
                        userId: user.id,
                        languageId: languageId
                    },
                    data: {
                        archived:true
                    }
                }) // archive the goals for the language if the archive flag is true

                await tx.studySession.updateMany({
                    where: {
                        userId: user.id,
                        languageId: languageId
                    },
                    data: {
                        archived:true
                    }
                }) // archive the goals for the language if the archive flag is true
            } 
            await tx.languageProgress.deleteMany({
                where: {
                    userId: user.id,
                    languageId: languageId
                }
            }) // delete the language progress for the user
        



        }) 

        revalidatePath('/dashboard/languages') // revalidate the dashboard page

        revalidatePath('/dashboard') // revalidate the dashboard page

        return {
            succes: true
        }

        

        

        
    } catch (error) {
        console.log(error)
        return {
            error: error instanceof Error ? error.message : 'An error occurred while removing language'
        }
        
    }
  
}