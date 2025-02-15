"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useModalStore } from "@/lib/store"
import { useProjects } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"
import { useAuth } from "@/app/_contexts/authcontext"

interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    priority: number;
    status: string;
    projectId: number;
    userId: number;
    createdAt: string;
}

interface TaskModalProps {
    selectedTask: Task | null;
    onTaskUpdate: () => void;
}

export function TaskModal({ selectedTask, onTaskUpdate }: TaskModalProps) {
    const { isOpen, selectedDateTime, closeModal } = useModalStore()
    const { data: projects, refetch: mutateProjects } = useProjects()
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "3",
        status: "pending",
        projectId: "",
        categoryId: "",
        dueDate: "",
    })

    const [showNewProject, setShowNewProject] = useState(false)
    const [newProject, setNewProject] = useState({ name: "", description: "" })

    useEffect(() => {
        if (selectedTask) {
            // If editing an existing task, populate the form with task data
            setFormData({
                title: selectedTask.title,
                description: selectedTask.description,
                priority: selectedTask.priority.toString(),
                status: selectedTask.status,
                projectId: selectedTask.projectId.toString(),
                categoryId: "",
                dueDate: selectedTask.dueDate,
            })
        } else if (selectedDateTime) {
            // If creating a new task, set only the due date
            const istDateTime = selectedDateTime
                .toLocaleString("en-CA", {
                    timeZone: "Asia/Kolkata",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hourCycle: "h23",
                })
                .replace(", ", "T")

            setFormData(prev => ({
                ...prev,
                dueDate: istDateTime,
            }))
        }
    }, [selectedDateTime, selectedTask])

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = token;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const endpoint = selectedTask ? "/api/updateTask" : "/api/addTask";
        const method = selectedTask ? "PUT" : "POST";
        
        const submitData = selectedTask 
            ? { ...formData, id: selectedTask.id }
            : formData;

        const res = await fetch(endpoint, {
            method: method,
            headers: headers,
            body: JSON.stringify(submitData),
        })

        if (res.ok) {
            onTaskUpdate(); // Refresh tasks after successful update/creation
            closeModal()
            formReset()
        } else {
            console.error('Failed to save task');
            alert('Failed to save task. Please try again.');
        }
    }

    const formReset = () => {
        setFormData({
            title: "",
            description: "",
            priority: "3",
            status: "pending",
            projectId: "",
            categoryId: "",
            dueDate: "",
        })
    }

    const handleNewProject = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch("/api/addProject", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(newProject),
        })
        const data = await res.json()
        mutateProjects()
        setShowNewProject(false)
        setFormData({ ...formData, projectId: data.id.toString() })
    }

    return (
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{selectedTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                                id="dueDate"
                                type="datetime-local"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => setFormData({ ...formData, priority: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">High</SelectItem>
                                    <SelectItem value="2">Medium</SelectItem>
                                    <SelectItem value="3">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="project">Project</Label>
                                <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewProject(true)}>
                                    <PlusCircle className="w-4 h-4 mr-1" />
                                    New
                                </Button>
                            </div>
                            <Select
                                value={formData.projectId}
                                onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects?.projects?.map((project) => (
                                        <SelectItem key={project.id} value={project.id.toString()}>
                                            {project.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select 
                            value={formData.status} 
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="submit">{selectedTask ? 'Update Task' : 'Create Task'}</Button>
                    </div>
                </form>

                {showNewProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-background border-border p-6 rounded-lg shadow-xl w-96">
                            <h3 className="text-lg font-semibold mb-4">Add New Project</h3>
                            <form onSubmit={handleNewProject} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="projectName">Project Name</Label>
                                    <Input
                                        id="projectName"
                                        value={newProject.name}
                                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="Description">Description</Label>
                                    <Textarea
                                        id="Description"
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setShowNewProject(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Add Project</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
