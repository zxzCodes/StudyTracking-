"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Language } from "@prisma/client";
import {toast} from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { removeLanguage } from  '@/app/actions/languages'


const LanguagesList = ({ languages }: { languages: Language[] }) => {

  const router = useRouter();
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});
  const [archiveData, setArchiveData] = useState<Record<string, boolean>>({});

  const handleRemoveLanguage = async (languageId: string) => {

    const shouldArchive = archiveData[languageId] ?? false // if the checkbox is not checked, default to false
    const {error,succes} = await removeLanguage(languageId,shouldArchive)
    if(succes){
      toast.success('Language removed successfully')
      router.refresh()
     
    } else {
      toast.error(error)
    }

    setIsOpen((prev) => ({ ...prev, [languageId]: false })); // close the dialog after removing the language 
   
    
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {languages.length === 0 && (
        <div className="text-sm text-muted-foreground">No languages found</div>
      )}
      {languages.map((language: Language) => {
        return (
          <Card key={language.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{language.name}</CardTitle>
                <AlertDialog
                  open={isOpen[language.id]}
                  onOpenChange={(open) =>
                    setIsOpen((prev) => ({ ...prev, [language.id]: open }))
                  }
                >
                  <AlertDialogTrigger asChild>
                    <Button variant={"ghost"} size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Language</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="space-y-4 p-4">
                      <AlertDialogDescription>
                        Are you sure want to remove {language.name}?
                      </AlertDialogDescription>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`archive-${language.id}`}
                          checked={archiveData[language.id]} // check if the language id is in the archiveData state
                          onCheckedChange={(checked: boolean) =>
                            setArchiveData((prev) => ({
                              ...prev,
                              [language.id]: checked === true,
                            }))
                          } // set the value of the checkbox to the language id in the archiveData state
                        />
                        <label
                        
                          htmlFor={`archive-${language.id}`}
                          className="text-sm text-muted-foreground"
                        >
                          Archive associated goals and study sessions
                        </label>
                      </div>
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveLanguage(language.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <CardDescription>{language.code.toUpperCase()}</CardDescription>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};

export default LanguagesList;