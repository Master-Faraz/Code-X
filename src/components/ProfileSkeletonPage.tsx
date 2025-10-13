"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

const ProfilePageSkeleton = () => {
    return (
        <div className="min-h-screen bg-background w-full">
            {/* Header */}
            <header className="border-b sticky top-0 z-20 shadow-sm backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="hidden md:block">
                            <Skeleton className="h-5 w-40 mb-2" />
                            <Skeleton className="h-4 w-52" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-24 rounded-md" />
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-6 py-8 mt-8">
                {/* Stats Section */}
                <section className="flex flex-wrap -mx-3 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-full sm:w-1/2 lg:w-1/4 px-3 mb-6">
                            <Card className="h-28">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-5 w-16" />
                                    </div>
                                    <Skeleton className="w-12 h-12 rounded-lg" />
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </section>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Profile Section */}
                    <section className="flex-1 space-y-8">
                        <Card>
                            <CardHeader className="flex justify-between items-center border-b">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="w-8 h-8 rounded-lg" />
                                    <div>
                                        <Skeleton className="h-5 w-40 mb-2" />
                                        <Skeleton className="h-4 w-60" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-20 rounded-md" />
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                    <Skeleton className="w-20 h-20 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-6 w-56" />
                                        <Skeleton className="h-4 w-40" />
                                        <div className="flex flex-wrap gap-4">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="w-full md:w-1/2">
                                            <Skeleton className="h-4 w-28 mb-2" />
                                            <Skeleton className="h-10 w-full rounded-lg" />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3 pt-6 border-t">
                                    <Skeleton className="h-10 w-32 rounded-md" />
                                    <Skeleton className="h-10 w-28 rounded-md" />
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 flex flex-col gap-6">
                        {/* Account Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <Skeleton className="h-5 w-40" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                                ))}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <Skeleton className="h-5 w-36" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="h-9 w-full rounded-md" />
                                ))}
                            </CardContent>
                        </Card>

                        {/* Insights */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <Skeleton className="h-5 w-36" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="flex justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </main>
        </div>
    )
}

export default ProfilePageSkeleton
