import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/app/_contexts/authcontext"

export type Project = {
    id: number
    name: string
}

export type Category = {
    id: number
    name: string
}

export const useProjects = () => {
    const { token } = useAuth()

    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            }
            if (token) {
                headers["Authorization"] = `Bearer ${token}`

                const res = await fetch("/api/getProject", {
                    method: "POST",
                    headers
                })
                // console.log("res", res)
                // console.log("res.json", res.json())
                const data = await res.json()
                console.log("data", data)

                // if (!res.ok) throw new Error("Failed to fetch projects")
                return data as Promise<{ projects: Project[] }>
            }
        },
    })
}
