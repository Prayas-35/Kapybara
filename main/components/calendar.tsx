"use client";

import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, getWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Search, Plus, Menu, Edit, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IoMdTrash } from "react-icons/io";
import NavBar from '@/components/functions/NavBar';
import { useAuth } from '../app/_contexts/authcontext';
import { TaskModal } from './task-modal';
import { useModalStore } from "@/lib/store";
import 'react-datepicker/dist/react-datepicker.css';

interface Project {
    _id: string;
    name: string;
    wardNumber: string;
    date: Date;
    time: string;
    duration: number;
    location: string;
    supervision: string;
    resources: string;
    status: 'not-started' | 'working' | 'finished';
    department?: string;
}

export default function WardProjectDashboard() {
    const { token } = useAuth();
    const { openModal } = useModalStore();
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isWeekPickerOpen, setIsWeekPickerOpen] = useState<boolean>(false);

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
    const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

    const handleDateTimeClick = (date: Date, time: string) => {
        const dateTime = new Date(date);
        const [hours, minutes] = time.split(':').map(Number);
        dateTime.setHours(hours, minutes, 0, 0);
        openModal(dateTime);
    };

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/getProject', {
                method: 'POST',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched projects:', data);
                setProjects(prevProjects => {
                    const newProjects = JSON.stringify(data) !== JSON.stringify(prevProjects) ? data : prevProjects;
                    return newProjects;
                });
            } else {
                console.error('Failed to fetch projects:', response.status);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchProjects();
        }, 60000); // Refetch every minute

        return () => clearInterval(intervalId);
    }, []);

    const handleDeleteProject = async (id: string) => {
        console.log('Deleting project:', id);
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = token;
            }

            const response = await fetch('/api/deleteProject', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                setProjects(projects.filter((project) => project._id !== id));
                fetchProjects();
            } else {
                alert('Failed to delete the project');
            }
        } catch (error) {
            console.error('Error deleting project', error);
            alert('An error occurred while deleting the project.');
        }
    };

    const filteredProjects = searchTerm ? projects.filter(p => p.wardNumber.includes(searchTerm)) : projects;

    const getProjectsForDateTime = (date: Date, time: string) => {
        return filteredProjects.filter(p => isSameDay(new Date(p.date), date) && p.time === time);
    };

    const handleMenuToggle = () => {
        setIsMenuOpen((prevState) => !prevState);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'not-started':
                return 'bg-red-500';
            case 'working':
                return 'bg-yellow-500';
            case 'finished':
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
            <NavBar isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
            <header className="bg-background p-4 sm:p-6 sticky top-[70px] z-10">
                <div className="container mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="relative w-full sm:w-auto order-2 sm:order-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by ward number"
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
                                    const projectsForSlot = getProjectsForDateTime(day, time);
                                    return (
                                        <div
                                            key={`${dayIndex}-${timeIndex}`}
                                            className="border-[#7c4da3a3] border relative transition-colors duration-200 bg-background hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleDateTimeClick(day, time)}
                                        >
                                            {projectsForSlot.map((project) => (
                                                <div
                                                    key={project._id}
                                                    className={`${getStatusColor(project.status)} p-1 sm:p-2 text-xs overflow-hidden rounded-lg relative`}
                                                    style={{ height: `${(project.duration - 1) * 101.25 + 100}%`, minHeight: '100%' }}
                                                >
                                                    <div className="text-sm sm:text-xl text-white font-medium p-1 text-wrap leading-tight pr-6">{project.name}</div>
                                                    <div className="text-xs sm:text-lg text-white font-medium text-wrap p-1 leading-tight">
                                                        Ward {project.wardNumber}
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteProject(project._id);
                                                        }}
                                                        className="absolute right-1 top-1 sm:right-2 sm:top-2 text-white hover:text-red-200 transition-colors duration-200"
                                                        aria-label="Delete project"
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

            <TaskModal />
        </div>
    );
}
