'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useState, useEffect } from 'react'

interface Entry {
    date: string
    entries: {
        react_time: string
        react_native_time: string
        documentation_time: string
        components_built: string
    }
}

export default function Dashboard() {
    const [entries, setEntries] = useState<Entry[]>([])

    useEffect(() => {
        fetch('/api/daily-entries')
            .then(res => res.json())
            .then(data => setEntries(data))
    }, [])

    const dailyData = entries.slice(0, 7).map(entry => ({
        date: new Date(entry.date).toLocaleDateString(),
        React: parseFloat(entry.entries.react_time),
        'React Native': parseFloat(entry.entries.react_native_time),
        Documentation: parseFloat(entry.entries.documentation_time),
        Components: parseInt(entry.entries.components_built)
    })).reverse()

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Development Dashboard</h1>

            <Tabs defaultValue="daily" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>

                <TabsContent value="daily" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Time Investment (Hours)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dailyData}>
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="React" fill="#0ea5e9" />
                                        <Bar dataKey="React Native" fill="#8b5cf6" />
                                        <Bar dataKey="Documentation" fill="#10b981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Components Built</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={dailyData}>
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="Components"
                                            stroke="#f43f5e"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="weekly">
                    {/* Similar charts for weekly data */}
                </TabsContent>

                <TabsContent value="monthly">
                    {/* Similar charts for monthly data */}
                </TabsContent>
            </Tabs>
        </div>
    )
}
