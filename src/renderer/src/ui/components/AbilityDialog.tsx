import { CheckedState } from '@radix-ui/react-checkbox';
import { PlusCircleIcon, SearchIcon } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';

import { CharacterAbility } from '@shared/entities/CharacterAbility';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/components/ui/dialog';

import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';

export function AbilityDialog({
  abilities,
  onAddSkill,
}: {
  abilities: CharacterAbility[];
  onAddSkill: (data: string[]) => void;
}) {
  const [filteredAbilities, setFilteredAbilities] = useState<CharacterAbility[]>(abilities);
  const [search, setSearch] = useState<string>('');
  const [abilitiesAdded, setAbilitiesAdded] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setSearch(value);
    if (value) {
      setFilteredAbilities(abilities.filter((ability) => ability.skillName.includes(value)));
    } else {
      setFilteredAbilities(abilities);
    }
  }

  function handleToggleAbility(checked: CheckedState, skillName: string) {
    if (!checked) {
      setAbilitiesAdded(abilitiesAdded.filter((ability) => ability !== skillName));
    } else {
      setAbilitiesAdded([...abilitiesAdded, skillName]);
    }
  }

  useEffect(() => {
    if (!open) {
      setAbilitiesAdded([]);
      setSearch('');
      setFilteredAbilities(abilities);
    }
  }, [open, setAbilitiesAdded, setSearch, setFilteredAbilities, abilities]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <PlusCircleIcon className="h-5 w-5 cursor-pointer text-green-600" />
      </DialogTrigger>
      <DialogContent className="flex h-4/5 w-1/2 flex-col gap-3">
        <DialogHeader>
          <DialogTitle>Ability list</DialogTitle>
          <DialogDescription>
            Select the abilities you want to use in the character. You can add new abilities by
            searching them in the search bar.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <div className="relative h-full w-full">
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              className="h-autp py-1 pl-9 text-base"
              value={search}
              placeholder="Search abilities"
              onChange={handleSearch}
            />
          </div>
          <Button
            className="w-12"
            variant="secondary"
            type="button"
            onClick={() => setAbilitiesAdded([])}
          >
            Clear
          </Button>
          <Button
            className="w-16"
            type="button"
            disabled={!abilitiesAdded.length}
            onClick={() => {
              setOpen(false);
              onAddSkill(abilitiesAdded);
            }}
          >
            Add
          </Button>
        </div>
        <ScrollArea className="pr-2">
          <div className="flex h-full w-full flex-col gap-2">
            {filteredAbilities.map((ability) => (
              <div
                className="flex w-full items-center justify-between gap-1 border-b p-1"
                key={ability.skillName}
              >
                <Label
                  className="flex cursor-pointer items-center gap-1"
                  htmlFor={ability.skillName}
                >
                  <img
                    className="h-9 w-9"
                    src="src/assets/skills/missing.png"
                    alt="Missing Skill Icon"
                  />
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {ability.skillName}
                  </span>
                </Label>
                <Checkbox
                  id={ability.skillName}
                  checked={abilitiesAdded.includes(ability.skillName)}
                  onCheckedChange={(event) => handleToggleAbility(event, ability.skillName)}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
