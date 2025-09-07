"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, RotateCcw, Sun, Moon, Users } from "lucide-react"
import { useTheme } from "next-themes"

interface SettingsMenuProps {
  onReset: () => void
}

export function SettingsMenu({ onReset }: SettingsMenuProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4 mr-2" />
               Light Mode
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 mr-2" />
               Dark Mode
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onReset} className="cursor-pointer text-destructive focus:text-destructive">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset All Data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
