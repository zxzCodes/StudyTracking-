'use server'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ActivityType, Difficulty } from "@prisma/client"
import { revalidatePath } from "next/cache"
import {  checkAndUpdateGoalStatus } from "./goals"
import { StudySessionInput } from "@/lib/schema/study-session"



export type GetStudySessionFilter = {
    language?: string,
    activity?: ActivityType,
    search?: string,
    archived?: boolean
}

export const getStudySessions = async (page = 1, limit = 10, filter: GetStudySessionFilter = {}) => {

    try {
        const user = await auth({required: true})
        if(!user) throw new Error('Unauthorized')

        const skip = (page - 1) * limit
        const where = {
            userId: user.id,
            archived: filter.archived || false,
            ...(filter.language ? {languageId: filter.language} : {}),
            ...(filter.activity ? {type: filter.activity} : {}),
            ...(filter.search ? {description: {contains: filter.search}} : {})
        }

        const sessions = await prisma.studySession.findMany({
            where: where,
            orderBy: {
                date: 'desc'
            },
            select: {
                id: true,
                date: true,
                duration: true,
                description: true,
                type: true,
                difficulty: true,
                language: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            },
            skip: skip,
            take: limit
        })

        const total = await prisma.studySession.count({
            where: where
        })

        return {
            sessions,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                current: page,
            }
        }



    } catch (error) {
        console.error(error)
        return {
            sessions: [],
            pagination: {
                total: 0,
                pages: 0,
                current: 1
            }
        }
    }
}


export const getLanguages = async () => {


    try {
        const user = await auth({required: true})

        if(!user) throw new Error('Unauthorized')

            const progress = await prisma.languageProgress.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    language: true
                }
            })


            const languages = progress.map(p => p.language)

            return {
                languages
            }
    } catch (error) {
        console.error(error)
        return {
            languages: []
        }
        
    }

}
export async function createStudySession(data:{
    languageId: string,
    date:Date,
    duration: number,
    type:ActivityType,
    description: string
    difficulty: Difficulty | null
}) {

try {
    const user = await auth({required: true})
    if(!user) throw new Error('Unauthorized')

        const session = await prisma.studySession.create({
            data: {
                userId: user.id,
                ...data
            }
        })


        const affectedGoals = await prisma.goal.findMany({
            where: {
                userId: user.id,
                languageId: data.languageId,
                archived: false,
                activityType: data.type,
                
                
            }
        })

        for (const goal of affectedGoals) {
           await checkAndUpdateGoalStatus(goal.id)
        }

        revalidatePath('/dashboard')
        

        return {
            session
        }


    
} catch (error) {
    console.error(error,'error creating session')
    return {
        error: 'Error creating session'
    }
    
}



    
}

export async function toggleSessionArchive(sessionId:string) {
    try {
        const user = await auth({required: true})
        if(!user) throw new Error('Unauthorized')

            const session = await prisma.studySession.findUnique({
                where: {
                    id: sessionId   
                },
                select: {
                    userId: true,
                    archived: true
                }
            })

            if(!session) throw new Error('Session not found')

                if(session.userId !==  user.id) throw new Error('Unauthorized')

                    const updatedSession = await prisma.studySession.update({
                        where: {
                            id: sessionId
                        },
                        data: {
                            archived: !session.archived
                        }
                    })

                  

                    revalidatePath('/dashboard/history')

                    return {
                        success: true,
                        archived: updatedSession.archived
                    }



        
    } catch (error) {
        console.error(error)
        return {
            error: 'Error updating session'
        }

        
    }
}

 export async function updateSession(

    sessionId: string,
    data: StudySessionInput & {duration: number}
 ){

    try {

        const user = await auth({required: true})
        if(!user) throw new Error('Unauthorized')

            const existingSession = await prisma.studySession.findUnique({
                where: {
                    id: sessionId,
                    userId: user.id
                }
            })

            if(!existingSession) {
                throw new Error('Session not found')
            }

            await prisma.studySession.update({
                where: {
                    id: sessionId,
                },
                data: {
                    languageId: data.languageId,
                    date: data.date,
                    duration: data.duration,
                    type: data.type,
                    description: data.description,
                    difficulty: data.difficulty
                }
            })

            const affectedGoals = await prisma.goal.findMany({
                where: {
                    userId: user.id,
                    languageId: data.languageId,
                    archived: false,
                    activityType: data.type
                }
            })

            for (const goal of affectedGoals) {
                await checkAndUpdateGoalStatus(goal.id)
            }

            revalidatePath('/dashboard/history')
            

            return {
                success: true,
                
            }


        
    } catch (error) {
        console.error(error)
        return {
            error: 'Error updating session',
            success: false

        }

        
    }

}