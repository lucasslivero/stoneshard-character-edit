import { cn } from "@app/libs/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CharacterAbility } from "@shared/entities/CharacterAbility";
import type { CharacterData } from "@shared/entities/CharacterData";
import type { CharacterSave } from "@shared/entities/CharacterSave";
import type { CharactersTree } from "@shared/entities/CharactersTree";
import type { IBodyParts } from "@shared/types/CharacterDataFile";
import { type FormSchema, formSchema } from "@shared/types/Form";
import { PlusIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { type ChangeEvent, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

const STATUS_FORM: {
  key: keyof Omit<FormSchema, "abilities" | "body">;
  label: string;
}[] = [
  { key: "strength", label: "strength" },
  { key: "agility", label: "agility" },
  { key: "perception", label: "perception" },
  { key: "vitality", label: "vitality" },
  { key: "willpower", label: "willpower" },
  { key: "abilityPoints", label: "ability points" },
  { key: "statsPoints", label: "stats points" },
];

export function CharacterDialog({
  savesDirPath,
  characterName,
  characterDir,
  saveName,
  open,
  onClose,
}: {
  savesDirPath: string;
  characterName: string;
  characterDir: string;
  saveName: string;
  open: boolean;
  onClose: (
    character: CharactersTree | null,
    save: CharacterSave | null,
    modalState: boolean,
  ) => void;
}) {
  const [characterData, setCharacterData] = useState<CharacterData | null>(null);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      strength: characterData?.status.strength || 0,
      agility: characterData?.status.agility || 0,
      perception: characterData?.status.perception || 0,
      vitality: characterData?.status.vitality || 0,
      willpower: characterData?.status.willpower || 0,
      abilityPoints: characterData?.status.abilityPoints || 0,
      statsPoints: characterData?.status.statsPoints || 0,
      abilities: characterData?.abilities.filter((ability) => ability.isActive) || [],
      body: characterData?.body || {
        head: 0,
        tors: 0,
        rhand: 0,
        lhand: 0,
        rlegs: 0,
        legs: 0,
      },
    },
  });
  const abilities = useFieldArray({
    control: form.control,
    name: "abilities",
  });
  const [search, setSearch] = useState<string>("");

  function handleAddSkill(data: CharacterAbility) {
    abilities.append(data);
    setSearch("");
  }
  function handleRemoveSkill(index: number) {
    abilities.remove(index);
    setSearch("");
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setSearch(value);
  }

  function handleClose(modalState: boolean) {
    if (modalState === false) {
      onClose(null, null, false);
    }
  }

  function restoreBody() {
    const bodyRestored: IBodyParts = {
      head: 100,
      tors: 100,
      rhand: 100,
      lhand: 100,
      rlegs: 100,
      legs: 100,
    };
    form.setValue("body", bodyRestored, { shouldDirty: true });
  }

  async function onSubmit(data: FormSchema) {
    const result = await window.api.newSave(savesDirPath, characterDir, saveName, data);
    if (result) {
      toast.success("Save created successfully");
      onClose(null, null, false);
    } else {
      toast.error("Error creating save");
    }
  }

  async function handleUnlockAllSkills() {
    const result = await window.api.unlockSkills(savesDirPath, characterDir, saveName);
    if (result) {
      toast.success("Save created successfully");
      onClose(null, null, false);
    }
  }

  useEffect(() => {
    async function main() {
      const data = await window.api.getCharacterSaveData(savesDirPath, characterDir, saveName);
      setCharacterData(data);
    }
    if (open) {
      main();
    }
  }, [open, savesDirPath, characterDir, saveName]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex h-full w-full max-w-none flex-col gap-3 p-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full w-full flex-col gap-2"
          >
            <DialogHeader>
              <DialogTitle>Character Selected</DialogTitle>
            </DialogHeader>
            {characterData && (
              <div className="flex w-full flex-col overflow-hidden">
                <div className="mt mt-2 flex w-full items-center justify-between text-lg">
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1">
                      <span className="font-bold">Char:</span>
                      <span>{characterName || "-"}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="font-bold">Save:</span>
                      <span>{saveName || "-"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1">
                      <span className="font-bold">Dir:</span>
                      <span>{characterDir || "-"}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="font-bold">Game Time:</span>
                      <span>{characterData.gameTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex h-auto w-full gap-1.5 overflow-hidden border">
                  <div className="flex w-1/3 flex-col gap-2">
                    <div className="flex items-center justify-between border-b">
                      Stats
                      <Button
                        className="h-5 w-auto p-0 px-1 text-sm"
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          STATUS_FORM.forEach((item) => {
                            form.resetField(item.key);
                          });
                          form.resetField("body");
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                    <ScrollArea className="h-full w-full">
                      <div className="flex flex-col gap-2 px-1 pb-2">
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
                                      className="h-9 w-28"
                                      {...field}
                                      onChange={(event) =>
                                        field.onChange(Number(event.target.value))
                                      }
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <div className="mt-3 flex items-end justify-center gap-1 text-center font-bold">
                        Body Parts
                        <Button
                          className="h-14 w-auto border-0"
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={restoreBody}
                        >
                          <img
                            src="app://assets/Gwynnels_Elixir.png"
                            className="h-14 cursor-pointer"
                            alt="Button to heal body part"
                          />
                        </Button>
                      </div>
                      <div className="flex w-full gap-1 text-center">
                        <div className="flex w-1/3 flex-col gap-1 pr-1">
                          <div className="flex flex-col gap-1">
                            <span className="whitespace-nowrap">Head</span>
                            <FormField
                              control={form.control}
                              name="body.head"
                              render={({ field }) => (
                                <div className="relative m-0.5 flex rounded ring ring-ring">
                                  <span
                                    className={cn(
                                      "h-6 rounded bg-green-500",
                                      field.value < 100 && "bg-yellow-500",
                                      field.value <= 70 && "bg-orange-500",
                                      field.value <= 45 && "bg-red-500",
                                    )}
                                    style={{
                                      width: `${field.value}%`,
                                    }}
                                  />
                                  <span className="absolute flex w-full justify-center">
                                    {field.value} %
                                  </span>
                                </div>
                              )}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="whitespace-nowrap">Torso</span>
                            <FormField
                              control={form.control}
                              name="body.tors"
                              render={({ field }) => (
                                <div className="relative m-0.5 flex rounded ring ring-ring">
                                  <span
                                    className={cn(
                                      "h-6 rounded bg-green-500",
                                      field.value < 100 && "bg-yellow-500",
                                      field.value <= 70 && "bg-orange-500",
                                      field.value <= 45 && "bg-red-500",
                                    )}
                                    style={{
                                      width: `${field.value}%`,
                                    }}
                                  />
                                  <span className="absolute flex w-full justify-center">
                                    {field.value} %
                                  </span>
                                </div>
                              )}
                            />
                          </div>
                        </div>
                        <div className="flex w-1/3 flex-col gap-1 pr-1">
                          <div className="flex flex-col gap-1">
                            <span className="whitespace-nowrap">R. Hand</span>
                            <FormField
                              control={form.control}
                              name="body.rhand"
                              render={({ field }) => (
                                <div className="relative m-0.5 flex rounded ring ring-ring">
                                  <span
                                    className={cn(
                                      "h-6 rounded bg-green-500",
                                      field.value < 100 && "bg-yellow-500",
                                      field.value <= 70 && "bg-orange-500",
                                      field.value <= 45 && "bg-red-500",
                                    )}
                                    style={{
                                      width: `${field.value}%`,
                                    }}
                                  />
                                  <span className="absolute flex w-full justify-center">
                                    {field.value} %
                                  </span>
                                </div>
                              )}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="whitespace-nowrap">L. Hand</span>
                            <FormField
                              control={form.control}
                              name="body.lhand"
                              render={({ field }) => (
                                <div className="relative m-0.5 flex rounded ring ring-ring">
                                  <span
                                    className={cn(
                                      "h-6 rounded bg-green-500",
                                      field.value < 100 && "bg-yellow-500",
                                      field.value <= 70 && "bg-orange-500",
                                      field.value <= 45 && "bg-red-500",
                                    )}
                                    style={{
                                      width: `${field.value}%`,
                                    }}
                                  />
                                  <span className="absolute flex w-full justify-center">
                                    {field.value} %
                                  </span>
                                </div>
                              )}
                            />
                          </div>
                        </div>
                        <div className="flex w-1/3 flex-col gap-1 pr-1">
                          <div className="flex flex-col gap-1">
                            <span className="whitespace-nowrap">R. Leg</span>
                            <FormField
                              control={form.control}
                              name="body.rlegs"
                              render={({ field }) => (
                                <div className="relative m-0.5 flex rounded ring ring-ring">
                                  <span
                                    className={cn(
                                      "h-6 rounded bg-green-500",
                                      field.value < 100 && "bg-yellow-500",
                                      field.value <= 70 && "bg-orange-500",
                                      field.value <= 45 && "bg-red-500",
                                    )}
                                    style={{
                                      width: `${field.value}%`,
                                    }}
                                  />
                                  <span className="absolute flex w-full justify-center">
                                    {field.value} %
                                  </span>
                                </div>
                              )}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="whitespace-nowrap">L. Leg</span>
                            <FormField
                              control={form.control}
                              name="body.legs"
                              render={({ field }) => (
                                <div className="relative m-0.5 flex rounded ring ring-ring">
                                  <span
                                    className={cn(
                                      "h-6 rounded bg-green-500",
                                      field.value < 100 && "bg-yellow-500",
                                      field.value <= 70 && "bg-orange-500",
                                      field.value <= 45 && "bg-red-500",
                                    )}
                                    style={{
                                      width: `${field.value}%`,
                                    }}
                                  />
                                  <span className="absolute flex w-full justify-center">
                                    {field.value} %
                                  </span>
                                </div>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 text-center font-bold">Buffs / Debuffs</div>
                      <div className="flex gap-1 text-center">
                        <span className="text-muted-foreground">To be implemented.</span>
                      </div>
                    </ScrollArea>
                  </div>
                  <Separator orientation="vertical" className="h-auto w-1" />
                  <div className="flex w-2/3 flex-col">
                    <div className="flex items-center justify-between border-b">
                      <div className="flex items-center gap-2">
                        <span>Abilities</span>
                      </div>
                      <Button
                        className="h-5 w-auto p-0 px-1 text-sm"
                        variant="secondary"
                        type="button"
                        onClick={() => handleUnlockAllSkills()}
                      >
                        Unlock all Skills
                      </Button>
                      <Button
                        className="h-5 w-auto p-0 px-1 text-sm"
                        variant="secondary"
                        type="button"
                        onClick={() =>
                          abilities.replace(
                            characterData.abilities.filter((ability) => ability.isActive) || [],
                          )
                        }
                      >
                        Reset
                      </Button>
                    </div>
                    <div className="flex h-full w-full flex-col gap-2 overflow-hidden">
                      <div className="relative mt-1 h-auto w-full p-1">
                        <SearchIcon className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="text"
                          className="h-autp py-1 pl-9 text-base"
                          value={search}
                          placeholder="Search abilities"
                          onChange={handleSearch}
                        />
                      </div>
                      <div className="flex h-full w-full gap-1 overflow-hidden">
                        <div className="flex h-full w-1/2 flex-col gap-1">
                          <span>Active</span>
                          <ScrollArea className="h-full w-full pr-1">
                            {abilities.fields
                              .filter((item) =>
                                item.skillName.toLowerCase().includes(search.toLowerCase()),
                              )
                              .map((ability, index) => (
                                <div
                                  className="flex w-full items-center justify-between gap-1 border-b p-1"
                                  key={ability.skillName}
                                >
                                  <img
                                    className="h-9 w-9"
                                    src={
                                      ability.iconPath
                                        ? `app://assets/skills/${ability.iconPath}`
                                        : "app://assets/skills/missing.png"
                                    }
                                    alt="Missing Skill Icon"
                                  />
                                  <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                    {ability.skillName}
                                  </span>
                                  {!ability.immutable && (
                                    <div className="h-5 w-5">
                                      <Trash2Icon
                                        className="h-5 w-5 cursor-pointer text-red-600"
                                        onClick={() => handleRemoveSkill(index)}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                          </ScrollArea>
                        </div>

                        <div className="flex h-full w-1/2 flex-col gap-1">
                          <span>Inactive</span>
                          <ScrollArea className="h-full w-full pr-1">
                            {characterData.abilities
                              .filter((ability) => {
                                return (
                                  !abilities.fields.find(
                                    (item) => item.skillName === ability.skillName,
                                  ) &&
                                  ability.skillName.toLowerCase().includes(search.toLowerCase())
                                );
                              })
                              .map((ability) => (
                                <div
                                  className="flex w-full items-center justify-between gap-1 border-b p-1"
                                  key={ability.skillName}
                                >
                                  <img
                                    className="h-9 w-9"
                                    src={
                                      ability.iconPath
                                        ? `app://assets/skills/${ability.iconPath}`
                                        : "app://assets/skills/missing.png"
                                    }
                                    alt="Missing Skill Icon"
                                  />
                                  <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                    {ability.skillName}
                                  </span>
                                  <div className="h-5 w-5">
                                    <PlusIcon
                                      className="h-5 w-5 cursor-pointer text-green-600"
                                      onClick={() => handleAddSkill(ability)}
                                    />
                                  </div>
                                </div>
                              ))}
                          </ScrollArea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!form.formState.isDirty}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
