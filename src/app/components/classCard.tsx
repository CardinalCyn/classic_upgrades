"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

type ClassCardProps = {
  className: string;
};

export function ClassCard({ className }: ClassCardProps) {
  return (
    <Card className="w-full h-full flex flex-col items-center justify-between overflow-hidden bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="text-center w-full bg-primary text-primary-foreground py-4">
        <CardTitle className="text-2xl font-bold">{className}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex justify-center items-center p-6">
        <div className="relative w-32 h-32">
          <Image
            src={`/images/classIcons/${className.toLowerCase()}.jpg`}
            alt={`${className} icon`}
            fill
            className="object-cover rounded-full border-4 border-primary"
          />
        </div>
      </CardContent>
    </Card>
  );
}
