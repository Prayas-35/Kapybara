"use client";

import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, getWeek, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Search, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IoMdTrash } from "react-icons/io";
import NavBar from '@/components/functions/NavBar';
import { useAuth } from '@/app/_contexts/authcontext';
import { TaskModal } from './task-modal';
import { useModalStore } from "@/lib/store";
import 'react-datepicker/dist/react-datepicker.css';

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

export default function calendar() {
    const { token } = useAuth();
    const { openModal, closeModal } = useModalStore();
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [tasks, setTasks] = useState<Task[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isWeekPickerOpen, setIsWeekPickerOpen] = useState<boolean>(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    useEffect(() => {
        fetchTasks();
    }, [token, closeModal]);

    const fetchTasks = async () => {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = token;
            }
            const response = await fetch('/api/getTasks', {
                method: 'POST',
                headers: headers,
            });

            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                console.error('Failed to fetch tasks');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
    const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

    const handleDateTimeClick = (date: Date, time: string, existingTask?: Task) => {
        const dateTime = new Date(date);
        const [hours, minutes] = time.split(':').map(Number);
        dateTime.setHours(hours, minutes, 0, 0);
        
        if (existingTask) {
            setSelectedTask(existingTask);
        } else {
            setSelectedTask(null);
        }
        
        openModal(dateTime);
    };

    const handleDeleteTask = async (id: number) => {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = token;
            }

            const response = await fetch('/api/deleteTask', {
                method: 'DELETE',
                headers: headers,
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                setTasks(tasks.filter((task) => task.id !== id));
                fetchTasks();
            } else {
                alert('Failed to delete the task');
            }
        } catch (error) {
            console.error('Error deleting task', error);
            alert('An error occurred while deleting the task.');
        }
    };

    const getTasksForDateTime = (date: Date, time: string) => {
        return tasks.filter(task => {
            const taskDate = parseISO(task.dueDate);
            const taskDateUTC = new Date(taskDate.getUTCFullYear(), taskDate.getUTCMonth(), taskDate.getUTCDate(), taskDate.getUTCHours(), taskDate.getUTCMinutes(), taskDate.getUTCSeconds());
            return isSameDay(taskDateUTC, date) && format(taskDateUTC, 'HH:00') === time;
        });
    };

    const filteredTasks = searchTerm
        ? tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : tasks;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-red-500';
            case 'in-progress':
                return 'bg-yellow-500';
            case 'completed':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    const handleWeekChange = (date: Date) => {
        setCurrentDate(date);
        setIsWeekPickerOpen(false);
    };

    const generateWeekOptions = () => {
        const options = [];
        const startDate = new Date(currentDate.getFullYear(), 0, 1);
        for (let week = 1; week <= 52; week++) {
            const weekStart = addWeeks(startDate, week - 1);
            const weekEnd = addDays(weekStart, 6);
            options.push(
                <SelectItem key={week} value={week.toString()}>
                    Week {week}: {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
                </SelectItem>
            );
        }
        return options;
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <NavBar isMenuOpen={isMenuOpen} handleMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />

            <header className="bg-background p-4 sm:p-6 sticky top-[70px] z-10">
                {/* Header content remains the same */}
                <div className="container mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="relative w-full sm:w-auto order-2 sm:order-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full bg-input text-foreground border-input focus:ring-primary"
                            />
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4 order-1 pb-5 md:pb-0 sm:order-2 w-full sm:w-auto justify-center">
                            <span className="text-lg sm:text-xl font-bold">
                                {format(currentDate, 'MMMM yyyy')}
                            </span>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4 order-1 pb-5 md:pb-0 sm:order-2 w-full sm:w-auto justify-center">
                            <Button variant="outline" onClick={handlePrevWeek}>
                                <ChevronLeft className="mr-1 sm:mr-2" /> Prev
                            </Button>
                            <Popover open={isWeekPickerOpen} onOpenChange={setIsWeekPickerOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="min-w-[150px]">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Week {getWeek(currentDate)}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Select
                                        value={getWeek(currentDate).toString()}
                                        onValueChange={(value) => handleWeekChange(addWeeks(new Date(currentDate.getFullYear(), 0, 1), parseInt(value) - 1))}
                                    >
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Select week" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {generateWeekOptions()}
                                        </SelectContent>
                                    </Select>
                                </PopoverContent>
                            </Popover>
                            <Button variant="outline" onClick={handleNextWeek}>
                                Next <ChevronRight className="ml-1 sm:ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6">
                <div className="container mx-auto">
                    <div className="grid grid-cols-[auto_repeat(7,1fr)] grid-rows-[auto_repeat(24,1fr)] gap-px bg-border border-2 rounded-lg overflow-hidden">
                        <div className="bg-background p-1 sm:p-2"></div>
                        {weekDays.map((day, index) => (
                            <div key={index} className={`p-1 sm:p-3 text-center bg-card ${format(day, 'eeee') === 'Sunday' ? 'text-primary' : ''}`}>
                                <div className="text-xs sm:text-sm font-medium">{format(day, 'EEE')}</div>
                                <h5 className="text-sm sm:text-2xl font-bold">{format(day, 'dd')}</h5>
                            </div>
                        ))}

                        {timeSlots.map((time, timeIndex) => (
                            <React.Fragment key={time}>
                                <div className="p-1 sm:p-3 text-right text-sm sm:text-xl text-foreground bg-card">{time}</div>
                                {weekDays.map((day, dayIndex) => {
                                    const tasksForSlot = getTasksForDateTime(day, time);
                                    return (
                                        <div
                                            key={`${dayIndex}-${timeIndex}`}
                                            className="border-[#7c4da3a3] border relative transition-colors duration-200 bg-background hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleDateTimeClick(day, time)}
                                        >
                                            {tasksForSlot.map((task) => (
                                                <div
                                                    key={task.id}
                                                    className={`${getStatusColor(task.status)} p-1 sm:p-2 text-xs overflow-hidden rounded-lg relative`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDateTimeClick(day, time, task);
                                                    }}
                                                >
                                                    <div className="text-sm sm:text-xl text-white font-medium p-1 text-wrap leading-tight pr-6">
                                                        {task.title}
                                                    </div>
                                                    <div className="text-xs sm:text-lg text-white font-medium text-wrap p-1 leading-tight">
                                                        {task.description}
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteTask(task.id);
                                                        }}
                                                        className="absolute right-1 top-1 sm:right-2 sm:top-2 text-white hover:text-red-200 transition-colors duration-200"
                                                        aria-label="Delete task"
                                                    >
                                                        <IoMdTrash size={16} className="sm:w-5 sm:h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </main>

            <TaskModal selectedTask={selectedTask} onTaskUpdate={fetchTasks} />
        </div>
    );
}
