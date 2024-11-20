import React from "react";

interface TableCelTitleProps {
  title: string;
  text: string;
  searchText?: string;
}

const TableCelTitle: React.FC<TableCelTitleProps> = ({
  title,
  text,
  searchText,
}) => {
  const highlightText = (
    inputText: string,
    search: string
  ): React.ReactNode => {
    const regex = new RegExp(`(${search})`, "gi");
    const parts = inputText.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col">
      <div className="text-base font-semibold text-primary">
        {searchText ? highlightText(title, searchText) : title}
      </div>
      <div className="text-sm font-light text-muted-foreground">{text}</div>
    </div>
  );
};

export default TableCelTitle;
