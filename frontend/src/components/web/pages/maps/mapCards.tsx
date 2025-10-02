import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Quote } from "lucide-react";
import React from "react";
const TestimonialCard = () => {
    return (
        <Card className="relative w-full max-w-sm bg-muted/70 shadow-none border-none gap-0 pt-0 pb-4">
            <CardHeader className="py-5">
                <div className="flex items-center gap-3">
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-[15px] text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                    ullamcorper, augue at commodo interdum, erat dolor egestas eros, eu
                    finibus turpis nunc at purus. Sed elementum rutrum nibh, a egestas
                    turpis porttitor eu.
                </p>
            </CardContent>
        </Card>
    );
};
export default TestimonialCard;
