import { useQuery } from "@tanstack/react-query"

export type Project = {
    id: number
    name: string
}

export type Category = {
    id: number
    name: string
}

export const useProjects = () => {
    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const res = await fetch("/api/projects")
            return res.json() as Promise<Project[]>
        },
    })
}

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch("/api/categories")
            return res.json() as Promise<Category[]>
        },
    })
}

