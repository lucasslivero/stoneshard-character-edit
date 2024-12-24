import { zodResolver } from '@hookform/resolvers/zod';
import { SearchIcon, Trash2Icon } from 'lucide-react';
import { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { cn } from '@app/libs/utils';
import charactersImages from '@assets/characters';
import { CharacterData } from '@shared/entities/CharacterData';
import { CharacterSave } from '@shared/entities/CharacterSave';
import { CharactersTree } from '@shared/entities/CharactersTree';
import { formSchema, FormSchema } from '@shared/types/Form';
import { AbilityDialog } from '@ui/components/AbilityDialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ui/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/ui/avatar';
import { Badge } from '@ui/components/ui/badge';
import { Button } from '@ui/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/components/ui/form';
import { Input } from '@ui/components/ui/input';
import { ScrollArea } from '@ui/components/ui/scroll-area';
import { Separator } from '@ui/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/components/ui/tooltip';

const STATUS_FORM: { key: keyof Omit<FormSchema, 'abilities'>; label: string }[] = [
  { key: 'strength', label: 'strength' },
  { key: 'agility', label: 'agility' },
  { key: 'perception', label: 'perception' },
  { key: 'vitality', label: 'vitality' },
  { key: 'willpower', label: 'willpower' },
  { key: 'abilityPoints', label: 'ability points' },
  { key: 'statsPoints', label: 'stats points' },
  { key: 'level', label: 'level' },
  { key: 'xp', label: 'xp' },
];

export function Home() {
  const [search, setSearch] = useState<string>('');

  const [savesDirPath, setSavesDirPath] = useState<string>('');
  const [characters, setCharacters] = useState<CharactersTree[]>([]);
  const [accordionOpened, setAccordionOpened] = useState<string>('');
  const [saveData, setSaveData] = useState<{
    characterName: string;
    characterDir: string;
    saveName: string;
    activated: string;
    data: CharacterData;
  } | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      strength: saveData?.data.status.strength || 0,
      agility: saveData?.data.status.agility || 0,
      perception: saveData?.data.status.perception || 0,
      vitality: saveData?.data.status.vitality || 0,
      willpower: saveData?.data.status.willpower || 0,
      abilityPoints: saveData?.data.status.abilityPoints || 0,
      statsPoints: saveData?.data.status.statsPoints || 0,
      level: saveData?.data.status.level || 0,
      xp: saveData?.data.status.xp || 0,
      abilities: saveData?.data.abilities.filter((ability) => ability.isActive) || [],
    },
  });
  const abilities = useFieldArray({
    control: form.control,
    name: 'abilities',
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

  async function handleActiveSaveCharacter(character: CharactersTree, save: CharacterSave) {
    const data = await window.api.getCharacterSaveData(
      savesDirPath,
      character.charDir,
      save.saveName,
    );
    setSaveData({
      characterName: character.charName,
      characterDir: character.charDir,
      saveName: save.saveName,
      activated: `${character.charDir}-${save.saveName}`,
      data,
    });
  }

  function handleFocusSave() {
    if (saveData) {
      setAccordionOpened(saveData.characterDir);
    }
  }

  function onAddSkill(data: string[]) {
    for (const item of data) {
      abilities.append({ skillName: item });
    }
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setSearch(value);
  }

  async function onSubmit(data: FormSchema) {
    const result = await window.api.newSave(
      savesDirPath,
      saveData!.characterDir,
      saveData!.saveName,
      data,
    );
    if (result) {
      toast.success('Save created successfully');
    }
  }

  useEffect(() => {
    getSaves();
  }, [getSaves]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full w-full flex-col">
        <div className="flex h-full w-full flex-col gap-2 rounded-lg border border-black p-4 dark:border-white">
          <div className="flex gap-2">
            <div className="flex h-full w-auto items-center whitespace-nowrap">Save Folder:</div>
            <div className="relative flex w-full items-center rounded border border-gray-100 px-2">
              {savesDirPath}
            </div>

            <Button type="button" onClick={handleOpenSaves}>
              Open all saves
            </Button>

            <Button type="submit" disabled={!form.formState.isDirty}>
              Save
            </Button>
          </div>
          <div className="flex h-full w-full gap-2 overflow-hidden">
            <div className="flex w-1/2 flex-col gap-2">
              <ScrollArea className="h-full w-full pr-2">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  value={accordionOpened}
                  onValueChange={setAccordionOpened}
                >
                  {characters.map((character) => (
                    <AccordionItem
                      value={character.charDir}
                      className="border"
                      key={character.charDir}
                    >
                      <AccordionTrigger className="flex border-b py-2">
                        <div className="flex w-full justify-between">
                          <div className="flex items-center gap-2 pl-2">
                            <Avatar>
                              <AvatarImage
                                src={charactersImages[character.charName.toLowerCase()]}
                              />
                              <AvatarFallback>{character.charName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {character.charName}
                          </div>
                          <Badge variant="outline">
                            {character.creationDate.toLocaleDateString()}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex h-full w-full flex-col gap-2">
                          {character.saves.map((save, index) => (
                            <Fragment key={save.saveName}>
                              <button
                                type="button"
                                className={cn(
                                  'relative flex cursor-pointer gap-2 p-2 hover:bg-foreground/20 hover:underline',
                                  saveData?.activated === `${character.charDir}-${save.saveName}` &&
                                    'bg-foreground/20',
                                )}
                                onClick={() => handleActiveSaveCharacter(character, save)}
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
            <Separator orientation="vertical" className="w-1" />
            <div className="flex w-1/2 flex-col">
              {saveData && (
                <>
                  <h1 className="text-center text-2xl">Character Selected</h1>
                  <div
                    className="mt mt-2 flex w-full cursor-pointer flex-col items-center border text-lg"
                    onClick={handleFocusSave}
                  >
                    <div className="flex gap-2">
                      <div className="flex gap-1">
                        <span className="font-bold">Char:</span>
                        <span>{saveData?.characterName || '-'}</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="font-bold">Save:</span>
                        <span>{saveData?.saveName || '-'}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <span>{saveData?.data.gameTime}</span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Game Time</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="flex h-full w-full gap-2 overflow-hidden border border-t-0 px-1 pt-1">
                    <div className="flex w-1/2 flex-col gap-2">
                      <div className="flex items-center justify-between border-b">
                        Stats
                        <Button
                          className="h-5 w-auto p-0 px-1 text-sm"
                          variant="secondary"
                          type="button"
                          onClick={() => STATUS_FORM.forEach((item) => form.resetField(item.key))}
                        >
                          Reset
                        </Button>
                      </div>
                      {STATUS_FORM.map((item) => (
                        <FormField
                          key={item.key}
                          control={form.control}
                          name={item.key}
                          render={({ field }) => (
                            <FormItem className="flex flex-col content-center">
                              <div className="flex items-center justify-between gap-1">
                                <FormLabel className="w-28 content-center capitalize">
                                  {item.label}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    className="w-28"
                                    {...field}
                                    onChange={(event) => field.onChange(Number(event.target.value))}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <Separator orientation="vertical" />
                    <div className="flex w-1/2 flex-col">
                      <div className="flex items-center justify-between border-b">
                        <div className="flex items-center gap-2">
                          <span>Abilities</span>
                          <AbilityDialog
                            abilities={saveData?.data.abilities.filter((ability) => {
                              return !abilities.fields.find(
                                (item) => item.skillName === ability.skillName,
                              );
                            })}
                            onAddSkill={onAddSkill}
                          />
                        </div>
                        <Button
                          className="h-5 w-auto p-0 px-1 text-sm"
                          variant="secondary"
                          type="button"
                          onClick={() =>
                            abilities.replace(
                              saveData?.data.abilities.filter((ability) => ability.isActive) || [],
                            )
                          }
                        >
                          Reset
                        </Button>
                      </div>
                      <ScrollArea className="flex h-full w-full pr-2">
                        <div className="h-auto w-full flex-col gap-2">
                          <div className="relative mt-1 h-full w-full p-1">
                            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                              type="text"
                              className="h-autp py-1 pl-9 text-base"
                              value={search}
                              placeholder="Search abilities"
                              onChange={handleSearch}
                            />
                          </div>
                          {abilities.fields
                            .filter((item) => item.skillName.includes(search))
                            .map((ability, index) => (
                              <div
                                className="flex w-full items-center justify-between gap-1 border-b p-1"
                                key={ability.skillName}
                              >
                                <div className="flex items-center gap-1">
                                  <img
                                    className="h-9 w-9"
                                    src="src/assets/skills/missing.png"
                                    alt="Missing Skill Icon"
                                  />
                                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                    {ability.skillName}
                                  </span>
                                </div>
                                <Trash2Icon
                                  className="h-5 w-5 cursor-pointer text-red-600"
                                  onClick={() => abilities.remove(index)}
                                />
                              </div>
                            ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </>
              )}
              {!saveData && (
                <div className="flex h-full items-center text-center text-2xl">
                  No character selected
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
