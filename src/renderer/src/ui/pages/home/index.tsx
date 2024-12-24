import { Fragment, useCallback, useEffect, useState } from 'react';

import charactersImages from '@assets/characters';
import { CharacterSave } from '@shared/entities/CharacterSave';
import { CharactersTree } from '@shared/entities/CharactersTree';
import { CharacterDialog } from '@ui/components/CharacterDialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ui/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/ui/avatar';
import { Badge } from '@ui/components/ui/badge';
import { Button } from '@ui/components/ui/button';
import { ScrollArea } from '@ui/components/ui/scroll-area';
import { Separator } from '@ui/components/ui/separator';

export function Home() {
  const [savesDirPath, setSavesDirPath] = useState<string>('');
  const [characters, setCharacters] = useState<CharactersTree[]>([]);
  const [activatedSave, setActivatedSave] = useState<{
    characterName: string;
    characterDir: string;
    saveName: string;
    open: boolean;
  }>({
    characterName: '',
    characterDir: '',
    saveName: '',
    open: false,
  });

  const getSaves = useCallback(async (dirPath?: string) => {
    const data = await window.api.getSaves(dirPath);
    if (!data) {
      return;
    }
    setCharacters(data.saves);
    setSavesDirPath(data.path);
  }, []);

  async function handleOpenSaves() {
    const dirPath = await window.api.openFileDialog();
    if (dirPath) {
      getSaves(dirPath);
    }
  }

  async function handleActiveSaveCharacter(
    character: CharactersTree | null,
    save: CharacterSave | null,
    modalState: boolean,
  ) {
    setActivatedSave({
      characterName: character?.charName || '',
      characterDir: character?.charDir || '',
      saveName: save?.saveName || '',
      open: modalState,
    });
  }

  useEffect(() => {
    getSaves();
  }, [getSaves]);

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-lg border border-black p-4 dark:border-white">
      <div className="flex gap-2">
        <div className="flex h-full w-auto items-center whitespace-nowrap">Save Folder:</div>
        <div className="relative flex w-full items-center rounded border border-gray-100 px-2">
          {savesDirPath}
        </div>

        <Button type="button" onClick={handleOpenSaves}>
          Open all saves
        </Button>
      </div>
      <div className="flex h-full w-full gap-2 overflow-hidden">
        <div className="flex w-full flex-col gap-2">
          <ScrollArea className="h-full w-full pr-2">
            <Accordion type="multiple" className="h-full w-full">
              {characters.map((character) => (
                <AccordionItem value={character.charDir} className="border" key={character.charDir}>
                  <AccordionTrigger className="flex border-b py-2">
                    <div className="flex w-full justify-between">
                      <div className="flex items-center gap-2 pl-2">
                        <Avatar>
                          <AvatarImage src={charactersImages[character.charName.toLowerCase()]} />
                          <AvatarFallback>{character.charName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {character.charName}
                      </div>
                      <Badge variant="outline">{character.creationDate.toLocaleDateString()}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex h-full w-full flex-col gap-2">
                      {character.saves.map((save, index) => (
                        <Fragment key={save.saveName}>
                          <button
                            type="button"
                            className="relative flex cursor-pointer gap-2 p-2 hover:bg-foreground/20 hover:underline"
                            onClick={() => handleActiveSaveCharacter(character, save, true)}
                          >
                            <img
                              className="h-20 w-40"
                              src={`atom://${savesDirPath}${save.path}preview.png`}
                              alt="StoneShard save last location preview"
                            />
                            <div className="flex h-full w-full flex-col gap-2">
                              <div className="flex justify-between">
                                <span>{save.saveName}</span>
                                <Badge>{save.saveDate.toLocaleString()}</Badge>
                              </div>
                              <div className="w-full text-start">
                                <Badge variant="secondary">{save.lastLocation}</Badge>
                              </div>
                            </div>
                          </button>
                          {character.saves.length - 1 !== index && <Separator />}
                        </Fragment>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </div>
      </div>
      <CharacterDialog
        {...activatedSave}
        onClose={handleActiveSaveCharacter}
        savesDirPath={savesDirPath}
      />
    </div>
  );
}
