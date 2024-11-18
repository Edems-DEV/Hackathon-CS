import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
}

export default function SearchBar({
  searchText,
  setSearchText: setSearchText,
}: SearchBarProps) {
  return (
    <div className="relative flex items-center w-1/2">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search size={20} />
      </div>
      <Input
        className="pl-10"
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
      />
      {searchText === "" && (
        <div className="absolute inset-y-0 flex items-center pointer-events-none left-8">
          <p className="ml-2 text-sm">Find</p>
        </div>
      )}
    </div>
  );
}
