"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const formSchema = z.object({
    variableName: z
    .string()
    .min(1, {message: "Variable name is required"})
    .regex(/^[a-zA-Z_$][a-zA-Z0-9_]*$/, 
        {message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores"}),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, { message: "User Prompt is required" }),
});
export type GeminiNodeFormValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: GeminiNodeFormValues) => void;
    defaultValues?: Partial<GeminiNodeFormValues>;
}
export const GeminiNodeDialog =
    ({
        open,
        onOpenChange,
        onSubmit,
        defaultValues = {},
    }: Props) => {
        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                variableName: defaultValues.variableName || "",
                systemPrompt: defaultValues.systemPrompt || "",
                userPrompt: defaultValues.userPrompt || "",
            },
        });

        useEffect(() => {
            form.reset({
                variableName: defaultValues.variableName || "",
                systemPrompt: defaultValues.systemPrompt || "",
                userPrompt: defaultValues.userPrompt || "",
            });
        }, [defaultValues, form]);

        const watchVariableName = form.watch("variableName") || "myGemini"; 

        const handleSubmit = (values: z.infer<typeof formSchema>) => {
            onSubmit(values);
            onOpenChange(false);
        };
        return (
            <Dialog open={open}
                onOpenChange={onOpenChange}
            >

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Gemini Configuration</DialogTitle>
                        <DialogDescription>
                            Configuration settings for Gemini node.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} 
                        className="space-y-4 mt-4"
                        >
                              <FormField
                                control={form.control}
                                name="variableName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Variable Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="myGemini" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Use this name to reference the result in other nodes"{" "}
                                            {`{{${watchVariableName}.text}}`}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="systemPrompt"
                                render={({ field }) => (
                                    <FormItem>
                                            <FormLabel>System Prompt</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder={'You are a helpful assistant.'}
                                                    className="min-h-[80px] font-mono text-sm" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Sets the behaviour of the assistant.Use
                                                {"{{variables}}"} for simple values or {"{{json variables}}"} to
                                                stringify objects.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                control={form.control}
                                name="userPrompt"
                                render={({ field }) => (
                                    <FormItem>
                                            <FormLabel>User Prompt</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder={'Summarize the following text: {{json httpResponse.data}}'}                                                    className="min-h-[80px] font-mono text-sm" {...field} />
                                            </FormControl>
                                            <FormDescription> 
                                                The prompt to send to the AI.Use
                                                {"{{variables}}"} for simple values or {"{{json variables}}"} to
                                                stringify objects.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            <DialogFooter className="mt-4">
                                <Button type="submit">Save</Button>
                            </DialogFooter>
                        </form>
                    </Form>

                </DialogContent>
            </Dialog>
        );
    };