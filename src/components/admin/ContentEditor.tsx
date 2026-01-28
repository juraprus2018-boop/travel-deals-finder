import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";

type GeneratedContent = Tables<"generated_content">;

interface ContentEditorProps {
  content: GeneratedContent;
  onSaved: () => void;
}

const ContentEditor = ({ content, onSaved }: ContentEditorProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: content.title,
    metaDescription: content.meta_description || "",
    introText: content.intro_text || "",
    mainContent: content.main_content || "",
    tips: content.tips?.join("\n") || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData: TablesUpdate<"generated_content"> = {
        title: formData.title,
        meta_description: formData.metaDescription || null,
        intro_text: formData.introText || null,
        main_content: formData.mainContent || null,
        tips: formData.tips
          ? formData.tips.split("\n").filter((t) => t.trim())
          : [],
      };

      const { error } = await supabase
        .from("generated_content")
        .update(updateData)
        .eq("id", content.id);

      if (error) throw error;

      toast.success("Content opgeslagen!");
      onSaved();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Fout bij opslaan", {
        description: error instanceof Error ? error.message : "Onbekende fout",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Content Bewerken</CardTitle>
          <CardDescription>
            Pas de gegenereerde content aan naar wens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground">
              {formData.title.length}/60 tekens
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              rows={2}
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))
              }
              maxLength={155}
            />
            <p className="text-xs text-muted-foreground">
              {formData.metaDescription.length}/155 tekens
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="introText">Intro Tekst</Label>
            <Textarea
              id="introText"
              rows={3}
              value={formData.introText}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, introText: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainContent">Hoofd Content</Label>
            <Textarea
              id="mainContent"
              rows={10}
              value={formData.mainContent}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, mainContent: e.target.value }))
              }
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tips">Tips (één per regel)</Label>
            <Textarea
              id="tips"
              rows={5}
              placeholder="Tip 1&#10;Tip 2&#10;Tip 3"
              value={formData.tips}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tips: e.target.value }))
              }
            />
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Opslaan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Content Opslaan
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default ContentEditor;
