import { NextResponse } from "next/server"

export async function GET() {
  // In a real application, you would fetch this data from a database
  const dashboardData = {
    taskProgress: 65,
    upcomingTasks: [
      { id: "1", title: "Complete project proposal", dueDate: "2023-05-20" },
      { id: "2", title: "Review team performance", dueDate: "2023-05-22" },
      { id: "3", title: "Prepare presentation", dueDate: "2023-05-25" },
    ],
    calendarTasks: [
      { id: "1", title: "Team meeting", date: new Date("2023-05-18") },
      { id: "2", title: "Client call", date: new Date("2023-05-20") },
      { id: "3", title: "Project deadline", date: new Date("2023-05-25") },
    ],
  }

  return NextResponse.json(dashboardData)
}
