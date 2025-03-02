"use client";

import * as React from "react";
import {
  CheckIcon,
  ContainerIcon,
  FolderIcon,
  PieChartIcon,
  SearchIcon,
  ShapesIcon,
  WorkflowIcon,
  LucideIcon,
  LanguagesIcon,
  PanelLeft,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { RunnerModel } from "@/lib/models/RunnerModel";
import { useNavigate } from "react-router-dom";
import { useCommandStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";

interface NavItem {
  title: string;
  icon: LucideIcon;
  path: string;
}

interface NavActionItem {
  title: string;
  icon: LucideIcon;
  action: () => void;
}

interface MyCommandProps {
  title: string;
  icon: LucideIcon;
  onNavigate: () => void;
}

const MyCommand: React.FC<MyCommandProps> = ({
  title,
  icon: Icon,
  onNavigate,
}) => (
  <CommandItem onSelect={onNavigate}>
    <Icon />
    <span>{title}</span>
  </CommandItem>
);

export function CommandDialogDemo() {
  //const [open, setOpen] = React.useState(false);
  const { t } = useTranslation()
  const open = useCommandStore((state) => state.isOpen);
  const setOpen = useCommandStore((state) => state.toggleShow);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const sasQuery = useQuery({
    queryKey: ["sas"],
    queryFn: async () => await RunnerModel.getSAS(""),
  });
  const navigate = useNavigate();

  const storage =
    (JSON.parse(localStorage.getItem("favorite")) as string[]) ?? [];

  const { i18n } = useTranslation();
  const { toggleSidebar } = useSidebar();
  const actionItems: NavActionItem[] = [
    {
      title: t('translation:command:switch_lang'),
      icon: LanguagesIcon,
      action: () => {
        i18n.changeLanguage(i18n.language === "en" ? "cs" : "en");
      },
    },
    {
      title: t('translation:command:toggle_side'),
      icon: PanelLeft,
      action: () => {
        toggleSidebar();
      },
    },
  ];

  const navigationItems: NavItem[] = [
    { title: t('translation:homepage:projects_header'), icon: FolderIcon, path: "/projects" },
    { title: t('translation:homepage:runners_header'), icon: ContainerIcon, path: "/runners" },
    { title: t('translation:homepage:jobs_header'), icon: CheckIcon, path: "/jobs" },
    { title: t('translation:metrics:header'), icon: PieChartIcon, path: "/metrics" },
    { title: t('translation:homepage:automations_header'), icon: WorkflowIcon, path: "/automations" },
    { title: t('translation:homepage:types_header'), icon: ShapesIcon, path: "/automationTypes" },
  ];

  return (
    <>
      {/* <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuItem className="flex justify-center">
              <SearchIcon size={15} />
            </SidebarMenuItem>
          </TooltipTrigger>
          <TooltipContent>
            <kbd className="p-4 pointer-events-none inline-flex h-5 select-none mb-2 items-center gap-1 rounded border bg-bg_default px-1.5 font-mono text-sm font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t('translation:command:placeholder')} />
        <CommandList>
          <CommandEmpty>{t('translation:command:noResult')}</CommandEmpty>
          <CommandGroup heading={t('translation:command:favorite')}>
            {storage &&
              (storage as string[]).map((s) => (
                <MyCommand
                  key={s}
                  title={s.slice(4)}
                  icon={FolderIcon}
                  onNavigate={() => {
                    navigate(`/projects/${s}`);
                    setOpen();
                  }}
                />
              ))}
          </CommandGroup>
          <CommandGroup heading={t('translation:command:pages')}>
            {navigationItems.map((item) => (
              <MyCommand
                key={item.path}
                title={item.title}
                icon={item.icon}
                onNavigate={() => {
                  navigate(item.path);
                  setOpen();
                }}
              />
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t('translation:command:actions')}>
            {actionItems.map((item) => (
              <MyCommand
                key={item.title}
                title={item.title}
                icon={item.icon}
                onNavigate={() => {
                  item.action();
                  setOpen();
                }}
              />
            ))}
          </CommandGroup>
          <CommandSeparator />

          <CommandGroup heading={t('translation:command:projects')}>
            {sasQuery.data &&
              (sasQuery.data as string[]).map((s) => (
                <MyCommand
                  key={s}
                  title={s.slice(4)}
                  icon={FolderIcon}
                  onNavigate={() => {
                    navigate(`/projects/${s}`);
                    setOpen();
                  }}
                />
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export function CommandButton() {
  const setOpen = useCommandStore((state) => state.toggleShow);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" onClick={setOpen}>
            <SearchIcon size={8} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span className="text-xs">⌘ K</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
