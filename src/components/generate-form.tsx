'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateProductDescription,
  type GenerateProductDescriptionOutput,
} from '@/ai/flows/generate-product-description';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Sparkles, Copy } from 'lucide-react';

const formSchema = z.object({
  productName: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }),
  productDetails: z.string().min(10, {
    message: 'Product details must be at least 10 characters.',
  }),
  platform: z.enum(['Amazon', 'Etsy', 'Shopify']),
});

type FormValues = z.infer<typeof formSchema>;

export function GenerateForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateProductDescriptionOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      productDetails: '',
      platform: 'Etsy',
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setResult(null);
    try {
      const output = await generateProductDescription(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to generate product description. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: `${field} has been copied.`,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Hand-carved Wooden Pinecone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Made from reclaimed oak, natural oil finish, 3 inches tall..."
                        className="resize-y"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide some key features, materials, or dimensions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-commerce Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Amazon">Amazon</SelectItem>
                        <SelectItem value="Etsy">Etsy</SelectItem>
                        <SelectItem value="Shopify">Shopify</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The AI will tailor the output for this platform.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <div className="mt-8 space-y-4">
          <Card>
            <CardHeader>
              <div className="h-6 w-1/4 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-5 w-3/4 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-6 w-1/4 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
            </CardContent>
          </Card>
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-headline font-bold text-center">Generated Content</h2>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-xl">Title</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(result.title, 'Title')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p>{result.title}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-xl">Description</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(result.description, 'Description')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{result.description}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
